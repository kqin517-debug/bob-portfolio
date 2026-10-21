export interface PaperItem {
  id: string;
  title: string;
  authors: string[];
  date: string;
  venue?: string;
  course?: string;
  tags: string[];
  abstract: string;
  pdfUrl?: string;
  codeUrl?: string;
  slidesUrl?: string;
  bibtex?: string;
}

// 新增论文时照下面的结构添加；id 用于 #paper-<id> 锚点，请保持 URL 安全。
// {
//   id: "transformer-survey",
//   title: "论文标题",
//   authors: ["Bob"],
//   date: "2026-09-30",
//   venue: "课程 / 会议 / 期刊",
//   course: "课程名",
//   tags: ["Transformer", "NLP"],
//   abstract: "摘要正文……",
//   pdfUrl: "/files/papers/transformer-survey.pdf",
//   codeUrl: "https://github.com/...",
//   bibtex: "@misc{...}",
// }
export const papers: PaperItem[] = [
  {
    id: "static-academic-portfolio",
    title: "静态个人学术主页的设计与实现",
    authors: ["Bob"],
    date: "2026-10-16",
    venue: "技术报告",
    tags: ["Next.js", "静态站点", "内容架构"],
    abstract:
      "本文记录了一个纯静态个人学术主页的设计与实现过程。站点基于 Next.js 15 的静态导出能力，用独立的 TypeScript 数据文件描述论文与课程作业，使内容维护与界面渲染相互解耦。文章重点讨论内容模型、条件渲染、附件路径处理以及 GitHub Pages 的自动部署流程。在无后端的前提下，站点提供论文摘要展开、BibTeX 一键复制、附件预览与下载、深浅主题切换等交互，并由 GitHub Actions 在每次推送后自动构建发布。文末给出后续的维护清单，方便把示例内容替换为真实论文与课程作业。",
    pdfUrl: "/files/papers/static-academic-portfolio.pdf",
    codeUrl: "https://github.com/kqin517-debug/bob-portfolio",
    bibtex: `@misc{bob2026portfolio,
  author = {Bob},
  title = {静态个人学术主页的设计与实现},
  year = {2026},
  month = {10},
  note = {技术报告（站点功能示例）},
  url = {https://github.com/kqin517-debug/bob-portfolio}
}`,
  },
];