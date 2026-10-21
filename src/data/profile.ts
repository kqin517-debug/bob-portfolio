export interface ProfileData {
  name: string;
  role: string;
  greeting: string;
  bio: string;
  avatar: string;
  status: {
    state: "available" | "busy" | "focused";
    label: string;
  };
  focus: string[];
  metrics: {
    label: string;
    value: string;
    description: string;
    trend?: string;
  }[];
  socials: {
    name: string;
    href: string;
    icon: string;
  }[];
}

export const profileData: ProfileData = {
  name: "Mike Chen",
  role: "Full-Stack Architect & Open Source Crafter",
  greeting: "Hello & Welcome",
  bio: "专注高质感 Web 应用架构、现代化前端工程与高性能后端服务。追求极致代码美学与轻量级玻璃拟态交互体验。",
  avatar: "/images/avatar.png",
  status: {
    state: "available",
    label: "Available for new projects & collaborations",
  },
  focus: ["Next.js 15 App Router", "TypeScript Type Gymnastics", "Rust Systems", "Micro-Interactions"],
  metrics: [
    {
      label: "Curated Snippets",
      value: "48+",
      description: "跨端经过生产验证的代码实现",
      trend: "+12 this month",
    },
    {
      label: "Open Source Stars",
      value: "3.2k",
      description: "GitHub 累计 Star 认可与赞助",
      trend: "Top 5% dev",
    },
    {
      label: "Production Deployments",
      value: "99.98%",
      description: "高可用架构与自动化发布",
      trend: "Stable",
    },
    {
      label: "Years Crafting",
      value: "6+ Yrs",
      description: "深耕现代 Web 全栈技术演化",
      trend: "Continuous learning",
    },
  ],
  socials: [
    { name: "GitHub", href: "https://github.com", icon: "Github" },
    { name: "Twitter", href: "https://twitter.com", icon: "Twitter" },
    { name: "Email", href: "mailto:developer@example.com", icon: "Mail" },
  ],
};
