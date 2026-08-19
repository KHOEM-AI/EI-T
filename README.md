# 🌐 KHOEM-AI

# 🌐 EI-T
EI-T/
├── artifacts/
│   ├── api-server/
│   │   ├── .repli-artifact/
│   │   │   └── artifact.toml
│   │   ├── dist/
│   │   │   ├── index.mjs
│   │   │   ├── pino-pretty.mjs
│   │   │   ├── pino-worker.mjs
│   │   │   ├── pino-file.mjs.map
│   │   │   ├── thread-stream-worker.mjs
│   │   │   ├── thread-stream-worker.mjs.map
│   │   │   ├── pino-file.mjs
│   │   │   ├── pino-worker.mjs.map
│   │   │   └── pino-pretty.mjs.map
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── .gitkeep
│   │   │   │   ├── logger.ts
│   │   │   │   └── securityEngine.ts
│   │   │   ├── middlewares/
│   │   │   │   └── .gitkeep
│   │   │   ├── routes/
│   │   │   │   ├── health.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── security.ts
│   │   │   └── app.ts
│   │   ├── build.mjs
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── khoem-ai/
│       ├── public/
│       │   ├── favicon.svg
│       │   └── robots.txt
│       ├── src/
│       │   ├── components/
│       │   │   ├── ui/
│       │   │   │   ├── accordion.tsx
│       │   │   │   ├── alert-dialog.tsx
│       │   │   │   ├── alert.tsx
│       │   │   │   ├── aspect-ratio.tsx
│       │   │   │   ├── avatar.tsx
│       │   │   │   ├── badge.tsx
│       │   │   │   ├── breadcrumb.tsx
│       │   │   │   ├── button-group.tsx
│       │   │   │   ├── button.tsx
│       │   │   │   ├── calendar.tsx
│       │   │   │   ├── card.tsx
│       │   │   │   ├── carousel.tsx
│       │   │   │   ├── chart.tsx
│       │   │   │   ├── checkbox.tsx
│       │   │   │   ├── collapsible.tsx
│       │   │   │   ├── command.tsx
│       │   │   │   ├── context-menu.tsx
│       │   │   │   ├── dialog.tsx
│       │   │   │   ├── drawer.tsx
│       │   │   │   ├── navigation-menu.tsx
│       │   │   │   ├── pagination.tsx
│       │   │   │   ├── popover.tsx
│       │   │   │   ├── progress.tsx
│       │   │   │   ├── radio-group.tsx
│       │   │   │   ├── resizable.tsx
│       │   │   │   ├── scroll-area.tsx
│       │   │   │   ├── select.tsx
│       │   │   │   ├── separator.tsx
│       │   │   │   ├── sheet.tsx
│       │   │   │   ├── sidebar.tsx
│       │   │   │   ├── skeleton.tsx
│       │   │   │   ├── slider.tsx
│       │   │   │   ├── sonner.tsx
│       │   │   │   ├── spinner.tsx
│       │   │   │   ├── switch.tsx
│       │   │   │   ├── table.tsx
│       │   │   │   ├── tabs.tsx
│       │   │   │   ├── textarea.tsx
│       │   │   │   ├── toast.tsx
│       │   │   │   ├── toaster.tsx
│       │   │   │   ├── toggle-group.tsx
│       │   │   │   ├── toggle.tsx
│       │   │   │   └── tooltip.tsx
│       │   │   └── layout.tsx
│       │   ├── hooks/
│       │   │   ├── use-dark-mode.ts
│       │   │   ├── use-mobile.tsx
│       │   │   └── use-toast.ts
│       │   ├── lib/
│       │   │   └── utils.ts
│       │   ├── pages/
│       │   │   ├── dashboard.tsx
│       │   │   ├── not-found.tsx
│       │   │   ├── rules.tsx
│       │   │   └── scanner.tsx
│       │   ├── App.tsx
│       │   ├── index.css
│       │   └── main.tsx
│       ├── index.css
│       ├── index.html
│       ├── package.json
│       ├── tsconfig.json
│       └── vite.config.ts
├── lib/
│   ├── api-client-react/
│   │   ├── src/
│   │   │   ├── generated/
│   │   │   │   ├── api.schemas.ts
│   │   │   │   └── api.ts
│   │   │   ├── custom-fetch.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── api-spec/
│   │   ├── openapi.yaml
│   │   ├── orval.config.ts
│   │   └── package.json
│   ├── api-zod/
│   │   ├── src/
│   │   │   ├── generated/
│   │   │   │   ├── types/
│   │   │   │   │   ├── checkResult.ts
│   │   │   │   │   ├── getValidationHistoryParams.ts
│   │   │   │   │   ├── healthStatus.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── securityRule.ts
│   │   │   │   │   ├── securityStats.ts
│   │   │   │   │   ├── securityStatsBlocksByType.ts
│   │   │   │   │   ├── validationInput.ts
│   │   │   │   │   └── validationResult.ts
│   │   │   │   └── api.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── db/
│       ├── src/
│       │   ├── schema/
│       │   │   ├── index.ts
│       │   │   └── security.ts
│       │   └── index.ts
│       ├── drizzle.config.ts
│       ├── package.json
│       └── tsconfig.json
├── scripts/
│   ├── src/
│   │   └── hello.ts
│   ├── package.json
│   ├── post-merge.sh
│   └── tsconfig.json
├── .gitignore
├── .npmrc
├── .replit
├── .replitignore
├── README.md
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── replit.md
├── tsconfig.base.json
└── tsconfig.json

# ​📊 របាយការណ៍សរុបរចនាសម្ព័ន្ធ EI-T Monorepo
  Architecture
        
# ផ្នែក និង ថតសំខាន់ៗ (Directory / Module)ចំនួនឯកសារសមាមាត្រ (%)មុខងារ និង បេសកកម្មចម្បង (Core Responsibility)
🧱 artifacts/khoem-ai6349.6%Frontend Application (Vite + React, UI Library, Pages & Layouts)
📦 lib/2822.0%Shared Libraries (API Schemas, Zod, React Client, DB Models)
⚡ artifacts/api-server2116.5%Backend API Engine (Fastify/Express Server, Security Engine, Dist)
⚙️ Root Directory118.7%Monorepo Core Configs (pnpm Workspace, Replit, TS Base Config)
🛠️ scripts/43.2%Automation & CI/CD (Build Hooks & Deployment Scripts)
🏆 សរុបរួម (Grand Total)127100%រចនាសម្ព័ន្ធ Project ទាំងមូលនៃ EI-T Ecosystem

# ទិន្នន័យលម្អិត និង ការបែងចែកតាមផ្នែក (Deep-Dive Architecture Breakdown)
​🔹 1. Frontend Web Application (khoem-ai) — 63 ឯកសារ (49.6%)
​🧱 UI Components (ui/) : 44 ឯកសារ — Design System (Accordion, Button, Dialog, Table, Tabs, Sonner, ល)
​📄 Pages & Layout : 05 ឯកសារ — Application Views (dashboard, scanner, rules, not-found, layout)
​🪝 Hooks & Utilities : 04 ឯកសារ — Custom Logic (use-dark-mode, use-mobile, use-toast, utils)
​⚙️ Setup & Configs : 10 ឯកសារ — App Entry & Build Settings (App.tsx, main.tsx, vite.config.ts, public/, ល)
​🔹 2. Shared Monorepo Packages (lib/) — 28 ឯកសារ (22.0%)
​🛡️ api-zod : 13 ឯកសារ — Zod Validation Models & Generated TypeScript Types
​🔗 api-client-react : 06 ឯកសារ — Generated React API Hooks & Custom Fetch Engine
​🗄️ db : 06 ឯកសារ — Drizzle ORM Schemas, Security Tables & Database Configs
​📑 api-spec : 03 ឯកសារ — OpenAPI Specification & Orval Code Generator Specs
​🔹 3. Core Backend API Server (api-server) — 21 ឯកសារ (16.5%)
​📦 Built Output (dist/) : 09 ឯកសារ — Production JS Bundles & Source Maps (.mjs, .map)
​🧠 Source Code (src/) : 09 ឯកសារ — Express Routes, Logger & Security Validation Engine
​🛠️ Server Controls : 03 ឯកសារ — Package Configurations (package.json, tsconfig.json, build.mjs)
​🔹 4. Infrastructure & Automation Scripts — 15 ឯកសារ (11.9%)
​⚙️ Root Configurations : 11 ឯកសារ — Workspace Settings (pnpm-workspace.yaml, .replit, tsconfig.base.json, ល)
​📜 Utility Scripts : 04 ឯកសារ — Git Automation Hooks & Pipeline Scripts (post-merge.sh, hello.ts, ល)
<details>
  <summary>🎓 Sololearn Certificates & Learn AI Courses</summary>

  <h3>🎓 Sololearn Certificates</h3>
  <ul>
    <li>1. <a href="https://api2.sololearn.com/v2/certificates/CC-XE2NCCOS/image/png?t=639128640620412910">Certificate 1</a></li>
    <li>2. <a href="https://api2.sololearn.com/v2/certificates/CC-2WA6T5OP/image/png?t=639128878454665520">Certificate 2</a></li>
    <li>3. <a href="https://api2.sololearn.com/v2/certificates/CC-UH3IDFBV/image/png?t=639129091230893450">Certificate 3</a></li>
    <li>4. <a href="https://api2.sololearn.com/v2/certificates/CC-HYTVRR3L/image/png?t=639129398817280440">Certificate 4</a></li>
    <li>5. <a href="https://api2.sololearn.com/v2/certificates/CC-X96HYFNZ/image/png?t=639133794186112300">Certificate 5</a></li>
    <li>6. <a href="https://api2.sololearn.com/v2/certificates/CC-Z3HSTTIM/image/png?t=639130143940270740">Certificate 6</a></li>
    <li>7. <a href="https://api2.sololearn.com/v2/certificates/CC-CWFGHTUH/image/png?t=639133720572463890">Certificate 7</a></li>
    <li>8. <a href="https://api2.sololearn.com/v2/certificates/CC-LSNWACSJ/image/png?t=639131461304257820">Certificate 8</a></li>
    <li>9. <a href="https://api2.sololearn.com/v2/certificates/CC-8YU78BQD/image/png?t=639132372756953970">Certificate 9</a></li>
    <li>10. <a href="https://api2.sololearn.com/v2/certificates/CC-HKXN70WI/image/png?t=639132403450505960">Certificate 10</a></li>
    <li>11. <a href="https://api2.sololearn.com/v2/certificates/CC-Z4FBVBHB/image/png?t=639132438185127310">Certificate 11</a></li>
    <li>12. <a href="https://api2.sololearn.com/v2/certificates/CC-O8RLTDHU/image/png?t=639132485355121790">Certificate 12</a></li>
    <li>13. <a href="https://api2.sololearn.com/v2/certificates/CC-JXYYNWM3/image/png?t=639132517092063730">Certificate 13</a></li>
    <li>14. <a href="https://api2.sololearn.com/v2/certificates/CC-UAWDOGD7/image/png?t=639132551108277950">Certificate 14</a></li>
    <li>15. <a href="https://api2.sololearn.com/v2/certificates/CC-RU0YW9AF/image/png?t=639132622582618440">Certificate 15</a></li>
    <li>16. <a href="https://api2.sololearn.com/v2/certificates/CC-6MMYUTDO/image/png?t=639133281167127080">Certificate 16</a></li>
    <li>17. <a href="https://api2.sololearn.com/v2/certificates/CC-ZCCL5WTO/image/png?t=639133319039254850">Certificate 17</a></li>
    <li>18. <a href="https://api2.sololearn.com/v2/certificates/CC-8ANKARHZ/image/png?t=639133353114898540">Certificate 18</a></li>
    <li>19. <a href="https://api2.sololearn.com/v2/certificates/CC-6YTRBFWG/image/png?t=639133771918688590">Certificate 19</a></li>
    <li>20. <a href="https://api2.sololearn.com/v2/certificates/CC-IPBPLVJY/image/png?t=639138668032846180">Certificate 20</a></li>
    <li>21. <a href="https://api2.sololearn.com/v2/certificates/CC-OSVHPH0W/image/png?t=639146158504658560">Certificate 21</a></li>
    <li>22. <a href="https://api2.sololearn.com/v2/certificates/CC-JYPRRMIU/image/png?t=639171253054913090">Certificate 22</a></li>
    <li>23. <a href="https://api2.sololearn.com/v2/certificates/CC-4LH8JFHT/image/png?t=639222496877388080">Certificate 23</a></li>
  </ul>

  <h3>🤖 Learn AI Course</h3>
  <ul>
    <li>24. <a href="https://api2.sololearn.com/v2/certificates/CC-GENAI-PRACTICE/image/png">Certificate 24 (Generative AI in Practice)</a></li>
  </ul>
</details>


