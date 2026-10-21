export interface ProfileData {
  name: string;
  shortRole?: string;
  tagline: string;
  avatar: string;
  status?: {
    label: string;
  };
  links: {
    email: string;
    github?: string;
    twitter?: string;
  };
}

// 未提供的字段保持缺省，对应 UI 自动隐藏，避免展示虚构信息。
export const profileData: ProfileData = {
  name: "Bob",
  shortRole: "Developer",
  tagline: "记录工程实践与界面实验。",
  avatar: "/images/avatar.png",
  links: {
    email: "kqin517@gmail.com",
    github: "https://github.com/kqin517-debug",
  },
};
