import type { Course, CourseworkKind } from "@/data/coursework";
import { paperCategories, type PaperItem } from "@/data/papers";

export type LatestUpdateKind = "paper" | "coursework";

export interface LatestUpdate {
  id: string;
  kind: LatestUpdateKind;
  title: string;
  date: string;
  section: "papers" | "coursework";
  href: string;
}

export const courseworkKindLabels: Record<CourseworkKind, string> = {
  homework: "作业",
  lab: "实验",
  project: "项目",
  notes: "笔记",
};

export function formatDate(date: string) {
  return date.replace(/-/g, ".");
}

export function getPaperCategory(categoryId: string) {
  return paperCategories.find((category) => category.id === categoryId);
}

export function getPaperCategoryName(categoryId: string) {
  return getPaperCategory(categoryId)?.name ?? categoryId;
}

export function countWords(text: string) {
  const cjk = text.match(/[\u3400-\u9fff]/g)?.length ?? 0;
  const latin = text.match(/[A-Za-z0-9]+/g)?.length ?? 0;
  return cjk + latin;
}

export function getPaperReadingMinutes(paper: PaperItem) {
  const sectionText = (paper.sections ?? [])
    .flatMap((section) => [...section.paragraphs, ...(section.bullets ?? [])])
    .join("");
  return Math.max(1, Math.ceil(countWords(paper.abstract + sectionText) / 400));
}

export function getLatestUpdates(
  papers: PaperItem[],
  courses: Course[],
  limit = 4
): LatestUpdate[] {
  const updates: LatestUpdate[] = [
    ...papers.map((paper) => ({
      id: `paper-${paper.id}`,
      kind: "paper" as const,
      title: paper.title,
      date: paper.date,
      section: "papers" as const,
      href: `/papers/${paper.id}/`,
    })),
    ...courses.flatMap((course) =>
      course.items.map((item) => ({
        id: `work-${item.id}`,
        kind: "coursework" as const,
        title: item.title,
        date: item.date,
        section: "coursework" as const,
        href: `/coursework/${course.id}/${item.id}/`,
      }))
    ),
  ];

  return updates.sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}
