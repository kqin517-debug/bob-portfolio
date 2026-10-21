# 第 0 步独立验收报告（静态核查）

- **任务**：task-3（rev 4，已由 verifier 认领）— 配置 / CI / 源码只读静态验收
- **验收人**：verifier（独立于 task-1 owner=lead、task-2 owner=ui-fixer）
- **验收时间**：2026-10-20 06:26–06:45 (America/Los_Angeles)
- **被验收对象锚点**：工作区 `C:\Users\ASUS\OneDrive\Desktop\Wbesite Page2`，30 个源文件（排除 node_modules/.next/out/.git），逐文件 SHA-256 与 `D:\_verify\step0` 快照（06:27 采集）对比 **0 处差异**，最新源文件 mtime = 06:26:58（早于快照采集），故下述结论对应的是**当前修订**，且验收期间无 writer 写入。
- **写作用域**：本报告 `VERIFY_STEP0.md`。未修改 next.config.mjs / .github/ / src/ / tailwind.config.ts。辅助脚本放在仓库外 `D:\_verify\_tools\`（不属于交付物）。
- **按指令未在工作区内运行 `next build`**；构建证据来自 task-4 的 `D:\_verify\step0` 干净重建（另见 `VERIFY_BUILD_D.md`）。

## 【结论：有条件通过】

task-3 的 8 项静态验收标准中，**5 项完全通过**（配置、CI、.nojekyll、.gitignore、失效类修复），**1 项部分通过**（真实性修复只做了一半：sidebar 徽标已派生，但同一数据源仍被 `"48+"` 打脸），**1 项按要求"只标注不判通过"**（遗留不实信息），**1 项发现新缺陷**（`#overview` 锚点不存在，Dashboard 点击为静默空操作）。另有 2 项"未能验证"必须显式声明（见文末）。

---

## 逐条证据

### 1. next.config.mjs（通过）

命令（在工作区可读副本 `D:\_verify\step0` 上执行，文件与工作区逐字节一致）：

```
node --input-type=module -e "import('file:///D:/_verify/step0/next.config.mjs').then(m=>console.log(JSON.stringify(m.default,null,2)))"
```

原始输出（环境变量未设置）：

```json
{ "output": "export", "trailingSlash": true, "images": { "unoptimized": true } }
```

原始输出（`NEXT_PUBLIC_BASE_PATH=/website-page2`）：

```json
{ "output": "export", "trailingSlash": true, "images": { "unoptimized": true },
  "basePath": "/website-page2", "assetPrefix": "/website-page2" }
```

- 三项必需配置同时存在 ✓；`basePath`/`assetPrefix` **仅**在环境变量存在时注入 ✓（源码 `next.config.mjs:14-19` 为条件展开）。
- `images.unoptimized: true` 保留，且项目确实使用了 `next/image`（`src/components/layout/Sidebar.tsx:4,175`），两种模式构建均 exit=0，产物中引用 `out/images/avatar.png`（517102 B）为原样透传，无 `/_next/image` 优化路由。

### 2. .github/workflows/deploy.yml（通过，**结构化解析**）

命令（`yaml@2.9.1` 装于仓库外 `D:\_verify\_tools`）：

```
node D:\_verify\_tools\check-workflow.js "C:\Users\ASUS\OneDrive\Desktop\Wbesite Page2\.github\workflows\deploy.yml"
```

原始输出（节选）：

```
=== all actions used (job:action@version) ===
  build:actions/checkout@v4
  build:actions/setup-node@v4
  build:actions/configure-pages@v5
  build:actions/upload-pages-artifact@v3
  deploy:actions/deploy-pages@v4
=== npm run build env ===
  NEXT_PUBLIC_BASE_PATH = "/${{ github.event.repository.name }}"
=== assertions ===
PASS  top-level `on` key present (parsed as "on")
PASS  on.push.branches            PASS  on.workflow_dispatch present
PASS  permissions.contents=read   PASS  permissions.pages=write   PASS  permissions.id-token=write
PASS  concurrency.group=pages
PASS  setup-node with.node-version=20   PASS  with.cache=npm
PASS  upload-pages-artifact with.path=out
PASS  build run steps = ["npm ci","npm run build"]
PASS  deploy.needs=build   PASS  environment.name=github-pages
PASS  deploy-pages step has id=deployment   PASS  environment.url=${{ steps.deployment.outputs.page_url }}
RESULT: 20/20 assertions passed, FAILED=0
STRUCTURED PARSE: yes (yaml@2.9.1, YAML 1.2 core schema)
```

- YAML 1.2 解析下 `on` 保持字符串键（GitHub Actions 语义正确）；无缩进/重复键错误。
- 支持 `npm ci` 的前提也实测通过：`package-lock.json`（73061 B）存在，且在 D: 副本中 `node <npm-cli.js> ci --dry-run` → **up to date in 689ms, exit=0**，即 lockfile 与 package.json 同步，CI 不会因 lockfile 失配而失败。

### 3. public/.nojekyll（通过）

```
Get-ChildItem "…\public" -Recurse -Force        # rel / Length
  .nojekyll          0                           Archive, ReparsePoint
  images\avatar.png  517102
  images\bg-wave.png 1049044
```

`.nojekyll` 存在且为 **0 字节空文件** ✓；两种构建模式产物中均复制为 `out/.nojekyll`（size=0，见 task-4 审计）。

> 说明性更正（非缺陷）：本工作流使用 `upload-pages-artifact@v3` + `deploy-pages@v4` 的**artifact 部署**，GitHub 不对其做 Jekyll 处理，因此 `.nojekyll` 在该路径下**并非必需**；它的实际价值在于将来若改用 `gh-pages` 分支式（legacy Jekyll）部署时保护 `_next` 下划线目录。保留无害，任务描述中"这是关键"的说法只对 legacy 部署成立。

### 4. .gitignore 与 git 状态（通过，附带一个缺口）

```
git check-ignore -v -- <path>
IGNORED  node_modules  -> .gitignore:2:/node_modules
IGNORED  .next         -> .gitignore:8:/.next/
IGNORED  out           -> .gitignore:9:/out/
IGNORED  next-env.d.ts -> .gitignore:10:next-env.d.ts
IGNORED  tsconfig.tsbuildinfo -> .gitignore:16:*.tsbuildinfo
IGNORED  .env          -> .gitignore:33:.env
IGNORED  .env.local    -> .gitignore:34:.env*.local
NOT-IGNORED .env.production (exit 1)
git status --porcelain | 匹配 node_modules|.next|out  →  NO LEAK (0 entries)
branch: main        remotes: []        commit count: 0
```

- 任务要求的 node_modules / .next / out / *.tsbuildinfo / next-env.d.ts / env 均被忽略 ✓，`git status` 无泄漏 ✓，默认分支 `main` ✓。
- `public/.nojekyll`、`.github/workflows/deploy.yml` 均**未被忽略**：`git add --dry-run -- public/.nojekyll` → `add 'public/.nojekyll'` ✓（会正常入库）。
- **缺口**：`.env.production` / `.env.development` / `.env.test` 未被忽略（`Next.js` 会读取 `.env.production`）。当前仓库内无任何 `.env*` 文件（实测 0 个），故无即时泄露，但属于潜在密钥入库风险。

### 5. 失效类修复（通过，**以产物 CSS 为准**）

源码搜索（`src/**/*.tsx`）：

```
Sidebar.tsx:389            animate-spin-slow
FeaturedSnippets.tsx:54    scrollbar-none
FeaturedProjects.tsx:73    line-clamp-3
SearchCommandModal.tsx:64  animate-fade-in
SearchCommandModal.tsx:113,150  line-clamp-1
（w-13 / h-13 / animate-in / duration-200 → 0 处）
```

构建产物 `out/_next/static/css/5290a0de586afe78.css`（37757 B，两种模式同一 hash）中真实存在：

```css
.line-clamp-1{-webkit-line-clamp:1}.line-clamp-1,.line-clamp-3{overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical}.line-clamp-3{-webkit-line-clamp:3}
.scrollbar-none{-ms-overflow-style:none;scrollbar-width:none}.scrollbar-none::-webkit-scrollbar{display:none;width:0;height:0}
@keyframes spin-slow{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}.animate-spin-slow{animation:spin-slow 8s linear infinite}
@keyframes fade-in{0%{opacity:0}to{opacity:1}}.animate-fade-in{animation:fade-in .2s cubic-bezier(.16,1,.3,1) both}
@media (prefers-reduced-motion:reduce){.animate-fade-in{animation-duration:1ms}}
```

- `.w-13` / `.h-13` / `animate-in` 在产物 CSS 中 **0 匹配** ✓（确已消失）。
- `line-clamp-1/3` 由 Tailwind 3.4 核心直接产出（实测 tailwindcss@3.4.19），ui-fixer"无需改动"的说法**经验证为真**。
- `scrollbar-none` 定义于 `globals.css:40-48`；`animate-spin-slow` 定义于 `tailwind.config.ts:46-56`（animation + keyframes 齐备）；`animate-fade-in` 定义于 `globals.css:229-240`，**语义完整**：时长（200ms）与缓动写在工具类内，并带 `prefers-reduced-motion` 降级——不依赖 `duration-200`，也不是半成品类。
- 类定义写在 `@tailwind utilities` 之后且未置于 `@layer` 中，不会被 purge 掉（产物 CSS 中已证实存在）。

### 6. 真实性修复（部分通过）

产物 HTML（默认模式，`out_default/index.html`）实测：

```
Snippets Hub ... <span class="…bg-gradient-to-b from-[#ff5126] to-[#dd1600]">3</span>   ← 徽标=3，来自 featuredSnippets.length
Analytics ... <button type="button" disabled="" aria-disabled="true" …>Soon</span>
Settings  ... <button type="button" disabled="" aria-disabled="true" …>Soon</span>
>v2.5<  → 1
```

- 徽标派生自数据 ✓：`Sidebar.tsx:86` `badge: String(featuredSnippets.length)`，`src/data/snippets.ts` 实为 3 条；产物渲染为 `3`（`>48<` 的 1 处匹配经核实是代码查看器的**行号 48**，非徽标）。
- Analytics/Settings ✓：`Sidebar.tsx:107-115`（disabled/badge "Soon"/title）与 `Sidebar.tsx:343-362`；渲染为原生 `disabled` + `aria-disabled="true"`（产物中 2 处），无法再被当作有效跳转。
- `"99.9%"`（sidebar 徽标那个确切字符串）已不存在 ✓（仅剩 `Sidebar.tsx:111` 的说明注释）。
- ❌ **但同类谎言仍在别处发货**：`src/data/profile.ts:39` `value: "48+"`（label "Curated Snippets"，trend "+12 this month"）与真实数据（3 条）**直接矛盾**，并已渲染进 `out/index.html` 的指标卡；同一处还有 `:45 "3.2k"`、`:51 "99.98%"`、`projects.ts:54 "99.99% Hit Ratio"`。即：侧边栏说 3、首页说 48+，**自相矛盾**。任务 B1 只修了徽标一处，未覆盖同一事实的其他呈现点。

### 7. basePath 资源修复（通过，端到端证实）

```
src/lib/utils.ts:16-20   const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";  export function assetPath(path){ return `${BASE_PATH}${path}`; }
AmbientBackground.tsx:5,40   import { assetPath } … src={assetPath("/images/bg-wave.png")}
Sidebar.tsx:25,176           import { assetPath } … src={assetPath(profileData.avatar)}   (profile.ts:30 avatar:"/images/avatar.png")
```

- 全项目 `src/**/*.tsx` 中 `images/` 只出现这 2 处引用，**无绕过 assetPath 的 public 资源引用** ✓；`public/` 仅 3 个文件（.nojekyll + 2 图），全部有归属；CSS 源码中 `url(` 引用数 = 0（`globals.css`），不存在会漏前缀的 CSS 背景图。
- 产物级证据（在 D: 干净副本上分别构建，见 `VERIFY_BUILD_D.md`）：
  - 子路径模式：`index.html` 中 root-absolute URL 12 个**全部**带 `/website-page2`，未加前缀 **0 处**；`src="/images/` **0 处**；23 个产物文件全量扫描**无一处**未加前缀。
  - 默认模式：引用回归 `/images/avatar.png`、`/images/bg-wave.png`、`/_next/...`，`/website-page2` 出现 **0 次**（`BASE_PATH=""` 时无多余前缀）✓。

### 8. 仍会误导用户的占位/不实信息（按要求"只标注、不判通过"）

| 位置 | 内容 | 性质 |
|---|---|---|
| `src/data/profile.ts:39` | `"48+"` Curated Snippets（+trend "+12 this month"） | **与真实数据 3 条矛盾**（见第 6 条） |
| `src/data/profile.ts:45` | `"3.2k"` Open Source Stars（trend "Top 5% dev"） | 无法证实的虚构影响力 |
| `src/data/profile.ts:51` | `"99.98%"` Production Deployments（trend "Stable"） | 虚构指标，且"部署次数=百分比"本身语义错误 |
| `src/data/projects.ts:54` | `"99.99% Hit Ratio"` | 虚构性能指标 |
| `src/data/projects.ts:27,41,55` | `https://demo.example.com/*` | 占位演示链接 |
| `src/data/projects.ts:28,42,56` | `https://github.com/example/*` | 占位仓库链接 |
| `src/data/profile.ts:63,65` / `Sidebar.tsx:365,379` / `HeaderToolbar.tsx:68,86` / `HeroCockpit.tsx:32` | `https://github.com`、`https://twitter.com`、`mailto:developer@example.com`（含"复制邮箱"写入剪贴板的还是 `developer@example.com`） | 通用占位身份信息 |
| `Sidebar.tsx:104` | Tech Arsenal 徽标 `"v2.5"` | 无版本数据源的虚构版本号 |

**全部标注为"待用户提供真实信息"。** `Sidebar.tsx:199` 的 `Full-Stack Crafter`、`profile.ts:26` 的 `"Mike Chen"` 同属占位身份，一并移交用户确认。

---

## 未通过项与最小复现命令

1. **同类不实数据未清干净（`48+` 与数据源矛盾）** — 影响"UI 不对用户撒谎"的核心目标，也造成页面自相矛盾。
   ```
   Select-String -Path "src\data\profile.ts" -Pattern '48\+|99\.98|3\.2k'
   Select-String -Path "out\index.html" -Pattern '99\.98|99\.99% Hit Ratio'
   ```
2. **`#overview` 锚点不存在，Dashboard 导航点击为静默空操作（新发现）**
   ```
   Select-String -Path "src\**\*.tsx" -Pattern 'id="' #  仅 projects / snippets / tech-stack
   # src/app/page.tsx:26-32  scrollToSection(): if (element) {…}  → element=null 时什么都不发生
   # src/components/layout/Sidebar.tsx:76-79 导航项 id:"overview" → navigateToSection("overview")
   ```
   实测产物中 `id="overview"` 出现 **0 次**（两种模式一致）；`activeSection` 初值又是 `"overview"`，因此该按钮既高亮又无效。与 task-2 已修的 Analytics/Settings 属**同一缺陷类**，建议同法处理（补锚点或改为 disabled）。
3. **`.gitignore` 未覆盖 `.env.production` / `.env.development` / `.env.test`**
   ```
   git check-ignore -v -- .env.production     # exit 1 → NOT-IGNORED
   ```
4. **"可自动部署"未端到端验证（未通过/未验证）**：`git` 仓库 0 commits、0 tracked files、无 remote（`git remote -v` → 空），workflow 从未运行过，因此"推送 main 即自动部署"这一结论**没有执行证据**。

## 残余风险与后续项

1. **CI 首次运行风险（未能验证）**：本环境无法联网核对 action tag 上游存在性 —— `https://github.com` 与 `https://api.github.com` 均解析到非公网 IP 被拒（`web_fetch` 报 `URL hostname resolves to a non-public IP address`），`web_search` 因未配置 API key 不可用。因此 `checkout@v4 / setup-node@v4 / configure-pages@v5 / upload-pages-artifact@v3 / deploy-pages@v4` 的**版本号语法**已结构化校验通过，但**这些 tag 在 GitHub 上是否仍存在**未能验证。请在联网环境执行一次 `workflow_dispatch` 证伪。
2. **basePath 注入策略的场景缺口**：workflow 无条件注入 `NEXT_PUBLIC_BASE_PATH=/${{ github.event.repository.name }}`。这适用于**项目型**站点（`<user>.github.io/<repo>/`）；若仓库名本身是 `<user>.github.io`（用户/组织站点）或绑定了自定义域名（CNAME），站点根在 `/`，该前缀会让**所有**资源 404。属部署配置风险，需用户确定仓库形态后再定。
3. **`images.unoptimized: true` 的代价**：`bg-wave.png` 1049044 B（约 1.0 MB）、`avatar.png` 517102 B 原样出货，无 Next 优化。首屏体积可优化（手工压缩）。
4. `package.json` 用 `"next": "^15.1.7"` 等 caret 范围；CI 用 `npm ci`（锁 15.5.28）保证确定性，但若有人执行 `npm install` 更新 lockfile，可能漂移到未验证的新 15.x。
5. 仓库根新增的 `DEPLOYMENT.md`、`PROJECT_PLAN.md` 为过程文档（未纳入本次验收标准），其中若含部署说明，其准确性不在本报告覆盖范围内。
6. 本报告的全部静态结论建立在"快照 30/30 哈希一致"之上；若后续有人改动 src/、tailwind.config.ts、next.config.mjs 或 deploy.yml，本结论即失效，需重新验收。