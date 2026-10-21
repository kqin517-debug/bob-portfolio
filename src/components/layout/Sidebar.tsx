"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  FolderGit2,
  Mail,
  Settings,
  ArrowUpRight,
  X,
  Copy,
  Check,
  type LucideIcon,
} from "lucide-react";
import { profileData } from "@/data/profile";
import { useCopyEmail } from "@/lib/useCopyEmail";
import { featuredProjects } from "@/data/projects";
import { assetPath } from "@/lib/utils";
import { GithubIcon } from "@/components/ui/Icons";
import { AssignmentChecklist } from "@/components/layout/AssignmentChecklist";

interface SidebarProps {
  activeSection: string;
  onNavigateSection: (sec: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

type Theme = "dark" | "light";

export function Sidebar({
  activeSection,
  onNavigateSection,
  isMobileOpen,
  setIsMobileOpen,
}: SidebarProps) {
  const { copied, copyEmail } = useCopyEmail(profileData.links.email);
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(
      document.documentElement.classList.contains("light") ? "light" : "dark"
    );
  }, []);

  const applyTheme = (next: Theme) => {
    const root = document.documentElement;

    root.classList.toggle("light", next === "light");
    root.classList.toggle("dark", next === "dark");

    try {
      window.localStorage.setItem("bob-theme", next);
    } catch {
      // 隐私模式下无法持久化时，本次会话内仍然可以切换。
    }

    setTheme(next);
  };

  useEffect(() => {
    if (!isMobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !event.isComposing) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileOpen, setIsMobileOpen]);

  const navigateToSection = (sectionId: string) => {
    onNavigateSection(sectionId);
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  const navItems: NavItem[] = [
    { id: "overview", label: "概览", icon: LayoutDashboard },
    ...(featuredProjects.length > 0
      ? [{ id: "projects", label: "项目", icon: FolderGit2 }]
      : []),
    { id: "contact", label: "联系", icon: Mail },
  ];

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md lg:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="侧边栏"
        className={`glass-panel fixed bottom-4 left-4 top-4 z-50 flex w-72 flex-col rounded-3xl transition-transform duration-300 ease-out lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 pb-4 pt-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative shrink-0">
              <div className="h-12 w-12 overflow-hidden rounded-full border border-white/10">
                <Image
                  src={assetPath(profileData.avatar)}
                  alt={profileData.name}
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              </div>
              {profileData.status && (
                <span
                  className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0b0e16] bg-emerald-400"
                  title={profileData.status.label}
                />
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {profileData.name}
              </p>
              <p className="truncate text-[11px] text-slate-400">
                {profileData.shortRole}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsMobileOpen(false)}
            aria-label="关闭导航"
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-white/[0.06] hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-1">
          <nav aria-label="页面导航" className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => navigateToSection(item.id)}
                  aria-current={isActive ? "location" : undefined}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "glass-menu-active font-medium"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 ${
                        isActive ? "text-accent" : "text-muted"
                      }`}
                    />
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="mt-1 space-y-1">
            <button
              type="button"
              onClick={copyEmail}
              title={
                copied
                  ? "邮箱已复制"
                  : `复制邮箱 ${profileData.links.email}`
              }
              aria-label={copied ? "邮箱已复制" : "复制邮箱地址"}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-slate-100"
            >
              <span className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted" />
                {copied ? "邮箱已复制" : "邮箱"}
              </span>
              {copied ? (
                <Check className="h-3.5 w-3.5 text-accent" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-muted" />
              )}
            </button>

            <div className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm text-slate-400">
              <span className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-muted" />
                设置
              </span>
              <span
                className="flex items-center gap-0.5"
                role="group"
                aria-label="外观"
              >
                <button
                  type="button"
                  onClick={() => applyTheme("dark")}
                  aria-pressed={theme === "dark"}
                  title="深色模式"
                  className={`rounded-md px-1.5 py-0.5 text-[11px] transition-colors ${
                    theme === "dark"
                      ? "bg-accent/15 font-medium text-accent"
                      : "text-muted hover:bg-white/[0.04] hover:text-slate-200"
                  }`}
                >
                  深色
                </button>
                <button
                  type="button"
                  onClick={() => applyTheme("light")}
                  aria-pressed={theme === "light"}
                  title="浅色模式"
                  className={`rounded-md px-1.5 py-0.5 text-[11px] transition-colors ${
                    theme === "light"
                      ? "bg-accent/15 font-medium text-accent"
                      : "text-muted hover:bg-white/[0.04] hover:text-slate-200"
                  }`}
                >
                  浅色
                </button>
              </span>
            </div>
          </div>

          <AssignmentChecklist />
        </div>

        <div className="space-y-1 border-t border-white/[0.06] p-4">
          {profileData.links.github && (
            <a
              href={profileData.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl px-3 py-2 text-xs text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-slate-100"
            >
              <span className="flex items-center gap-2.5">
                <GithubIcon className="h-4 w-4 text-muted" />
                GitHub
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted" />
            </a>
          )}
        </div>
      </aside>
    </>
  );
}
