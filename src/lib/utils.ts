/**
 * Next.js 不会为 public/ 目录下的静态资源自动加上 basePath。
 * 部署到 GitHub Pages 项目子路径 (https://<user>.github.io/<repo>/) 时，
 * 必须手动补上前缀，否则头像与背景图会 404。
 *
 * 部署到根路径（自定义域名或 <user>.github.io 仓库）时该值为空字符串，
 * 函数退化为原路径，行为与之前一致。
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetPath(path: string) {
  return `${BASE_PATH}${path}`;
}
