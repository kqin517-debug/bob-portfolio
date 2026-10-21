export interface Assignment {
  id: string;
  title: string;
  tag: string;
  dueAt?: string;
}

// 作业条目在此维护；id 用于记录浏览器内的完成状态，修改标题时请保留 id。
export const assignments: Assignment[] = [
  {
    id: "debounce-hook-drill",
    title: "手写 useDebounceFn 并补测试",
    tag: "React",
    dueAt: "10-22",
  },
  {
    id: "async-pool-drill",
    title: "完成 asyncPool 并发控制练习",
    tag: "TypeScript",
    dueAt: "10-25",
  },
  {
    id: "glass-search-drill",
    title: "复刻玻璃面板搜索交互",
    tag: "UI",
    dueAt: "10-28",
  },
];
