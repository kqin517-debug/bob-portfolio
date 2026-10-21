/**
 * 条目正文的通用结构：每篇论文 / 课程作业都可以由若干小节组成，
 * 索引页只读取摘要与元数据，详情页才渲染 paragraphs 与 bullets。
 */
export interface ContentSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}
