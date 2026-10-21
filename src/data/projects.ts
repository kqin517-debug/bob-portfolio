export interface ProjectItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  dotColor: string;
  category: string;
  stars?: string;
  technologies: string[];
  metrics?: string;
  demoUrl?: string;
  githubUrl?: string;
}

// 保持为空时，项目区块与侧栏入口会自动隐藏。
export const featuredProjects: ProjectItem[] = [];
