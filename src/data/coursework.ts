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

// 数组顺序即展示顺序，最新学期放最前；附件放 public/files/coursework/<course-id>/。
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