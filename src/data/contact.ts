import { profileData } from "@/data/profile";

// 纯静态站点没有后端，反馈由 FormSubmit 转发到收件邮箱。
// 首次使用必须先完成一次激活（见 DEPLOYMENT.md「联系表单」）。
export const feedbackConfig = {
  endpoint: `https://formsubmit.co/ajax/${profileData.links.email}`,
  subject: `${profileData.name} 的代码手记 · 新反馈`,
};
