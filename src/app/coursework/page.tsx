import type { Metadata } from "next";
import { CourseworkExplorer } from "@/components/coursework/CourseworkExplorer";
import { ModuleShell } from "@/components/layout/ModuleShell";

export const metadata: Metadata = {
  title: "课程作业索引 | Bob 的学习手记",
  description: "按课程与类型检索作业、实验、项目与笔记，点开条目查看正文和附件。",
};

export default function CourseworkPage() {
  return (
    <ModuleShell active="coursework">
      <CourseworkExplorer />
    </ModuleShell>
  );
}
