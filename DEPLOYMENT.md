# 部署与维护手册 (DEPLOYMENT)

本项目为 Next.js 15 纯静态站点，构建产物输出到 `out/`，可直接托管于 GitHub Pages 或任意 CDN。

---

## 0. ⚠️ 构建失败的排查第一条：**不要并行构建**

**已确认的故障原因（经独立复核）**：本项目在开发过程中出现过 `next build` 持续失败：

```
Error: EINVAL: invalid argument, readlink '...\.next\...'
```

**真正原因**：**同时运行了两个 `next build`**（两个进程共用同一个 `.next` 目录），
互相覆盖产物导致构建失败（已独立复现：2 并发 → 1 成功 1 失败；3 并发 → 1 成功 2 失败，
报错形如 `ENOENT: rename ... 500.html`、`Unexpected end of JSON input`）。

**教训：同一项目目录同一时间只允许一个构建进程。**

**排查方法**：确认没有残留的构建进程后重新构建即可。
Next.js 对残留缓存有自愈能力——实测并发失败后**连续 12 次串行构建（不清缓存）全部 `exit=0`**。
若仍怀疑缓存异常，可以清缓存（安全，`.next`/`out` 都是生成物）：

```powershell
Remove-Item -Recurse -Force .next, out
node node_modules\next\dist\bin\next build
```

**注意**：`.next` 与 `out` 是生成物，可以随时删除；但**不要**删除 `src/`、`public/` 或配置文件。

> 说明：项目位于 OneDrive 同步目录（`C:\Users\ASUS\OneDrive\Desktop\Wbesite Page2`），
> 其文件带 `FILE_ATTRIBUTE_REPARSE_POINT`。这一点曾被怀疑为上述失败的原因，但**经独立复核证伪**：
> 判据是 —— 该工作区**在 OneDrive 内**曾完整构建成功（产物 86336 B、`id="overview"` ×1），
> 而"并行构建不安全"已在**非 OneDrive 路径**上被独立复现，故与 OneDrive 无关。
> 另外 `fs.readlinkSync` 对普通文件在 Windows 上本来就返回 `EINVAL`，**不能**用来诊断 OneDrive。
>
> 不过 OneDrive 仍有两点值得一提：① 它会在构建过程中反复改动文件 mtime，导致编辑工具报
> "file changed since it was read"，重新读取后再改即可；② 它把整个项目的文件（含 `node_modules`）
> 都变成了 reparse point 占位符（实测 16469 个），若以后遇到莫名的依赖读取错误，可考虑把项目移到
> OneDrive 之外的目录（如 `D:\projects\`）作为规避手段。

**注意**：以上都只影响本机构建。GitHub Actions 在 Ubuntu runner 上构建，不存在该问题。

**另一个已踩过的坑**：本项目 `page.tsx` 是客户端组件，静态产物虽已预渲染，但交互依赖 JS。
`output: 'export'` 下**不能**用 `next start` 预览导出产物，请用下一节的本地静态服务器方式。

---

## 1. 本机构建

```powershell
# 本机 PowerShell 执行策略禁止 npm.ps1 / npx.ps1，因此直接用 node 调用
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" install
node node_modules\next\dist\bin\next build
```

构建成功后产出：

```
out/
├── index.html        # 首页
├── 404.html          # 404 页
├── .nojekyll         # 保险项：artifact 部署路径下并非必需，改用 gh-pages 分支部署时才关键
├── images/           # public/ 下的静态资源
└── _next/static/     # JS / CSS 资源
```

本地预览分两种，**不要混用**：

```powershell
# A. 开发模式（带热更新，看源码改动）
node node_modules\next\dist\bin\next dev            # http://localhost:3000

# B. 预览真正的静态导出产物 out/（验证上线效果）
#    注意 output:'export' 下不能用 next start；用任意静态服务器指向 out/ 即可
node -e "const h=require('http'),f=require('fs'),p=require('path');const root=p.resolve('out');h.createServer((q,s)=>{let u=decodeURIComponent(q.url.split('?')[0]);let t=p.join(root,u);try{if(f.statSync(t).isDirectory())t=p.join(t,'index.html')}catch(e){try{if(f.statSync(t+'.html').isFile())t+='.html'}catch(e2){}}f.readFile(t,(e,d)=>{if(e){s.writeHead(404);return s.end('404')}s.writeHead(200);s.end(d)})}).listen(4173,()=>console.log('http://localhost:4173'))"
```

若要验证**子路径部署**效果，需把 `out/` 挂到 `/仓库名/` 前缀下访问（GitHub Pages 的真实语义），
而不是直接访问根路径 —— 否则 public 资源前缀缺失这类问题不会暴露出来。

---

## 2. 部署到 GitHub Pages

### 2.1 一次性仓库配置

```powershell
git add -A
git commit -m "chore: step 0 - static export + Pages CI/CD"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

然后在 GitHub 仓库页面：**Settings → Pages → Build and deployment → Source 选择 `GitHub Actions`**。

### 2.2 自动化流程

`.github/workflows/deploy.yml` 已配置：推送到 `main` 或手动触发时，
自动执行 `npm ci` → `npm run build` → 上传 `out/` → 发布到 Pages。

### 2.3 子路径（重要）

项目型 Pages 站点部署在 `https://<用户名>.github.io/<仓库名>/` 这一**子路径**下，
因此资源必须带 `/仓库名` 前缀。工作流已自动注入：

```yaml
# 工作流中的 "Resolve base path" 步骤按以下规则解析，再注入给构建
REPO_NAME = <仓库名>            # 形如 my-portfolio
OVERRIDE  = <仓库 Variables 里的 PAGES_BASE_PATH，可选>
```

解析规则：

| 情况 | 注入的 basePath | 适用场景 |
| :--- | :--- | :--- |
| 仓库名形如 `<user>.github.io` | 空（根路径） | 用户/组织型 Pages 站点 |
| 其他仓库名 | `/<仓库名>` | 项目型 Pages 站点（最常见） |
| 设置了仓库 Variable `PAGES_BASE_PATH` | 以该值为准 | 绑定自定义域名等特殊情况 |

`next.config.mjs` 读取该变量并设置 `basePath` / `assetPrefix`；
**变量不存在时退化为根路径部署**。

⚠️ 若你的站点绑定了**自定义域名**（`CNAME`）或仓库本身就是 `<user>.github.io`，
站点根在 `/`，此时**必须**让 basePath 为空，否则全站资源 404。
做法：在 GitHub 仓库 **Settings → Secrets and variables → Actions → Variables**
新建 `PAGES_BASE_PATH`，**值填一个斜杠 `/`**（不是留空）。

> 为什么不能"留空"？GitHub Actions 无法区分「Variable 不存在」与「Variable 值为空字符串」，
> 所以留空会被当作未设置、从而回落到 `/<仓库名>`。工作流会把 `/` 归一化成空串。
>
> 归一化规则（已用真实 bash 逐项实测 20 例）：先删掉空白与换行，再把重复斜杠折叠为一个、
> 去掉首尾斜杠。因此 `/`、`///`、`/  ` 都表示根路径；
> `/foo`、`/foo/`、`//foo//`、`/foo//` 都会得到 `/foo`。
>
> **不带斜杠的值会被判为"填错了"而直接报错**（`foo`、纯空格、纯换行 → `exit 1`），
> 而不是猜测你的意图 —— 要表达根路径请填 `/`。

以下任一情况都会让构建步骤**明确报错退出**，不会静默产出资源全 404 的站点：

- 去掉空白后为空，或完全不含 `/`（例如 `foo`、`"   "`）
- 归一化后含 `//`，或含空白
- **含 ASCII 白名单以外的字符**（只允许 `/`、`A-Za-z0-9`、`.`、`_`、`~`、`-`）

> 最后一条是 locale 无关的兜底：不间断空格（NBSP, U+00A0）、零宽空格、全角空格这类字符
> 既不可见、又不被 `[[:space:]]` 匹配，却会让 `next build` 通过、上线后全站 404
> （即"CI 全绿 + 坏站点"）。白名单一次覆盖所有这类情形。

⚠️ 已修复的坑：Next.js **不会**为 `public/` 目录资源自动加 `basePath`。
若直接写 `src="/images/avatar.jpg"`，在子路径部署下会 **404**。
因此 `src/lib/utils.ts` 提供了 `assetPath()`，新增 public 资源引用时**必须**经过它：

```tsx
import { assetPath } from "@/lib/utils";
<Image src={assetPath("/images/your-image.png")} ... />
```

### 2.4 联系表单（FormSubmit）

首页「联系」区块是纯静态表单，提交后由 [FormSubmit](https://formsubmit.co/) 把内容转发到
`src/data/profile.ts` 中 `links.email` 对应的邮箱。访客填写的邮箱会出现在邮件正文里，
同时被设为 Reply-To，收到邮件后直接回复即可。

**上线后必须先激活一次**：新收件邮箱的第一次提交会触发 FormSubmit 的激活邮件，
在 `kqin517@gmail.com` 的收件箱中点击确认链接后，后续反馈才会真正送达（激活前的提交不会转发）。
建议部署完成后先自己提交一条测试反馈，确认激活并收到邮件后，再公开分享站点。
若没有收到激活邮件，请检查垃圾邮件目录。

- 接收邮箱：修改 `src/data/profile.ts` 的 `links.email`，端点会同步变化；
  换邮箱后需要重新激活。
- 邮件主题：在 `src/data/contact.ts` 的 `subject` 中修改。
- 表单字段：`email`（必填，即回复地址）、`name`（可选）、`message`（必填），
  另有隐藏的 `_subject` / `_template` / `_captcha` 与蜜罐字段 `_honey`。
- 本项目不使用 `mailto:`；联系方式统一走复制邮箱或这个表单。

---

## 3. 日常维护：新增一个代码片段

编辑 `src/data/snippets.ts`，追加一个对象即可（无需改动任何组件）：

```ts
{
  id: "your-snippet-id",          // 唯一标识
  title: "片段标题：简短说明",
  category: "React",              // React | TypeScript | CSS/Glass | DevOps | Algorithms
  language: "typescript",         // 用于语言标签显示
  badgeColor: "#3865FF",          // 侧边栏圆点颜色
  description: "一句话描述这个片段解决什么问题。",
  tags: ["Hooks", "Performance"], // 搜索会匹配标题/描述/标签
  code: `// 你的代码`,
  explanation: "核心原理与注意事项。",
  complexity: "O(1) Memory",
  updatedAt: "2026-10-20",
}
```

侧边栏的片段数量徽标会自动跟随 `featuredSnippets.length`，无需手动同步。

新增项目：编辑 `src/data/projects.ts`。其中 `stars`、`metrics`、`demoUrl`、`githubUrl`
均为可选字段，留空时对应 UI（星标、指标、外链入口）会自动隐藏。
修改个人信息与社交链接：编辑 `src/data/profile.ts`（`links` 提供邮箱、GitHub，Twitter 可选）。

---

## 4. 已知限制（待后续阶段处理）

- **主题固定为深色单主题**：原假的深/浅色切换按钮已移除，`<html>` 固定为 `dark`。
  若要做浅色主题，需要系统性重做玻璃面板与文字色，留作后续独立设计阶段。
- **语法高亮为轻量正则实现**：`FeaturedSnippets.tsx` 中的 `highlightSyntax` 只识别 JS/TS 关键字，
  其他语言的内容不会着色；Shiki 尚未接入。
- **路由尚未拆分**：目前只有 `/` 一条路由，`/snippets`、`/projects`、`/about` 及片段详情页尚未实现。
  因此侧边栏的 Analytics 与 Settings 已改为明确的「即将推出」禁用态，而非假装可跳转。

---

## 5. 当前内容状态

| 位置 | 现状 |
| :--- | :--- |
| `src/data/profile.ts` | 姓名、邮箱、GitHub 为真实信息；Twitter 未配置，对应图标自动隐藏 |
| `src/data/contact.ts` | FormSubmit 转发端点与反馈邮件主题 |
| 首页联系区 | 访客填写邮箱与反馈，经 FormSubmit 转发到 Gmail；首次上线需激活 |
| `src/data/snippets.ts` | 2 条精选片段：`useDebounceFn`、`asyncPool` |
| `src/data/projects.ts` | 当前为空数组，项目区块、侧栏入口与搜索结果自动隐藏；新增项目后自动出现 |
| `public/images/` | `avatar.jpg`（头像）、`bg-wave.jpg`（背景） |

Hero 与侧边栏的片段/项目数量均由本地数据派生，不展示虚构数字。
