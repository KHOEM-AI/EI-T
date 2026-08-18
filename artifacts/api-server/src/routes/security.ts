import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, validationHistoryTable } from "@workspace/db";
import {
  ValidateInputBody,
  GetValidationHistoryQueryParams,
  ValidateInputResponse,
  GetValidationHistoryResponse,
  GetSecurityStatsResponse,
  GetSecurityRulesResponse,
} from "@workspace/api-zod";
import { runSecurityChecks, getSecurityRules } from "../lib/securityEngine";

const router: IRouter = Router();

router.post("/security/validate", async (req, res): Promise<void> => {
  const parsed = ValidateInputBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { text } = parsed.data;
  const result = runSecurityChecks(text);

  const [row] = await db
    .insert(validationHistoryTable)
    .values({
      text,
      passed: result.passed,
      blockedBy: result.blockedBy,
      checks: result.checks,
    })
    .returning();

  res.json(
    ValidateInputResponse.parse({
      id: row.id,
      text: row.text,
      passed: row.passed,
      blockedBy: row.blockedBy ?? null,
      checks: row.checks,
      timestamp: row.createdAt.toISOString(),
    })
  );
});

router.get("/security/history", async (req, res): Promise<void> => {
  const query = GetValidationHistoryQueryParams.safeParse(req.query);
  const limit = query.success ? (query.data.limit ?? 20) : 20;

  const rows = await db
    .select()
    .from(validationHistoryTable)
    .orderBy(desc(validationHistoryTable.createdAt))
    .limit(limit);

  res.json(
    GetValidationHistoryResponse.parse(
      rows.map((r) => ({
        id: r.id,
        text: r.text,
        passed: r.passed,
        blockedBy: r.blockedBy ?? null,
        checks: r.checks,
        timestamp: r.createdAt.toISOString(),
      }))
    )
  );
});

router.get("/security/stats", async (_req, res): Promise<void> => {
  const rows = await db.select().from(validationHistoryTable);

  const totalValidated = rows.length;
  const totalBlocked = rows.filter((r) => !r.passed).length;
  const totalPassed = rows.filter((r) => r.passed).length;

  const blocksByType: Record<string, number> = {};
  for (const row of rows) {
    if (!row.passed && row.blockedBy) {
      blocksByType[row.blockedBy] = (blocksByType[row.blockedBy] ?? 0) + 1;
    }
  }

  res.json(
    GetSecurityStatsResponse.parse({
      totalValidated,
      totalBlocked,
      totalPassed,
      blocksByType,
    })
  );
});

router.get("/security/rules", async (_req, res): Promise<void> => {
  const rules = getSecurityRules();
  res.json(GetSecurityRulesResponse.parse(rules));
});

export default router;
