# 第 0 步独立验收报告（非 OneDrive 路径干净重建 + basePath 产物核验）

- **任务**：task-4（rev 2，已由 verifier 认领）
- **验收人**：verifier（独立于 task-1/task-2 的所有 owner）
- **验收时间**：2026-10-20 06:27–06:45 (America/Los_Angeles)
- **独立落盘路径**：`D:\_verify\step0`（**未复用** Lead 的 `D:\_build_test`）
- **写作用域**：本报告 `VERIFY_BUILD_D.md`。辅助脚本/日志在仓库外：`D:\_verify\_tools\`、`D:\_verify\logs\`（均未进入仓库）。
- **被验收源码锚点**：工作区 30 个源文件 → 快照 SHA-256 与工作区当前状态**逐文件一致（0 差异）**，最新源文件 mtime 06:26:58（早于 06:27:24 的快照采集），故构建结果对应当前修订。

## 【结论：通过】

7 项验收步骤**全部实测通过**：干净重建成功（默认 + 子路径两种模式各 exit=0），`out/` 产物齐备，basePath 前缀**无一遗漏**，public 资源修复经产物与 HTTP 双重证实。同时**修正 Lead 的一条证据**（其 EINVAL 复现不具区分度）并补充一条独立对照实验（普通 C: 路径同样构建成功）。构建失败的环境归因**方向成立**，但失败机理未被完全复现（详见"与 Lead 结论的差异"）。

---

## 逐条命令与原始输出

### 步骤 1–2：复制源码并脱离 OneDrive

```
robocopy "C:\Users\ASUS\OneDrive\Desktop\Wbesite Page2" "D:\_verify\step0" /E /XD node_modules .next out .git
```

```
               Total    Copied   Skipped  Mismatch    FAILED    Extras
    Dirs :        17        13         4         0         0         0
   Files :        30        30         0         0         0         0
robocopy exit code: 1            ← 1 = 成功复制（非错误）
reparse points in D:\_verify\step0 (must be 0) = 0
```

复制保真度（对抗性检查，防"复制丢文件"）：

```
source files (excluding node_modules/.next/out/.git): 30
dest files: 30
per-file SHA-256 compare: hash mismatches/missing: 0
```

### 步骤 3：依赖安装

```
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" install --no-audit --no-fund
→ added 106 packages in 18s          NPM_INSTALL_EXIT=0
```

实测版本（与项目声明的技术栈一致）：`next@15.5.28  react@19.3.1  react-dom@19.3.1  tailwindcss@3.4.19  typescript@5.9.3  lucide-react@1.60.0`

`npm ci --dry-run` → `up to date in 689ms`，exit=0（证明 CI 的 `npm ci` 不会因 lockfile 失配而失败）。

### 步骤 4：默认模式构建（exit=0）与产物

```
node node_modules\next\dist\bin\next build
 ✓ Compiled successfully in 4.2s   ✓ Generating static pages (4/4)   ✓ Exporting (2/2)
┌ ○ /            17.2 kB   126 kB
└ ○ /_not-found   993 B    104 kB
BUILD_DEFAULT_EXIT=0
```

```
PRESENT index.html   size=86322        ← 与 Lead 报告的 86322 B 完全一致
PRESENT 404.html     size=8942
PRESENT .nojekyll    size=0
out/ 顶层: .nojekyll  404/  404.html  images/  index.html  index.txt  _next/
_next/static: 19 个文件, 937980 字节  (扩展名分布 {".js":18,".css":1})
out/_next 子目录: 仅 static 与 buildId 目录（无 image 优化路由 → images.unoptimized 生效）
out/images: avatar.png 517102 B, bg-wave.png 1049044 B（原样透传）
```

### 步骤 5：子路径模式构建（`NEXT_PUBLIC_BASE_PATH=/website-page2`，exit=0）

```
$env:NEXT_PUBLIC_BASE_PATH='/website-page2'; node node_modules\next\dist\bin\next build
 ✓ Compiled successfully in 4.0s   ✓ Exporting (2/2)
BUILD_BASEPATH_EXIT=0
```

产物审计（`D:\_verify\_tools\audit.js`，**全量**扫描 23 个 html/txt/css/js/json/xml/svg）：

```
---- index.html ----   bytes=86560
/_next occurrences=13  prefixed(_next)=13
root-absolute URLs distinct=12  prefixed=12  UNPREFIXED=0
  prefixed sample => /website-page2/images/bg-wave.png | /website-page2/_next/static/css/5290a0de586afe78.css | /website-page2/_next/static/chunks/webpack-f273bead3278ded1.js | …
  image refs => /website-page2/images/bg-wave.png | /website-page2/images/avatar.png
  unprefixed src="/images/ count=0
---- 404.html ----    /_next 11/11 prefixed, root-absolute 9/9 prefixed, UNPREFIXED=0
---- 404/index.html ---- 同上（trailingSlash 生成的目录副本）
---- index.txt ----    /_next 2/2 prefixed, UNPREFIXED=0
.nojekyll exists=true size=0      _next/static files=19 totalBytes=938202
---- FULL SCAN: every artifact file with unprefixed root-absolute src/href ----
NONE (0 files)
---- FULL SCAN: raw unprefixed "/_next/" or "/images/" occurrences in html/txt/css ----
NONE (0 files)
```

### 步骤 5b（超额）：每个引用都真的能取到 —— 文件系统 + HTTP 双重

```
node D:\_verify\_tools\resolve-refs.js "D:\_verify\step0\out" "/website-page2" fs
RESULT: 12/12 resolved, MISSING=0        （12 个 distinct 引用 → 全部命中真实文件）

node D:\_verify\_tools\resolve-refs.js "D:\_verify\step0\out" "/website-page2" http
（本地静态服务器把 out/ 挂载到 /website-page2/，按 GitHub Pages 语义返回 200/404）
HTTP 200  /website-page2/
HTTP 200  /website-page2/_next/static/chunks/…（9 个 JS）
HTTP 200  /website-page2/_next/static/css/5290a0de586afe78.css
HTTP 200  /website-page2/images/avatar.png
HTTP 200  /website-page2/images/bg-wave.png
RESULT: 13/13 returned 200, FAILED=0
```

### 步骤 6：反向核验（默认模式回归，无前缀）

```
（默认构建快照 D:\_verify\logs\out_default 的 index.html）
/website-page2 occurrences = 0
/_next/ occurrences = 13    src="/images/ occurrences = 2    href="/images/ occurrences = 1
distinct images refs => /images/avatar.png | /images/bg-wave.png
<link rel="preload" as="image" href="/images/bg-wave.png"/>
```

`BASE_PATH` 为空时**不产生任何多余前缀** ✓。

### 步骤 7：复核 assetPath 修复是否真实（是）

```
src/lib/utils.ts:16-20
  const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  export function assetPath(path: string) { return `${BASE_PATH}${path}`; }

src/components/ui/AmbientBackground.tsx:5   import { assetPath } from "@/lib/utils";
src/components/ui/AmbientBackground.tsx:40  src={assetPath("/images/bg-wave.png")}
src/components/layout/Sidebar.tsx:25        import { assetPath } from "@/lib/utils";
src/components/layout/Sidebar.tsx:176       src={assetPath(profileData.avatar)}   // profile.ts:30 avatar:"/images/avatar.png"
```

- 全项目 `src/**/*.tsx` 中涉及 `images/` 的引用**只有这 2 处**，无第三处绕过；`public/` 只有 3 个文件（.nojekyll + 2 图）；CSS 源码 `url(` 引用数 0。
- 产物证据闭环：子路径模式 → `/website-page2/images/avatar.png` + `/website-page2/images/bg-wave.png`；默认模式 → `/images/...`。**修复真实、双向可逆。**

### 环境故障的独立复核（附加）

| 实验 | 结果 |
|---|---|
| 工作区 `package.json` 的 `fs.readlinkSync` | EINVAL |
| **对照 A**：普通 C: 临时目录里的**普通文件** `readlinkSync` | **EINVAL**（同一错误） |
| **对照 B**：`D:\_verify\step0`（0 reparse point）普通文件 | **EINVAL** |
| 工作区 30/30 源文件属性 | `Archive, ReparsePoint`（OneDrive 占位符）；副本 0 个 ReparsePoint |
| **对照 C**：普通 C: 路径 `C:\_verify\step0`（非 OneDrive，0 reparse point）完整 `npm install` + `next build` | **exit=0**（106 packages，编译 4.2s） |
| 工作区 `.next/trace`（上次失败遗留） | 仅 4 个 span，`next-build` 历时 191502µs(≈0.19s)，停在 `create-dist-dir` 之后 → **编译前即失败** |
| 工作区 dirent 扫描（root/.next/.next/cache/.next/server/.github/node_modules） | `isSymbolicLink()===true` 的条目 **0 个** |

三种构建模式日志中 `EINVAL|readlink|EPERM|error` 命中数均为 **0**。

---

## 与 Lead 结论的差异

1. **【更正证据】Lead 引用的复现方式不具区分度。** `fs.readlinkSync('package.json')` → EINVAL 并**不能**证明 OneDrive 参与：我在**非 OneDrive 的普通 C: 临时目录**和 D: 副本上对普通文件执行同一调用，同样得到 EINVAL。Windows 上 `readlink` 对"非符号链接的普通文件"本来就返回 EINVAL（libuv 把 `ERROR_NOT_A_REPARSE_POINT` 映射为 EINVAL）。**仍然成立的**是属性层证据：工作区 30/30 源文件带 `FILE_ATTRIBUTE_REPARSE_POINT`，而 D:/C: 副本为 0 个。
2. **【机理未复现】Lead 的"fs.readlink 对这些文件抛 EINVAL 导致 build 失败"未能证实。** Next 15.5.28 中唯一会在清理阶段调用 `readlink` 的是 `next/dist/lib/recursive-delete.js:58`，其触发条件是 `dirent.isSymbolicLink()===true`；而工作区（含 `.next` 内）**没有任何条目**被 Node 标记为符号链接。因此失败的确切调用点我无法用只读手段定位（按指令未在工作区内构建，无法取栈）。**但结论方向不变**：唯一异常变量是"OneDrive 占位符目录"，因为同机普通 C: 路径与 D: 路径均构建成功。
3. **Lead 的关键数字全部复核一致**：`out/index.html` = 86322 B、`404.html` / `.nojekyll` 齐备、子路径模式未加前缀引用 0 处、public 资源补前缀修复真实。
4. **补充独立对照**：Lead 的结论"C: 失败 / D: 成功"可能被误读为"盘符问题"。我新增 `C:\_verify\step0`（非 OneDrive、同盘符）对照 → **exit=0**。真正的变量是**是否位于 OneDrive 占位符目录**，而非 C:/D: 盘符。
5. **说明性更正（非缺陷）**：`.nojekyll` 对 `upload-pages-artifact@v3 + deploy-pages@v4` 的 artifact 部署**并非必需**（GitHub 不对 artifact 做 Jekyll 处理），它只在改用 `gh-pages` 分支式部署时才有保护作用。
6. **未验证项（不猜测为通过）**：action tag 上游存在性无法核对 —— 本环境 `github.com` / `api.github.com` 一律解析到非公网 IP 被拒绝，`web_search` 亦无 API key。`checkout@v4 / setup-node@v4 / configure-pages@v5 / upload-pages-artifact@v3 / deploy-pages@v4` 的**语法**已结构化校验，**存在性**待联网证伪。
7. **未验证项**：workflow 从未运行过（仓库 0 commit、0 tracked、无 remote），"推送到 main 自动部署到 GitHub Pages"**缺执行证据**。

---

## 残余风险

1. **basePath 注入策略的场景缺口**：workflow 无条件用 `/${{ github.event.repository.name }}`。适用于项目型站点 `<user>.github.io/<repo>/`；若仓库是 `<user>.github.io`（用户站点）或配了自定义域名，站点根为 `/`，该前缀会导致全站资源 404。需用户先确认仓库形态。
2. **图片未优化**：`bg-wave.png` ≈ 1.05 MB、`avatar.png` ≈ 517 KB 原样出货（`images.unoptimized: true` 是静态导出的硬要求，但可手工压缩）。
3. **构建可复现性**：basePath 模式的 chunk 名与默认模式不同（webpack hash 变化）属正常；但 CI 以 `npm ci` 锁定 15.5.28，本地若 `npm install` 可能漂移到未验证的 15.x。
4. **`.env.production` 等未被 .gitignore 覆盖**（见 `VERIFY_STEP0.md` 第 4 条）。
5. **临时目录残留**：本次验收产生的 `D:\_verify\step0`、`D:\_verify\logs`、`D:\_verify\_tools`、`C:\_verify\step0` 均为仓库外测试脚手架，验收结束后可整体删除；如需复核原始日志请先取走 `D:\_verify\logs\build_*.log`。
6. 本报告结论绑定于上述 30/30 哈希锚点；源码或被验收配置一旦变化即失效，需重新构建核验。