import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { profileData } from "@/data/profile";

type ModuleKey = "papers" | "coursework";

const MODULES: { key: ModuleKey; label: string; shortLabel: string; href: string }[] = [
  { key: "papers", label: "论文索引", shortLabel: "论文", href: "/papers/" },
  {
    key: "coursework",
    label: "课程作业索引",
    shortLabel: "课程作业",
    href: "/coursework/",
  },
];

export function ModuleShell({
  active,
  children,
}: {
  active: ModuleKey;
  children: React.ReactNode;
}) {
  const activeModule = MODULES.find((module) => module.key === active);

  return (
    <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
      <header className="toolbar-surface sticky top-4 z-30 mb-8 flex h-12 items-center justify-between gap-3 rounded-2xl px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-xs text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white"
            title="返回首页"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">首页</span>
          </Link>
          <span className="font-mono text-xs text-slate-600">/</span>
          <span className="truncate text-xs font-medium text-slate-300">
            {activeModule?.label}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <nav aria-label="内容索引" className="flex items-center gap-0.5">
            {MODULES.map((module) => (
              <Link
                key={module.key}
                href={module.href}
                aria-current={module.key === active ? "page" : undefined}
                className={`rounded-lg px-2 py-1.5 text-[11px] transition-colors sm:px-2.5 sm:text-xs ${
                  module.key === active
                    ? "bg-accent/15 font-medium text-accent"
                    : "text-slate-400 hover:bg-white/[0.06] hover:text-slate-100"
                }`}
              >
                <span className="sm:hidden">{module.shortLabel}</span>
                <span className="hidden sm:inline">
                  {module.key === "papers" ? "论文" : "课程作业"}
                </span>
              </Link>
            ))}
          </nav>

          <div className="mx-1 hidden h-4 w-px bg-white/[0.08] sm:block" />
          <ThemeToggle />

          {profileData.links.github && (
            <a
              href={profileData.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white"
              title="GitHub"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
          )}
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-16 flex flex-col gap-3 border-t border-white/[0.06] pb-4 pt-6 text-[11px] text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 {profileData.name} · 论文与课程作业索引</p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 transition-colors hover:text-slate-200"
        >
          返回学习手记
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </footer>
    </div>
  );
}
