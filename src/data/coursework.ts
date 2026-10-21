import type { ContentSection } from "@/data/types";

export type CourseworkKind = "homework" | "lab" | "project" | "notes";
export type ContentFileKind =
  | "pdf"
  | "zip"
  | "docx"
  | "pptx"
  | "ipynb"
  | "link";

export interface CourseFile {
  label: string;
  url: string;
  kind: ContentFileKind;
  size?: string;
}

export interface CourseworkItem {
  id: string;
  kind: CourseworkKind;
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  sections?: ContentSection[];
  files: CourseFile[];
  codeUrl?: string;
}

export interface Course {
  id: string;
  name: string;
  code?: string;
  term: string;
  instructor?: string;
  description?: string;
  items: CourseworkItem[];
}

// 课程是课程作业的一级分类，数组顺序即索引页顺序，最新学期放最前。
// 新增课程时复制一个 Course 对象并保证 id 唯一；条目详情页为
// /coursework/<course-id>/<item-id>/，附件放 public/files/coursework/<course-id>/。
export const courses: Course[] = [
  {
    id: "frontend-practice",
    name: "前端工程实践",
    code: "FE 101",
    term: "2026 秋",
    description:
      "以本作品集为练习项目的课程作业归档。当前条目为站点功能演示，可随时替换为自己的课程与作业。",
    items: [
      {
        id: "responsive-homepage",
        kind: "homework",
        title: "作业 01：响应式个人主页与静态部署",
        date: "2026-10-09",
        description:
          "从页面骨架、内容模型到 GitHub Pages 自动部署的完整作业报告，附自测清单与问题复盘。",
        tags: ["响应式", "静态部署"],
        sections: [
          {
            heading: "作业要求",
            paragraphs: [
              "在不引入后端的前提下完成一个响应式个人主页，并部署到 GitHub Pages。页面需要包含个人介绍、内容展示和联系方式，附件与外部链接均可访问。",
            ],
          },
          {
            heading: "实现过程",
            paragraphs: [
              "页面采用 Next.js App Router 与 Tailwind CSS 搭建，内容放在独立的 TypeScript 数据文件中，组件只负责渲染。导航使用固定侧栏配合滚动监听，移动端折叠为抽屉。",
              "部署前通过 output: export 导出静态文件，再由 GitHub Actions 构建并发布到 Pages。",
            ],
          },
          {
            heading: "遇到的问题",
            paragraphs: [],
            bullets: [
              "public/ 下的附件不会自动带上 basePath，需要统一走 resolveContentUrl 补前缀。",
              "静态导出后每个路由需要 trailingSlash，否则子路径刷新可能 404。",
              "深浅主题要在首屏渲染前恢复，避免刷新时闪烁。",
            ],
          },
          {
            heading: "自测清单",
            paragraphs: [],
            bullets: [
              "桌面端与移动端导航均可用。",
              "PDF 附件在子路径部署下可以打开。",
              "深浅主题切换后刷新仍保持选择。",
              "npm run build 无类型错误，out/ 产物完整。",
            ],
          },
        ],
        files: [
          {
            label: "作业报告.pdf",
            url: "/files/coursework/frontend-practice/homework-01-responsive-homepage.pdf",
            kind: "pdf",
            size: "226 KB",
          },
        ],
        codeUrl: "https://github.com/kqin517-debug/bob-portfolio",
      },
      {
        id: "static-export-notes",
        kind: "notes",
        title: "笔记：静态导出的关键配置",
        date: "2026-10-13",
        description:
          "记录 output: export、trailingSlash 与 basePath 三者的关系，以及本地预览静态产物的正确方式。",
        tags: ["Next.js", "配置"],
        sections: [
          {
            heading: "关键结论",
            paragraphs: [
              "静态导出不是“少一个服务器”这么简单：路由、资源前缀和刷新行为都需要在构建时确定下来。",
            ],
          },
          {
            heading: "配置组合",
            paragraphs: [
              "三个配置项的关系可以用一句话概括：output 决定产物形态，trailingSlash 决定文件布局，basePath 决定资源前缀。",
            ],
            bullets: [
              "output: \"export\"：构建时生成纯静态文件，不能使用服务端运行时能力。",
              "trailingSlash: true：每个路由输出 <route>/index.html，GitHub Pages 刷新子路径时更稳定。",
              "basePath 与 assetPrefix：项目型 Pages 站点部署在 /<repo>/ 下时两者都要设置。",
            ],
          },
          {
            heading: "本地预览",
            paragraphs: [
              "直接打开 out/index.html 无法正确解析路由，应该用静态服务器托管 out/ 目录，再访问对应路径进行验证。",
            ],
          },
        ],
        files: [
          {
            label: "Next.js 静态导出文档",
            url: "https://nextjs.org/docs/app/building-your-application/deploying/static-exports",
            kind: "link",
          },
        ],
      },
    ],
  },
];
