/** @type {import('next').NextConfig} */
const nextConfig = {
  // 纯静态导出：构建产物输出到 out/，可直接托管于 GitHub Pages / 任意 CDN
  output: "export",
  // 每个路由导出为 <route>/index.html，避免 GitHub Pages 上的路径解析歧义
  trailingSlash: true,
  // 未使用 Next.js 图片优化服务，静态导出下必须关闭优化
  images: {
    unoptimized: true,
  },
  // 项目型 Pages 站点部署在 https://<user>.github.io/<repo>/ 子路径下，
  // 因此需要 basePath/assetPrefix。仓库名未确定前保持为空（即根路径部署）。
  // 部署时由 CI 注入 NEXT_PUBLIC_BASE_PATH=/<repo-name> 自动生效。
  ...(process.env.NEXT_PUBLIC_BASE_PATH
    ? {
        basePath: process.env.NEXT_PUBLIC_BASE_PATH,
        assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH,
      }
    : {}),
};

export default nextConfig;