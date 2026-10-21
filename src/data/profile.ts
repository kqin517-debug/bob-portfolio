export interface ProfileData {
  name: string;
  role?: string;
  shortRole?: string;
  greeting: string;
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
  greeting: "Hello & Welcome",
  avatar: "/images/avatar.jpg",
  links: {
    email: "kqin517@gmail.com",
    github: "https://github.com/kqin517-debug",
  },
};
