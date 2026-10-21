export interface Assignment {
  id: string;
  title: string;
  tag: string;
  dueAt?: string;
}

// 论文条目在此维护；id 用于记录浏览器内的完成状态，修改标题时请保留 id。
// 留空时侧栏仍保留“论文区”标题与面板，只是内容留白。
export const assignments: Assignment[] = [];
