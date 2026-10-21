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
  featured: boolean;
}

export const featuredProjects: ProjectItem[] = [
  {
    id: "crystal-ui-engine",
    name: "Crystal Glass Design System",
    tagline: "现代前端高阶毛玻璃拟态组件套件",
    description: "专为 Next.js 15 & Tailwind 打造的极致微光玻璃拟态组件系统，提供 30+ 种具备自然物理漫反射效果的交互卡片、Dock 栏与控制面板。",
    dotColor: "#21FF6B",
    category: "Design System",
    technologies: ["React 19", "Tailwind CSS", "TypeScript", "Framer Motion"],
    featured: true,
  },
  {
    id: "syntax-forge",
    name: "SyntaxForge CLI",
    tagline: "极速代码片段提取与多格式高亮发布工具",
    description: "基于 Rust & TextMate 语法的零配置代码提取工具，支持从现有工程中智能提炼高频复用 Snippet 并同步导出带深色微光主题的静态站点。",
    dotColor: "#FF4C24",
    category: "Developer Tools",
    technologies: ["Rust", "Wasm", "Shiki", "AST Parser"],
    featured: true,
  },
  {
    id: "hyper-cache-kv",
    name: "HyperCache KV",
    tagline: "边缘优先分布式内存缓存层",
    description: "面向 Serverless 与 Edge Functions 的超轻量 KV 缓存引擎，内置 LRU、TTL 自动刷新机制与基于 WebSocket 的数据实时订阅通道。",
    dotColor: "#3865FF",
    category: "Infrastructure",
    technologies: ["TypeScript", "Cloudflare Workers", "Web Crypto"],
    featured: true,
  },
];
