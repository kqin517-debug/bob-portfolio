# 运维手册

> 适用范围：`kqin517.top` 个人主页、工单系统、GCP VPS、加密备份与灾难恢复。
>
> 本文件在公开仓库中，**不包含密码、私钥、备份口令、rclone token 或 SMTP 密码**。需要这些信息时，查看 Google Drive 的加密恢复包或你自己的密码管理器。
>
> 默认原则：**GitHub 是代码和配置的唯一真实来源；VPS 跑运行数据；Google Drive 存加密备份；本机永远不作为唯一副本。**

## 目录

1. [系统概览](#1-系统概览)
2. [日常使用](#2-日常使用)
3. [修改网站内容](#3-修改网站内容)
4. [发布、回滚与应急发布](#4-发布回滚与应急发布)
5. [工单系统](#5-工单系统)
6. [备份与恢复](#6-备份与恢复)
7. [换电脑与灾难恢复](#7-换电脑与灾难恢复)
8. [VPS 维护](#8-vps-维护)
9. [HTTPS 与 DNS](#9-https-与-dns)
10. [安全](#10-安全)
11. [故障排查](#11-故障排查)
12. [资源限制与约定](#12-资源限制与约定)
13. [常用命令速查](#13-常用命令速查)
14. [变更记录](#14-变更记录)

---

## 1. 系统概览

### 1.1 访问地址

| 用途 | 地址 |
| --- | --- |
| 网站 | https://kqin517.top |
| 工单后台 | https://kqin517.top/admin/ |
| 健康检查 | https://kqin517.top/api/health |
| GitHub 仓库 | https://github.com/kqin517-debug/bob-portfolio |
| 恢复说明 | `RECOVERY.md`（仓库根目录） |
| 备份目录 | Google Drive → `BobPortfolioBackups` |

### 1.2 请求链路

```text
访客浏览器
   │ HTTPS 443
   ▼
Nginx
   ├─ /             → /var/www/kqin517.top（Vite 静态文件）
   ├─ /admin/       → 受 Basic Auth 保护的工单后台
   └─ /api/         → 127.0.0.1:8787（Python 工单服务）→ SQLite

GitHub main 分支
   │ push
   ▼
GitHub Actions
   ├─ npm ci / npm run build
   ├─ rsync dist/ → /var/www/kqin517.top
   ├─ rsync server/ → /opt/bob-tickets
   └─ restart bob-tickets

每天 03:15（中国时间）左右
bob-backup.timer → bob-backup.service
   ├─ SQLite 一致性快照
   ├─ GPG AES-256 加密
   └─ rclone → Google Drive / BobPortfolioBackups
```

### 1.3 关键路径

| 内容 | 路径 |
| --- | --- |
| 静态站点 | `/var/www/kqin517.top` |
| 工单服务代码 | `/opt/bob-tickets/tickets.py` |
| 工单数据库 | `/var/lib/bob-tickets/tickets.db` |
| 工单服务单元 | `/etc/systemd/system/bob-tickets.service` |
| 备份脚本 | `/home/gh-deploy/bin/bob-backup.sh` |
| 备份服务/定时器 | `/etc/systemd/system/bob-backup.service`、`bob-backup.timer` |
| rclone 配置 | `/home/gh-deploy/.config/rclone/rclone.conf` |
| 备份口令文件 | `/home/gh-deploy/.config/bob-backup/passphrase` |
| Nginx 站点配置 | `/etc/nginx/sites-available/kqin517.top` |
| 工单后台密码文件 | `/etc/nginx/.htpasswd-bob` |
| Nginx 访问日志 | `/var/log/nginx/kqin517.top.access.log` |
| Nginx 错误日志 | `/var/log/nginx/kqin517.top.error.log` |

### 1.4 服务器与账号

- VPS：Google Cloud，`34.4.108.208`，实例 `instance-20261022-001309`，`us-west1-b`
- 规格：2 vCPU、约 1 GB 内存、28 GB 磁盘、无 swap
- 系统：Ubuntu，Nginx + Python 3 + SQLite
- SSH：
  - `kqin517`：日常维护，拥有 passwordless sudo
  - `gh-deploy`：GitHub Actions 专用，无 sudo；只能写站点目录和工单服务目录
  - root 登录：`prohibit-password`（仅密钥）
  - 密码登录：已关闭
- 工单后台：用户名 `bob`；密码不在本仓库，见恢复包 `README.txt` 或你的密码管理器
- 重要：VPS 上可能还有你自己的其他服务。本手册只覆盖网站相关服务；不要随意停止或改动不认识的服务。

---

## 2. 日常使用

### 2.1 查看新工单

1. 打开 https://kqin517.top/admin/
2. 浏览器会弹出登录框；用户名 `bob`，密码在恢复包或密码管理器中。
3. 默认显示“全部”；可以切换“待处理 / 已处理”。
4. 每条工单包含：工单号、提交时间、称呼、邮箱、主题、内容、访客 IP、状态。
5. 点访客邮箱可以直接用邮件回复；邮件主题会自动带上工单号。
6. “标记已处理”只改状态；“删除”是**永久删除**，没有回收站。

### 2.2 处理原则

- 重要工单（合作、实习、正式咨询）建议先手动备份一次再处理：
  ```bash
  sudo systemctl start bob-backup.service
  ```
- 回复时保留工单号，方便追踪。
- 不要把后台密码发给访客；不要让访客把密码发到工单里。
- 访客 IP 仅用于识别垃圾提交，不要公开。

### 2.3 每天检查一次

```bash
# 网站是否正常
curl -s https://kqin517.top/api/health

# 工单服务是否在运行
sudo systemctl is-active bob-tickets

# 备份定时器下一次运行时间
sudo systemctl list-timers bob-backup.timer --no-pager
```

正常结果：

```json
{"ok": true, "service": "bob-tickets"}
active
```

---

## 3. 修改网站内容

### 3.1 项目结构

| 路径 | 作用 |
| --- | --- |
| `src/content.ts` | 全站中英文文案、课程树、导航、经历、联系表单文案 |
| `src/components/Hero.tsx` | 首屏与主图 |
| `src/components/Header.tsx` | 顶部导航、项目下拉菜单 |
| `src/components/Sections.tsx` | 关于、项目、课程树、下载卡片、经历、联系表单 |
| `src/components/Footer.tsx` | 页脚 |
| `src/styles.css` | 全站样式 |
| `public/images/avatar.png` | 头像、favicon、后台 favicon |
| `public/images/workbench.webp` | 首屏主图 |
| `public/files/` | 可下载文件 |
| `server/tickets.py` | 工单后端 |
| `public/admin/index.html` | 工单后台页面 |
| `deploy/` | Nginx、systemd、sudoers、备份脚本参考配置 |
| `RECOVERY.md` | 换电脑/灾难恢复说明 |
| `OPERATIONS.md` | 本文件 |

### 3.2 本地预览

在项目根目录：

```bash
npm install
npm run dev
```

打开 `http://127.0.0.1:5173/`。

说明：

- 只改文案和样式时，不需要工单服务；联系表单在本地会提交失败，这是正常的。
- 要在本地测试工单表单，另开一个终端启动本地工单服务：
  ```bash
  TICKETS_DB="$PWD/.tmp/tickets.db" TICKETS_PORT=8787 python server/tickets.py
  ```
  然后访问 `http://127.0.0.1:5173/`；本地后台页是
  `http://127.0.0.1:5173/admin/index.html`。
- 本地 `.tmp/` 已在 `.gitignore` 中，不会被提交。

### 3.3 修改文案

所有文案在 `src/content.ts`，分成 `en` 和 `zh` 两个对象。**同一处内容通常要改两遍**：

```ts
export const content: Record<Language, PageContent> = {
  en: { /* 英文 */ },
  zh: { /* 中文 */ },
};
```

常用区块：

- `hero`：首屏标题、副标题、按钮、说明
- `about`：关于区
- `work`：精选项目（目前 `projects: []`）
- `skills`：课程作业 / 论文 / 课程相关代码的树
- `journey`：学习经历
- `contact`：联系区文案和表单提示
- `footer`：页脚
- `nav`：导航；`href` 必须对应页面上的 `id`

修改后运行 `npm run build`，确认没有 TypeScript 错误。

### 3.4 添加一门课程

课程作业树在 `skills.groups` 的 `coursework` 下。当前结构：

```ts
{
  id: 'coursework',
  title: '课程作业',
  children: [
    {
      id: 'algorithms-and-program-design',
      title: '算法与程序设计',
      children: [
        { id: 'algorithms-assignment-prompts', title: '作业题目', file: algorithmsAssignment },
        { id: 'algorithms-assignment-solutions', title: '作业题目及答案', emptyNote: '待补充。' },
        { id: 'algorithms-final-materials', title: '课程期末资料', emptyNote: '待补充。' },
      ],
    },
  ],
}
```

添加“数据结构”示例（中文侧）：

```ts
{
  id: 'data-structures',
  title: '数据结构',
  children: [
    { id: 'data-structures-prompts', title: '作业题目', emptyNote: '待补充。' },
    { id: 'data-structures-solutions', title: '作业题目及答案', emptyNote: '待补充。' },
    { id: 'data-structures-final', title: '课程期末资料', emptyNote: '待补充。' },
  ],
}
```

同时要在英文侧 `en.skills.groups` 中添加对应英文标题，否则切到英文会缺这门课。

规则：

- `id` 必须全站唯一，建议用英文小写加连字符。
- `id` 会成为页面锚点，例如 `#data-structures`。
- 有子节点用 `children`；没有内容用 `emptyNote`；有文件用 `file`。
- 层级可以继续嵌套，组件是递归的。

### 3.5 添加论文或课程相关代码

论文和代码树在 `skills.groups` 的 `papers`、`code` 下。当前每门课只有一个空节点。示例：

```ts
{
  id: 'papers-data-structures',
  title: '数据结构',
  children: [
    { id: 'papers-data-structures-final', title: '课程论文', emptyNote: '待补充。' },
  ],
}
```

代码同理，把 `id` 前缀换成 `code-`，并在中英文两侧都添加。

### 3.6 上传可下载文件

1. 把文件放到 `public/files/`，例如 `public/files/data-structures-assignment.pdf`。
2. 在 `src/content.ts` 顶部定义文件信息：

```ts
const dataStructuresAssignment = {
  name: '数据结构大作业.pdf',
  href: '/files/data-structures-assignment.pdf',
  size: '1.2 MB',
};
```

3. 在对应节点使用：

```ts
{ id: 'data-structures-prompts', title: '作业题目', file: dataStructuresAssignment }
```

说明：

- `name` 是下载时显示/保存的文件名，可以是中文。
- `href` 必须以 `/files/` 开头。
- `size` 只是展示文本，不会自动计算。
- 下载次数存在浏览器 `localStorage`，是**每个访客本机**的计数，不是全站统计；换浏览器会重新计数。
- 文件上传后，`npm run build` 会把它复制到 `dist/files/`。

### 3.7 更换头像和首屏图

- 头像：替换 `public/images/avatar.png`，保持文件名不变。Header、Footer、favicon、后台页都会自动使用。
- 首屏图：替换 `public/images/workbench.webp`，保持文件名不变；或在 `src/components/Hero.tsx` 中修改路径。
- 其他图片：放到 `public/images/`，在代码中用 `/images/文件名` 引用。

### 3.8 精选项目

`src/content.ts` 的 `work.projects` 目前是空数组。添加项目时：

```ts
{
  title: '项目名称',
  category: '课程作业 / 论文 / 代码',
  summary: '一句话说明',
  detail: '详细说明',
  meta: '课程、时间、技术栈等',
}
```

中英文两侧都需要添加，否则切换语言会不一致。

### 3.9 联系表单

- 文案在 `src/content.ts` 的 `contact.form`。
- 表单结构、提交逻辑在 `src/components/Sections.tsx` 的 `ContactForm`。
- 如果只是改提示文字，改 `content.ts` 即可。
- 如果要增加字段，除了改前端，还要改 `server/tickets.py` 的校验、SQLite 表结构、后台页面 `public/admin/index.html`。这类改动建议先备份数据库，并让 Qoder 处理。

---

## 4. 发布、回滚与应急发布

### 4.1 正常发布

```bash
git status
git add <修改的文件>
git commit -m "描述这次修改"
git push origin main
```

推送后 GitHub Actions 会自动：

1. `npm ci`
2. `npm run build`
3. rsync 静态文件到 `/var/www/kqin517.top`
4. rsync `server/` 到 `/opt/bob-tickets`
5. 重启 `bob-tickets.service`
6. 检查 `/api/health`

查看运行状态：

```bash
gh run list --branch main --limit 3
gh run watch <run-id> --exit-status
```

成功后再验证：

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://kqin517.top/
curl -s https://kqin517.top/api/health
```

### 4.2 回滚

优先用 `git revert`，不要直接改线上文件：

```bash
git log --oneline -5
git revert <有问题的提交>
git push origin main
```

Actions 会重新部署。等 Actions 成功后再检查页面。

如果是后端代码导致工单服务异常，也可以先回滚提交；Actions 不可用时，用“应急发布”恢复上一版 `server/tickets.py`。

### 4.3 GitHub 推送被阻断

本机到 GitHub 的 HTTPS 有时会超时。先重试：

```bash
git ls-remote origin main
git push origin main
```

如果仍然失败：

- 单个小文件（例如文档）可以用 GitHub API 更新，让 Qoder 处理。
- 多个文件或代码改动，建议等网络恢复，或让 Qoder 通过 GitHub API 创建提交。
- 不要为了绕过网络问题直接改 VPS 上的文件，否则 GitHub 会和线上不一致。

### 4.4 应急发布（绕过 GitHub）

仅在网络长期不可用、需要紧急修页面时使用。先构建：

```bash
npm run build
```

然后用 tar over SSH 上传（VPS 上有 rsync）：

```bash
tar -czf - -C dist . | ssh -i ~/.ssh/kqin517_vps_ed25519 kqin517@34.4.108.208 \
  "rm -rf /tmp/bob-dist && mkdir -p /tmp/bob-dist && tar -xzf - -C /tmp/bob-dist && \
   sudo rsync -a --delete /tmp/bob-dist/ /var/www/kqin517.top/ && \
   sudo chown -R gh-deploy:www-data /var/www/kqin517.top && rm -rf /tmp/bob-dist"
```

后端应急发布：

```bash
scp -i ~/.ssh/kqin517_vps_ed25519 server/tickets.py kqin517@34.4.108.208:/tmp/
ssh -i ~/.ssh/kqin517_vps_ed25519 kqin517@34.4.108.208 \
  "sudo install -o gh-deploy -g gh-deploy -m 644 /tmp/tickets.py /opt/bob-tickets/tickets.py && \
   sudo systemctl restart bob-tickets"
```

注意：

- 应急发布会绕过 GitHub，下一次正常 push 可能覆盖它。
- 应急发布后，务必把同样的改动补进仓库并 push，保持 GitHub 是唯一真实来源。

---

## 5. 工单系统

### 5.1 组成

| 部分 | 位置 |
| --- | --- |
| 前端表单 | `src/components/Sections.tsx` 的 `ContactForm` |
| 后端 | `server/tickets.py`（Python 标准库 + SQLite） |
| 数据库 | `/var/lib/bob-tickets/tickets.db` |
| 服务 | `bob-tickets.service`，监听 `127.0.0.1:8787` |
| 反向代理 | Nginx `/api/` |
| 后台页面 | `public/admin/index.html`，路径 `/admin/` |
| 后台认证 | Nginx Basic Auth，用户 `bob` |

### 5.2 API

| 方法 | 路径 | 说明 | 认证 |
| --- | --- | --- | --- |
| `GET` | `/api/health` | 健康检查 | 无 |
| `POST` | `/api/tickets` | 提交工单 | 无 |
| `GET` | `/api/admin/tickets` | 工单列表 | Basic Auth |
| `POST` | `/api/admin/tickets/{id}` | 修改状态 `{"status":"open"|"closed"}` | Basic Auth |
| `DELETE` | `/api/admin/tickets/{id}` | 永久删除工单 | Basic Auth |

### 5.3 数据字段

`id`、`created_at`、`name`、`email`、`subject`、`message`、`status`、`ip`。

- 时间为 UTC 存储，后台页面按浏览器本地时区显示。
- `ip` 来自 Nginx 的 `X-Real-IP`，用于识别垃圾提交。
- 工单正文只存在 SQLite，不会写入 Nginx 日志。

### 5.4 限流与防垃圾

- Nginx：每个 IP 约 3 次/分钟，允许 3 次突发；超出返回 429。
- Python：同一 IP 15 秒内只能提交一次，每小时最多 10 次。
- 表单有隐藏蜜罐字段，机器人填写后会被静默丢弃。
- 如果访客说“提交失败”，先确认是不是短时间内重复提交触发了限流；等 15 秒再试。

### 5.5 邮件通知（可选，目前未启用）

目前工单只进后台，不会自动发邮件。如需每张工单发到邮箱：

1. 在 Google 账号生成 Gmail 应用专用密码。
2. 在 GitHub 仓库 Settings → Secrets and variables → Actions 添加：
   - `SMTP_USER`
   - `SMTP_PASS`
   - `NOTIFY_TO`
3. 重新运行 Actions；工作流会把配置写入 `/opt/bob-tickets/.env` 并重启服务。

注意：

- 应用专用密码需要 Google 账号开启两步验证。
- 不要把应用专用密码提交到仓库或发到工单里。
- 如果没有配置这些 secret，服务会跳过邮件通知。

### 5.6 检查工单服务

```bash
sudo systemctl status bob-tickets --no-pager
sudo journalctl -u bob-tickets -n 100 --no-pager
curl -s http://127.0.0.1:8787/api/health
```

数据库只读检查：

```bash
sudo python3 -c "import sqlite3; c=sqlite3.connect('/var/lib/bob-tickets/tickets.db'); print('rows:', c.execute('select count(*) from tickets').fetchone()[0])"
```

不要在服务运行时直接用 SQL 改数据库；日常操作走后台页面。

---

## 6. 备份与恢复

### 6.1 备份策略

| 项目 | 值 |
| --- | --- |
| 时间 | 每天 19:15 UTC（中国时间约 03:15–03:25，带随机延迟） |
| 内容 | `/var/lib/bob-tickets/tickets.db` 的一致性快照 |
| 加密 | GPG 对称加密，AES-256 |
| 位置 | Google Drive → `BobPortfolioBackups` |
| 保留 | 30 天 |
| rclone 权限 | `drive.file`，只能访问它自己创建的文件 |
| 口令 | 与恢复包相同；不在仓库、不在 Drive 明文文件里 |

### 6.2 手动备份

```bash
sudo systemctl start bob-backup.service
sudo systemctl status bob-backup.service --no-pager
sudo journalctl -u bob-backup.service -n 30 --no-pager
```

查看 Drive 文件：

```bash
sudo -u gh-deploy rclone lsf gdrive:BobPortfolioBackups --files-only
sudo -u gh-deploy rclone lsf gdrive:BobPortfolioBackups/recovery --files-only
```

### 6.3 验证备份

在 VPS 上：

```bash
FILE=$(sudo -u gh-deploy rclone lsf gdrive:BobPortfolioBackups --files-only | sort | tail -1)
sudo -u gh-deploy rclone copyto "gdrive:BobPortfolioBackups/$FILE" "/tmp/$FILE"
sudo -u gh-deploy gpg --batch --yes --pinentry-mode loopback \
  --decrypt --passphrase-file /home/gh-deploy/.config/bob-backup/passphrase \
  --output /tmp/verify-tickets.db "/tmp/$FILE"
sudo -u gh-deploy python3 -c "import sqlite3; c=sqlite3.connect('/tmp/verify-tickets.db'); print('rows:', c.execute('select count(*) from tickets').fetchone()[0])"
sudo rm -f "/tmp/$FILE" /tmp/verify-tickets.db
```

### 6.4 恢复工单数据库

先停服务，再替换数据库：

```bash
FILE=<要恢复的备份文件名>
sudo -u gh-deploy rclone copyto "gdrive:BobPortfolioBackups/$FILE" "/tmp/$FILE"
sudo -u gh-deploy gpg --decrypt "/tmp/$FILE" > /tmp/tickets.db
sudo systemctl stop bob-tickets
sudo install -o gh-deploy -g gh-deploy -m 600 /tmp/tickets.db /var/lib/bob-tickets/tickets.db
sudo systemctl start bob-tickets
sudo rm -f "/tmp/$FILE" /tmp/tickets.db
curl -s https://kqin517.top/api/health
```

### 6.5 备份失败排查

1. `sudo journalctl -u bob-backup.service -n 50 --no-pager`
2. `sudo -u gh-deploy rclone lsf gdrive:BobPortfolioBackups --files-only`
3. 检查磁盘：`df -h /`
4. 检查口令文件：`sudo ls -l /home/gh-deploy/.config/bob-backup/passphrase`
5. 检查服务状态：`sudo systemctl list-timers bob-backup.timer --no-pager`
6. 如果是 Google 授权失效，需要重新授权 rclone；让 Qoder 处理，不要删除 Google 账号里的 rclone 授权。

### 6.6 恢复包

- 位置：Google Drive → `BobPortfolioBackups/recovery/bob-recovery-kit-2026-10-24.tar.gz.gpg`
- 内容：
  - `bob-recovery-2026`：恢复用 SSH 私钥
  - `bob-recovery-2026.pub`：公钥
  - `rclone.conf`：Google Drive 访问配置
  - `README.txt`：VPS、后台密码、恢复步骤
- 恢复公钥指纹：`SHA256:VSYCm6VuXr7G5sS0Z1HeG85N0H2ydjM6V9I8246gyiQ`
- 该公钥已加入 VPS 上 `kqin517` 的 `authorized_keys`，可 sudo。
- 解密口令与备份口令相同；口令不在恢复包内，必须在密码管理器或离线记录中保存。
- 本机的临时恢复私钥已删除；恢复私钥只存在于这个加密包里。

---

## 7. 换电脑与灾难恢复

### 7.1 电脑重装后

1. 重新安装 Qoder、Chrome、Git。
2. 登录 GitHub、Google Drive、阿里云、Google Cloud。
3. 从 Google Drive 下载恢复包：
   `BobPortfolioBackups/recovery/bob-recovery-kit-2026-10-24.tar.gz.gpg`
4. 用备份口令解密：
   ```bash
   gpg --output kit.tar.gz --decrypt bob-recovery-kit-2026-10-24.tar.gz.gpg
   tar -xzf kit.tar.gz
   ```
5. 恢复 SSH 私钥：
   ```bash
   mkdir -p ~/.ssh
   cp bob-recovery-2026 ~/.ssh/bob-recovery-2026
   chmod 600 ~/.ssh/bob-recovery-2026
   ssh -i ~/.ssh/bob-recovery-2026 kqin517@34.4.108.208
   ```
6. 克隆仓库：
   ```bash
   git clone https://github.com/kqin517-debug/bob-portfolio.git
   cd bob-portfolio
   ```
7. 阅读 `RECOVERY.md` 和本文件；后台密码、rclone 配置在恢复包的 `README.txt` 里。
8. 之后按正常流程修改、push、Actions 自动部署。

### 7.2 VPS 丢失或重装

1. 新建 Ubuntu VPS，记录新 IP。
2. 在阿里云 DNS 把 `@` 和 `www` 的 A 记录改到新 IP。
3. 安装 Nginx、Python 3、rsync、rclone、gnupg。
4. 创建 `gh-deploy` 用户，按 `deploy/` 里的配置重建：
   - Nginx 站点配置
   - `bob-tickets.service`
   - `bob-backup.service` / `bob-backup.timer`
   - sudoers 规则
5. 从恢复包恢复 `rclone.conf`，再从 Drive 下载最新工单备份并恢复数据库。
6. 更新 GitHub Actions 的 `VPS_HOST`（如果 IP 变了）和相关 secrets，push 一次触发部署。
7. 重新申请证书（Certbot），检查 HTTPS、工单后台和备份定时器。

### 7.3 恢复公钥的撤销

如果恢复包泄露，或不再需要恢复密钥：

```bash
sudo cp /home/kqin517/.ssh/authorized_keys /home/kqin517/.ssh/authorized_keys.bak
sudo sed -i '/bob-recovery-2026-10-24/d' /home/kqin517/.ssh/authorized_keys
```

撤销后，恢复包里的私钥无法再登录。请同时更换后台密码，并重新制作恢复包。

---

## 8. VPS 维护

### 8.1 登录

```bash
ssh -i ~/.ssh/kqin517_vps_ed25519 kqin517@34.4.108.208
```

如果本机没有旧密钥，使用恢复包里的 `bob-recovery-2026`。

### 8.2 服务状态

```bash
sudo systemctl status nginx --no-pager
sudo systemctl status bob-tickets --no-pager
sudo systemctl status bob-backup.timer --no-pager
```

重启：

```bash
sudo systemctl restart bob-tickets
sudo systemctl reload nginx
```

日志：

```bash
sudo journalctl -u bob-tickets -n 100 --no-pager
sudo journalctl -u bob-backup -n 50 --no-pager
sudo tail -n 50 /var/log/nginx/kqin517.top.error.log
```

### 8.3 Nginx 配置

线上配置：`/etc/nginx/sites-available/kqin517.top`（`sites-enabled` 是符号链接）。

仓库参考：`deploy/nginx-kqin517.top.conf`。

修改后必须测试：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

注意：

- 不要删除 Certbot 管理的 `ssl_certificate`、`listen 443 ssl` 等行。
- 不要把 `/api/` 暴露到公网；工单服务只监听 `127.0.0.1:8787`。
- `/admin/` 和 `/api/admin/` 必须保留 Basic Auth。
- 改完线上 Nginx 后，把同样的改动同步到仓库的 `deploy/nginx-kqin517.top.conf`。

### 8.4 系统更新

```bash
sudo apt update
sudo apt upgrade
```

- 更新后检查 Nginx、`bob-tickets`、备份定时器。
- 如果更新内核或系统提示需要重启，选一个低峰时间 `sudo reboot`，重启后检查服务。
- 不要在这台小内存 VPS 上安装 Docker、MySQL/PostgreSQL、面板、监控套件等重服务。

### 8.5 磁盘和内存

```bash
free -h
df -h /
sudo du -sh /var/www/kqin517.top /var/lib/bob-tickets /var/log/nginx
ps -eo pid,comm,rss --sort=-rss | head
```

当前网站占用很小：静态文件不到 1 MB，数据库约 20 KB，工单服务约 25 MB 内存。

如果内存紧张：

- 先重启 `bob-tickets`，看是否恢复。
- 检查是否有不认识的服务在占内存；不要随意停别人的服务。
- 不要新增常驻服务；必要时考虑升级 VPS 配置或加 swap（需评估磁盘和性能）。

### 8.6 systemd 单元

```bash
sudo systemctl daemon-reload
sudo systemctl restart bob-tickets
sudo systemctl restart bob-backup.timer
```

修改 `/etc/systemd/system/` 下的单元后，必须 `daemon-reload`。

仓库里的 `deploy/*.service`、`deploy/*.timer`、`deploy/sudoers-bob-tickets` 是参考文件；GitHub Actions **不会**自动安装这些系统级配置，换 VPS 时要手动重建。

---

## 9. HTTPS 与 DNS

### 9.1 证书

- 证书：Let's Encrypt
- 域名：`kqin517.top`、`www.kqin517.top`
- 到期：2027-01-20
- 自动续期：`certbot.timer`

检查：

```bash
sudo certbot certificates
sudo systemctl list-timers certbot.timer --no-pager
sudo certbot renew --dry-run
```

如果续期失败：

1. 确认 DNS 仍指向 `34.4.108.208`。
2. 确认 80/443 端口可从公网访问。
3. 检查 `/var/log/letsencrypt/letsencrypt.log`。
4. 不要手动删除 `/etc/letsencrypt/`。

### 9.2 DNS

阿里云 DNS：

- `@` → A → `34.4.108.208`
- `www` → A → `34.4.108.208`
- TTL 约 10 分钟

检查：

```bash
dig +short kqin517.top
dig +short www.kqin517.top
```

如果 VPS IP 变了：

1. 改阿里云 A 记录。
2. 改 `.github/workflows/deploy.yml` 里的 `VPS_HOST`。
3. 更新 GitHub Actions 的 `VPS_KNOWN_HOSTS`（如果主机密钥变了）。
4. 重新测试 HTTPS 和自动部署。

### 9.3 HTTP 跳转

`http://` 会 301 到 `https://`。检查：

```bash
curl -sI http://kqin517.top/ | head -5
```

应看到 `301 Moved Permanently` 和 `Location: https://kqin517.top/`。

### 9.4 腾讯/QQ 浏览器灰色盾牌

灰色盾牌不是证书错误，也不是阿里云能设置的。它是腾讯给域名的“安全性未知”评级，常见于新域名、无 ICP 备案、海外主机。

处理方式：

- 腾讯网址安全中心提交检测/申诉；
- 等待腾讯/百度爬虫收录；
- 如果必须绿色盾牌，通常需要大陆服务器 + ICP 备案。

不要为了这个提示更换证书或重装 Nginx；先区分是“证书错误”还是“安全评级未知”。

---

## 10. 安全

### 10.1 当前安全配置

- SSH 密码登录已关闭，仅允许密钥。
- root 仅允许密钥登录。
- `kqin517` 有 passwordless sudo；只在本机和安全环境使用。
- `gh-deploy` 无 sudo，只能写站点和工单服务目录。
- 工单后台使用 Basic Auth，必须通过 HTTPS。
- 工单服务只监听 `127.0.0.1:8787`，不直接暴露公网。
- rclone 使用 `drive.file` 范围，只能访问它自己创建的备份文件。
- 仓库是公开的，**绝不能提交**密码、私钥、token、恢复包或 `.env`。

### 10.2 修改后台密码

生成新密码的 apr1 哈希（把 `<新密码>` 换成你的新密码）：

```bash
HASH=$(openssl passwd -apr1 '<新密码>')
printf 'bob:%s\n' "$HASH" | sudo tee /etc/nginx/.htpasswd-bob >/dev/null
sudo chown root:www-data /etc/nginx/.htpasswd-bob
sudo chmod 640 /etc/nginx/.htpasswd-bob
sudo nginx -t && sudo systemctl reload nginx
```

改完后：

- 更新密码管理器。
- 更新恢复包 `README.txt` 里的后台密码；否则恢复包里的密码会过期。
- 如果恢复包泄露，先改密码，再考虑重新制作恢复包。

### 10.3 备份口令

- 备份和恢复包使用同一个口令。
- 口令只放在密码管理器/离线记录中，不放在 Drive、仓库、工单或普通笔记里。
- 口令丢失 = 备份和恢复包都无法解密。
- 如果怀疑泄露，需要重新加密所有备份并重新制作恢复包；让 Qoder 处理。

### 10.4 rclone 授权

- 不要删除 Google 账号里的 rclone 授权，否则每日备份会停止。
- 如果授权失效，需要重新走 Google OAuth；让 Qoder 处理。
- `rclone.conf` 包含 refresh token，权限必须是 600，只放在 VPS 和加密恢复包里。
- 不要把 `rclone.conf` 提交到仓库。

### 10.5 恢复密钥

- 恢复公钥在 VPS 的 `/home/kqin517/.ssh/authorized_keys`，注释是 `bob-recovery-2026-10-24`。
- 恢复私钥只在 Drive 的加密恢复包里。
- 如果恢复包泄露，撤销公钥并更换后台密码。
- 撤销命令见 [7.3](#73-恢复公钥的撤销)。

### 10.6 泄露应急

如果发现密码、私钥、token 或恢复包泄露：

1. 立即更换后台密码。
2. 撤销恢复公钥。
3. 在 Google 账号撤销 rclone 授权，重新授权。
4. 如果 VPS SSH 私钥泄露，删除对应公钥并生成新密钥。
5. 检查 `authorized_keys`、Nginx 配置、`/opt/bob-tickets` 和数据库是否有异常。
6. 重新制作恢复包，更新密码管理器。

---

## 11. 故障排查

### 11.1 网站打不开

| 现象 | 先检查 | 处理 |
| --- | --- | --- |
| 首页 502/504 | `sudo systemctl status nginx`、`sudo systemctl status bob-tickets` | 重启对应服务，查日志 |
| 首页 404 | `ls /var/www/kqin517.top` | 重新部署；检查 Actions 是否成功 |
| 首页 200 但样式丢失 | 浏览器控制台、`/assets/` 请求 | 重新构建/部署，检查静态文件缓存 |
| HTTPS 证书错误 | `sudo certbot certificates` | 检查 DNS、80 端口、Certbot 日志 |
| 全部超时 | DNS、GCP 防火墙、VPS 状态 | `dig`、GCP 控制台、SSH 是否可连 |

### 11.2 工单提交失败

1. 检查 API：
   ```bash
   curl -s https://kqin517.top/api/health
   ```
2. 检查服务：
   ```bash
   sudo systemctl status bob-tickets --no-pager
   sudo journalctl -u bob-tickets -n 50 --no-pager
   ```
3. 检查磁盘：
   ```bash
   df -h /
   ```
4. 如果是 429，等 15 秒再试；同一 IP 每小时最多 10 次。
5. 检查 Nginx `/api/` 配置和错误日志。
6. 如果数据库损坏，先备份当前文件，再从最近的 Drive 备份恢复。

### 11.3 后台打不开/401

- 401 是正常的登录挑战；输入用户名 `bob` 和密码。
- 密码错误：用 [10.2](#102-修改后台密码) 重置。
- 页面 404：检查 `/var/www/kqin517.top/admin/index.html` 是否存在。
- 页面 500/502：检查 Nginx 和权限。

### 11.4 备份没有生成

```bash
sudo systemctl list-timers bob-backup.timer --no-pager
sudo journalctl -u bob-backup.service -n 50 --no-pager
sudo -u gh-deploy rclone lsf gdrive:BobPortfolioBackups --files-only
```

常见原因：网络、rclone 授权失效、口令文件不可读、磁盘满。不要删除现有备份。

### 11.5 GitHub Actions 失败

```bash
gh run list --branch main --limit 3
gh run view <run-id> --log-failed
```

常见原因：

- `npm ci` 失败：`package-lock.json` 与 `package.json` 不一致。
- 构建失败：TypeScript 错误。
- rsync/SSH 失败：VPS 不可达、密钥/known_hosts 过期、`gh-deploy` 权限问题。
- 服务重启失败：sudoers 规则或 unit 文件问题。

修复后重新 push；也可以在 GitHub Actions 页面点 “Re-run failed jobs”。

### 11.6 内存不足

```bash
free -h
ps -eo pid,comm,rss --sort=-rss | head
```

处理：

- 重启 `bob-tickets`。
- 检查是否有异常进程。
- 不要随意停止不认识的服务。
- 不要安装重型服务；必要时升级 VPS 或加 swap。

### 11.7 腾讯灰色盾牌

见 [9.4](#94-腾讯qq-浏览器灰色盾牌)。这是腾讯评级问题，不是证书问题。

---

## 12. 资源限制与约定

- VPS：2 vCPU、约 1 GB 内存、28 GB 磁盘、无 swap。
- 网站相关占用很小：静态文件 < 1 MB，数据库约 20 KB，Python 服务约 25 MB 内存。
- 备份是每天一次 oneshot，跑完退出，不常驻。
- **不要**在这台 VPS 上安装 Docker、MySQL/PostgreSQL、控制面板、重型监控、ELK 等。
- 新功能优先做成静态前端或复用现有 Python 服务；需要新常驻服务时先评估内存。
- 工单量很小，SQLite 足够；不要为了“以后可能很大”提前上数据库服务器。
- 图片和下载文件放 `public/`，构建后由 Nginx 静态提供；不要放大文件到工单服务内存里。
- 本机不是唯一副本：代码在 GitHub、数据在 VPS、备份在 Drive、密钥在恢复包/密码管理器。
- Qoder 进行任何 VPS/网站改动时，应遵守：
  1. 先读 `RECOVERY.md` 和本文件；
  2. 不把本机作为唯一副本；
  3. 不新增非必要服务；
  4. 改完验证线上状态；
  5. 把改动同步到 GitHub 和备份。

---

## 13. 常用命令速查

### 13.1 本机

```bash
npm install
npm run dev
npm run build
git status
git add <files>
git commit -m "message"
git push origin main
gh run list --branch main --limit 3
gh run watch <run-id> --exit-status
```

### 13.2 SSH 与状态

```bash
ssh -i ~/.ssh/kqin517_vps_ed25519 kqin517@34.4.108.208
sudo systemctl status nginx --no-pager
sudo systemctl status bob-tickets --no-pager
sudo systemctl status bob-backup.timer --no-pager
sudo systemctl list-timers --no-pager
free -h
df -h /
```

### 13.3 日志

```bash
sudo journalctl -u bob-tickets -n 100 --no-pager
sudo journalctl -u bob-backup -n 50 --no-pager
sudo tail -n 50 /var/log/nginx/kqin517.top.error.log
sudo tail -n 50 /var/log/nginx/kqin517.top.access.log
```

### 13.4 健康检查

```bash
curl -s https://kqin517.top/api/health
curl -s -o /dev/null -w '%{http_code}\n' https://kqin517.top/
curl -s -o /dev/null -w '%{http_code}\n' https://kqin517.top/admin/
```

### 13.5 备份

```bash
sudo systemctl start bob-backup.service
sudo systemctl status bob-backup.service --no-pager
sudo journalctl -u bob-backup.service -n 30 --no-pager
sudo -u gh-deploy rclone lsf gdrive:BobPortfolioBackups --files-only
sudo -u gh-deploy rclone lsf gdrive:BobPortfolioBackups/recovery --files-only
```

### 13.6 证书

```bash
sudo certbot certificates
sudo systemctl list-timers certbot.timer --no-pager
sudo certbot renew --dry-run
```

### 13.7 Nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 14. 变更记录

- **2026-10-24**：创建运维手册；记录站点、工单、备份、恢复包、VPS 维护和故障排查流程。
