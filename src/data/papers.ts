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
export const papers: PaperItem[] = [];