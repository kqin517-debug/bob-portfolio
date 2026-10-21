import type { Metadata } from "next";
import { ModuleShell } from "@/components/layout/ModuleShell";
import { PapersExplorer } from "@/components/papers/PapersExplorer";

export const metadata: Metadata = {
  title: "论文索引 | Bob 的学习手记",
  description: "按分类、年份和关键词检索论文，点开条目查看摘要、正文、附件与引用。",
};

export default function PapersPage() {
  return (
    <ModuleShell active="papers">
      <PapersExplorer />
    </ModuleShell>
  );
}
