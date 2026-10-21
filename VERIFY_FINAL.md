# 第 0 步最终冻结状态复核报告（最终裁定 · 第 7 轮 / 交付冻结）

- **任务**：task-5（rev 3，已 complete；本轮为白名单（兜底自检 4/4）落地后的**最后一次确认**）
- **验收人**：verifier（独立于所有 writer）
- **验收时间**：2026-10-20 16:33–17:05 (America/Los_Angeles)
- **冻结锚点**：`D:\_verify\_tools\manifest_v5.txt`（33 项）。`deploy.yml` mtime **16:44:07**（5341 B）、`DEPLOYMENT.md` mtime **16:44:39**（10405 B）；相对 manifest_v4 **仅这两个文件变化**。**验收结束后复核：被验收的 32 项变化 0 处 → 冻结点完好。**
- **构建证据效力**：除这两个非构建文件外，所有参与构建的文件与全新路径干净重建快照 `D:\_verify_final\step0` **逐文件哈希 0 差异**；工作区产物 `out/index.html` = **86336 B**（mtime 16:45:05）、`404.html` = 8942 B、`.nojekyll` = 0 B（我的探针只写自己的仓库外副本，未触碰工作区产物）。
- 写作用域：仅 `VERIFY_FINAL.md`；未修改任何被验收文件。

## 【结论：通过】（可冻结交付）

白名单（兜底自检 4/4）**正确且有效**：我用自己的 36 用例真实 bash 矩阵逐条复核，**36/36 全部符合预期**（18 通过 / 18 响亮拒绝），其中我上轮点出的 NBSP 绕过路径**已彻底关闭**（NBSP 前缀、NBSP 内嵌、零宽空格前缀、全角空格后缀均 `exit 1`）。结构化断言 **38/38** 无回归；文档与实现逐条吻合。
**无新缺陷**。仅 2 条"记录在案"的边缘（均为手输怪值、不影响自动分支，**不需要你改**；见文末），因此不阻碍交付。

---

## 白名单落地复核（本轮核心）

**代码**（`deploy.yml:96-104`，位于三道旧自检之后、输出之前）：

```bash
if [ -n "${FINAL}" ] && [[ ! "${FINAL}" =~ ^/[A-Za-z0-9._~/-]+$ ]]; then
  echo "::error::Invalid base path '${FINAL}' (only ASCII [A-Za-z0-9._~/-] is allowed)"
  exit 1
fi
```

**静态审计**：白名单存在 ✓；**位于最后一道自检** ✓；`[ -n "${FINAL}" ]` 守卫使空值（根路径）照常通过 ✓；输出仍只写 `value=${FINAL}`，`echo` 中裸 `${BP}` = **0 处** ✓。

**真实 bash 独立矩阵 36/36**（`C:\Git\bin\bash.exe`，同进程子 shell source，逐例读 `$GITHUB_OUTPUT`）：

```
CASE                         EXIT  EXPECTED  ACTUAL           VERDICT
root /                       0     0                          OK
triple ///                   0     0                          OK
my-repo                      0     0         /my-repo         OK
My-Repo_2.0                  0     0         /My-Repo_2.0     OK
deep /a/b/c                  0     0         /a/b/c           OK
tilde /~user                 0     0         /~user           OK
double lead+trail //foo//    0     0         /foo             OK
x/y (auto lead slash)        0     0         /x/y             OK
slash + spaces "/  "         0     0         (root)           OK
inner ASCII space /foo bar   0     0         /foobar          OK
double slash only //         0     0         (root)           OK
trailing only /foo/          0     0         /foo             OK
inner double /a//b           0     0         /a/b             OK
github.io auto               0     0         (root)           OK
project auto                 0     0         /my-portfolio    OK
override wins                0     0         /custom          OK
multiline /foo\nbar          0     0         /foobar          OK
CRLF /foo\r\n                0     0         /foo             OK
space then path " /foo"      0     0         /foo             OK
spaces only "   "            1     1                          OK
no slash foo                 1     1                          OK
multiline foo\nbar           1     1                          OK
tab only                     1     1                          OK
dash only -                  1     1                          OK
NBSP prefix                  1     1  ← 上轮此处 exit 0     OK
NBSP inner                   1     1  ← 上轮 bypass          OK
ZWSP prefix                  1     1                          OK
fullwidth space suffix       1     1                          OK
percent-encoded /foo%20      1     1                          OK
unicode /café                1     1                          OK
plus /a+b                    1     1                          OK
at /a@b                      1     1                          OK
colon /a:b                   1     1                          OK
question /a?b                1     1                          OK
hash /a#b                    1     1                          OK
backslash /a\b               1     1                          OK
```

每条拒绝都打印可读原因，例如
`::error::Invalid base path '/ /foo' (only ASCII [A-Za-z0-9._~/-] is allowed)`（NBSP 前缀）、
`::error::Invalid base path '/foo%20' (…)`、`::error::Invalid PAGES_BASE_PATH '   ' (use "/" for the site root, or a path like /my-repo)`。

**回归**：`check-workflow-final3.js`（38 项，未修改）在当前 workflow 上 **38/38 PASS** —— 步骤 id、`steps.basepath.outputs.value` 引用链、upload `path: out`、permissions、concurrency、`deploy.needs`/`environment` 均未受影响。

**文档复核**（`DEPLOYMENT.md:141-149`）：报错清单第 3 条已补"含 ASCII 白名单以外的字符"，并说明 NBSP/零宽/全角空格"既不可见又不被 `[[:space:]]` 匹配 → CI 全绿 + 坏站点"——与我的实测完全一致；L134-136 的归一化规则、L138-139 的"无斜杠即报错"也逐条复核无误。

---

## 记录在案（不需要修，不影响交付）

1. **点段（`.` / `..`）被白名单允许** —— 我实测 `OVERRIDE=/foo/../bar` → 脚本 exit 0、`FINAL=/foo/../bar`；`next build` **exit 0**，产物里 13 处引用为 `/foo/../bar/_next/...`。浏览器按 RFC 3986 归一化后请求的是 `/bar/_next/...` → 若站点不在 `/bar` 则全站 404（又属"静默坏站点"，但需手输路径穿越样式的值）。
   - **不可由自动分支产生**：`/<repo>` 与 `''` 都不会含 `.`/`..` 段（GitHub 仓库名不可能为 `.`/`..`），所以只有手输 override 才可能触发，概率极低。
   - 可选 1 行加固（**我不要求你改**）：在自检里加 `[[ "${FINAL}" == */. || "${FINAL}" == */.. || "${FINAL}" == *"/./"* || "${FINAL}" == *"/../"* ]] && { echo "::error::..."; exit 1; }`。
2. **注释编号笔误**：`兜底自检 1/3`、`2/3`、`3/3`、`4/4` —— 现在是 4 道自检，前三处应写 `/4`（纯注释，1 字符 × 3）。

## 最终交付状态一览

| 项 | 状态 | 证据 |
|---|---|---|
| 静态导出配置（export/trailingSlash/images.unoptimized/条件 basePath） | 通过 | `next.config.mjs` 两种模式实例化对比 |
| CI 工作流（触发/权限/concurrency/artifacts/引用链） | 通过 | 结构化 YAML 38/38；basepath run 块 59 行 |
| basePath 解析契约 | 通过 | 真实 bash 36/36（含 18 条拒绝路径，全部可读报错） |
| `public/` 资源子路径修复 | 通过 | 干净重建产物：23 文件全量扫描未加前缀 0 处、12/12 引用可解析、13/13 HTTP 200 |
| `#overview` / `.env.*` / 文档三处修正 | 通过 | 产物 `id="overview"`×1；5/5 IGNORED + 10 项无误伤；文档与实测一致 |
| 构建 | 通过 | 干净路径重建默认与子路径模式各 exit 0；工作区最终产物 86336/8942/0 |
| 冻结一致性 | 通过 | manifest_v5；验收前后被验收 32 项 0 变化 |

## 残余风险与"未能验证"

1. **CI 从未实跑**：`branch=main`、`commits=0`、`remotes=[]` → "推送 main → 自动部署"仍无执行证据；`$GITHUB_OUTPUT` 落盘、`vars` 展开、`steps.basepath.outputs.value` 传参、action 下载需首次真实运行确认（本轮为 Git Bash 真实执行脚本本体，仍不等于 Actions 运行环境）。
2. **action tag 上游存在性未验证**（本环境 `github.com`/`api.github.com` 解析到非公网 IP 被拒，`web_search` 无 API key）。
3. **图片未优化**：`bg-wave.png` 1.05 MB、`avatar.png` 517 KB（`images.unoptimized` 是静态导出硬要求，可手工压缩）。
4. **占位/虚构信息**（按 Lead 决定移交用户）：`profile.ts` 的 `48+`（与真实 3 条自相矛盾）、`3.2k`、`99.98%`、`6+ Yrs`、通用 GitHub/Twitter/邮箱、`projects.ts` `99.99% Hit Ratio` 与 `example.com` 链接、Tech Arsenal `v2.5`、铃铛 `3`；`DEPLOYMENT.md` §5 已登记。
5. 本裁定绑定 `manifest_v5.txt`（33 项）；被验收文件再变动即需重新锚定。
6. 测试脚手架（仓库外，可整体删除）：`D:\_verify\*`、`C:\_verify\step0`；本轮证据：`D:\_verify\_tools\step_basepath_v5.sh`、`run-basepath-tests7.js`、`check-workflow-final3.js`、`D:\_verify\logs\`。