import type { Metadata } from "next";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { profileData } from "@/data/profile";
import "./globals.css";

export const metadata: Metadata = {
  title: `${profileData.name} | Developer Code Portfolio & Glassmorphism Hub`,
  description:
    "高质感个人开发者代码分享主页。集成高质量代码片段库 (Snippets Hub)、代表开源项目与现代 Web 工程架构沉淀。",
  keywords: [
    "Developer Portfolio",
    "Code Snippets",
    "Glassmorphism",
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
      <body className="min-h-screen bg-[#080a11] text-slate-100 antialiased selection:bg-blue-500/30 selection:text-blue-200">
        {/* Dynamic & Interactive Luminous Background */}
        <AmbientBackground />

        {/* Content Shell */}
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
