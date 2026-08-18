export interface CheckResult {
  name: string;
  passed: boolean;
  category: string;
  description: string;
}

interface SecurityRule {
  id: string;
  name: string;
  category: string;
  description: string;
  enabled: boolean;
  check: (text: string) => boolean;
}

const rules: SecurityRule[] = [
  {
    id: "html-injection",
    name: "HTML Injection",
    category: "input",
    description: "Detects embedded HTML tags that could manipulate page structure",
    enabled: true,
    check: (text) => !/<[a-z][\s\S]*>/i.test(text),
  },
  {
    id: "javascript-injection",
    name: "JavaScript Injection",
    category: "input",
    description: "Detects JavaScript code patterns and event handlers",
    enabled: true,
    check: (text) =>
      !/\b(javascript:|on\w+\s*=|eval\s*\(|Function\s*\(|setTimeout|setInterval|alert\s*\()/i.test(text),
  },
  {
    id: "sql-injection",
    name: "SQL Injection",
    category: "input",
    description: "Detects SQL keywords and patterns that could manipulate database queries",
    enabled: true,
    check: (text) =>
      !/(\bDROP\b|\bDELETE\b|\bINSERT\b|\bUPDATE\b|\bSELECT\b|\bUNION\b|\bOR\b\s+\d+=\d+|--|;.*--)/i.test(text),
  },
  {
    id: "prompt-injection",
    name: "Prompt Injection",
    category: "input",
    description: "Detects attempts to override or hijack AI instructions",
    enabled: true,
    check: (text) =>
      !/(ignore\s+(previous|prior|above|all)\s+instructions?|forget\s+(everything|what|your)|disregard\s+(your|all|previous)|you\s+are\s+now|act\s+as\s+(if|though|a)|new\s+persona|system\s+prompt|DAN\s+mode|jailbreak)/i.test(
        text
      ),
  },
  {
    id: "base64-injection",
    name: "Base64 Injection",
    category: "input",
    description: "Detects base64-encoded content that may hide malicious payloads",
    enabled: true,
    check: (text) => {
      // Look for long base64 strings (>20 chars of base64 alphabet)
      const b64Pattern = /[A-Za-z0-9+/]{20,}={0,2}/g;
      const matches = text.match(b64Pattern) || [];
      for (const match of matches) {
        try {
          const decoded = atob(match);
          if (/script|DROP|SELECT|eval|javascript:/i.test(decoded)) return false;
        } catch {
          // not valid base64, skip
        }
      }
      return true;
    },
  },
  {
    id: "xss",
    name: "XSS",
    category: "input",
    description: "Detects Cross-Site Scripting patterns including script tags and data URIs",
    enabled: true,
    check: (text) =>
      !/<script[\s\S]*?>[\s\S]*?<\/script>|<script|data:text\/html|javascript:/i.test(text),
  },
  {
    id: "max-length",
    name: "Maximum Length",
    category: "input",
    description: "Enforces a maximum input length of 10,000 characters",
    enabled: true,
    check: (text) => text.length <= 10000,
  },
];

export function runSecurityChecks(text: string): {
  passed: boolean;
  blockedBy: string | null;
  checks: CheckResult[];
} {
  const checks: CheckResult[] = [];
  let firstFailure: string | null = null;

  for (const rule of rules) {
    if (!rule.enabled) continue;
    const passed = rule.check(text);
    checks.push({
      name: rule.name,
      passed,
      category: rule.category,
      description: rule.description,
    });
    if (!passed && firstFailure === null) {
      firstFailure = rule.name;
    }
  }

  return {
    passed: firstFailure === null,
    blockedBy: firstFailure,
    checks,
  };
}

export function getSecurityRules() {
  return rules.map(({ check: _check, ...r }) => r);
}
