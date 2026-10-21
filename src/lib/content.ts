import type { Course, CourseworkKind } from "@/data/coursework";
import type { PaperItem } from "@/data/papers";

export type LatestUpdateKind = "paper" | "coursework";

export interface LatestUpdate {
  id: string;
  kind: LatestUpdateKind;
  title: string;
  date: string;
  section: "papers" | "coursework";
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
    })),
    ...courses.flatMap((course) =>
      course.items.map((item) => ({
        id: `work-${item.id}`,
        kind: "coursework" as const,
        title: item.title,
        date: item.date,
        section: "coursework" as const,
      }))
    ),
  ];

  return updates.sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}
