export interface ProfileData {
  name: string;
  role?: string;
  shortRole?: string;
  tagline: string;
  bio?: string;
  avatar: string;
  status?: {
    state: "available" | "busy" | "focused";
    label: string;
  };
  focus?: string[];
  links: {
    email: string;
    github?: string;
    twitter?: string;
  };
}

// 未提供的字段保持缺省，对应 UI 自动隐藏，避免展示虚构信息。
export const profileData: ProfileData = {
  name: "Bob",
  role: "Developer",
  shortRole: "Developer",
  tagline: "收集前端代码片段、工程实践与界面实验。",
  avatar: "/images/avatar.png",
  links: {
    email: "kqin517@gmail.com",
    github: "https://github.com/kqin517-debug",
  },
};
