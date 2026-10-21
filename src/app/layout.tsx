import type { Metadata } from "next";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { profileData } from "@/data/profile";
import "./globals.css";

export const metadata: Metadata = {
  title: `${profileData.name} 的代码手记 | 工程实践与界面实验`,
  description: `${profileData.name} 的个人开发者主页：记录工程实践与界面实验。`,
  keywords: [
    "Developer Portfolio",
    "Next.js 15",
    "Tailwind CSS",
    "React 19",
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
