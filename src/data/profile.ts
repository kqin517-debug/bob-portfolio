export interface ProfileData {
  name: string;
  role: string;
  shortRole: string;
  greeting: string;
  bio: string;
  avatar: string;
  status: {
    state: "available" | "busy" | "focused";
    label: string;
  };
  focus: string[];
  links: {
    email: string;
    github: string;
    twitter: string;
  };
}

// 占位个人资料：内容真实化阶段统一替换姓名、简介、状态与链接。
export const profileData: ProfileData = {
  name: "Mike Chen",
  role: "Full-Stack Architect & Open Source Crafter",
  shortRole: "Full-Stack Crafter",
  greeting: "Hello & Welcome",
  bio: "专注高质感 Web 应用架构、现代化前端工程与高性能后端服务。追求极致代码美学与轻量级玻璃拟态交互体验。",
  avatar: "/images/avatar.png",
  status: {
    state: "available",
    label: "Available for new projects & collaborations",
  },
  focus: ["Next.js 15 App Router", "TypeScript Type Gymnastics", "Rust Systems", "Micro-Interactions"],
  links: {
    email: "developer@example.com",
    github: "https://github.com",
    twitter: "https://twitter.com",
  },
};
