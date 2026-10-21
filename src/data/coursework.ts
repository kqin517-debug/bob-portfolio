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
export const courses: Course[] = [];