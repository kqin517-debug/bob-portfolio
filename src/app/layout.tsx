import type { Metadata } from "next";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { profileData } from "@/data/profile";
import "./globals.css";

export const metadata: Metadata = {
  title: `${profileData.name} 的学习手记 | 论文、代码与课程作业`,
  description: `${profileData.name} 的学习主页：分享课程论文、代码项目与课程作业。`,
  keywords: [
    "论文分享",
    "课程作业",
    "代码项目",
    "Next.js 15",
    "Tailwind CSS",
  ],
};

const themeInitScript = `(function(){try{var t=localStorage.getItem("bob-theme");if(t==="light"){var r=document.documentElement;r.classList.remove("dark");r.classList.add("light");}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-CN"
      className="dark scroll-smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen antialiased selection:bg-accent/30 selection:text-white">
        <AmbientBackground />

        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
