import type { ContentSection } from "@/data/types";

export interface PaperCategory {
  id: string;
  name: string;
  description: string;
}

export interface PaperItem {
  id: string;
  title: string;
  authors: string[];
  date: string;
  /** 对应 paperCategories 中的 id，索引页按此分组。 */
  category: string;
  venue?: string;
  course?: string;
  tags: string[];
  abstract: string;
  sections?: ContentSection[];
  pdfUrl?: string;
  codeUrl?: string;
  slidesUrl?: string;
  bibtex?: string;
}

// 分类顺序即索引页顺序；没有内容的分类不会出现在筛选栏。
export const paperCategories: PaperCategory[] = [
  {
    id: "course-paper",
    name: "课程论文",
    description: "课程结课论文、学期报告与文献综述。",
  },
  {
    id: "technical-report",
    name: "技术报告",
    description: "工程实现、技术方案与项目复盘。",
  },
  {
    id: "reading-notes",
    name: "阅读笔记",
    description: "论文精读、专题整理与知识卡片。",
  },
  {
    id: "other",
    name: "其他写作",
    description: "不属于以上分类的写作与整理。",
  },
];

// 新增论文时照下面的结构添加；id 用于 /papers/<id>/ 静态路由，请保持 URL 安全。
// {
//   id: "transformer-survey",
//   title: "论文标题",
//   authors: ["Bob"],
//   date: "2026-09-30",
//   category: "reading-notes",
//   venue: "课程 / 会议 / 期刊",
//   course: "课程名",
//   tags: ["Transformer", "NLP"],
//   abstract: "摘要正文……",
//   sections: [{ heading: "小节标题", paragraphs: ["段落……"], bullets: ["要点……"] }],
//   pdfUrl: "/files/papers/transformer-survey/paper.pdf",
//   codeUrl: "https://github.com/...",
//   bibtex: "@misc{...}",
// }
export const papers: PaperItem[] = [
  {
    id: "static-academic-portfolio",
    title: "静态个人学术主页的设计与实现",
    authors: ["Bob"],
    date: "2026-10-16",
    category: "technical-report",
    venue: "技术报告",
    tags: ["Next.js", "静态站点", "内容架构"],
    abstract:
      "本文记录了一个纯静态个人学术主页从“首页罗列全部内容”到“索引 + 条目页”的改造过程。站点基于 Next.js 15 的静态导出能力，用独立的 TypeScript 数据文件描述论文与课程作业，并以分类、年份、课程和关键词组织检索。文章重点讨论内容模型、分类划分、静态路由、附件路径处理以及 GitHub Pages 的自动部署流程。改造后，访客先在索引页搜索或筛选，点开条目才看到完整正文、附件与引用信息，首页只保留最新入口。",
    sections: [
      {
        heading: "为什么要做成内容索引",
        paragraphs: [
          "最初的版本把论文摘要、附件和按钮全部铺在首页，条目一多，首页就会变成一条很长的清单，想找某一篇论文只能反复滚动。",
          "新的结构把“浏览”和“阅读”拆成两层：首页只保留最新条目作为入口，论文索引负责搜索、分类和浏览，点开条目后才进入独立的文章页。这样条目数量增长时，首页仍然保持稳定。",
        ],
      },
      {
        heading: "内容模型与分类",
        paragraphs: [
          "每篇论文对应一个 PaperItem，id 作为静态路由的 slug，category 指向 paperCategories 中登记的分类，tags 用来记录主题关键词。分类、年份和关键词共同构成索引页的筛选维度。",
          "论文按类型归档，而不是把课程论文和技术报告混在一起。新增论文时，先在 paperCategories 里确认分类存在，再在 papers 数组中追加条目即可，索引页会自动更新数量和筛选选项。",
        ],
      },
      {
        heading: "静态导出与路由",
        paragraphs: [
          "站点使用 Next.js 15 的 output: export，构建时通过 generateStaticParams 为每篇论文生成 /papers/<id>/ 页面，因此搜索和阅读都不依赖服务器。",
          "课程作业采用相同的思路，以“课程 → 条目”两级路径组织，保证不同课程下即使出现同名作业也不会互相覆盖。",
        ],
      },
      {
        heading: "阅读页的组成",
        paragraphs: [
          "文章页由标题信息、摘要、正文分节、附件与引用信息组成。正文按小节渲染并生成目录；附件保留 PDF、代码和幻灯片的原始入口；BibTeX 可以直接复制。",
          "条目底部提供上一篇 / 下一篇导航，读完后可以沿着时间线继续浏览，而不是退回索引重新查找。",
        ],
      },
      {
        heading: "后续维护清单",
        paragraphs: ["把示例内容替换成自己的论文时，按下面的顺序操作即可："],
        bullets: [
          "在 public/files/papers/<paper-id>/ 下放置 PDF 等附件。",
          "在 src/data/papers.ts 中登记分类并填写论文元数据，id 保持英文短横线格式。",
          "摘要保持一段完整文字，正文按小节拆分到 sections，方便生成目录。",
          "运行 npm run build，确认新条目的静态路由已出现在 out/papers/ 下。",
        ],
      },
    ],
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
