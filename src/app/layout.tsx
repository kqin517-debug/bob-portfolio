import type { Metadata } from "next";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { profileData } from "@/data/profile";
import "./globals.css";

export const metadata: Metadata = {
  title: `${profileData.name} 的代码手记 | 代码片段与前端实验`,
  description:
    "Bob 的个人开发者主页：收录前端代码片段、工程实践与界面实验。",
  keywords: [
    "Developer Portfolio",
    "Code Snippets",
    "Next.js 15",
    "Tailwind CSS",
    "React 19",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark scroll-smooth">
      <body className="min-h-screen bg-ink text-[#e7eaf2] antialiased selection:bg-accent/30 selection:text-white">
        <AmbientBackground />

        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
