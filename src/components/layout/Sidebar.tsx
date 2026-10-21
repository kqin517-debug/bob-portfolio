"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  Code2,
  FolderGit2,
  Cpu,
  Mail,
  Search,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  X,
} from "lucide-react";
import { profileData } from "@/data/profile";
import { featuredSnippets } from "@/data/snippets";
import { featuredProjects } from "@/data/projects";
import { assetPath } from "@/lib/utils";
import { ShortcutHint } from "@/components/ui/ShortcutHint";
import type { LucideIcon } from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onNavigateSection: (sec: string) => void;
  onOpenSearch: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string | null;
  badgeColor?: string;
  /** True when no route or on-page anchor exists yet (rendered as "coming soon"). */
  disabled?: boolean;
  /** Tooltip explaining why the item cannot be clicked / where it leads. */
  title?: string;
  isDropdown?: boolean;
  subItems?: { id: string; name: string; color: string }[];
}

export function Sidebar({
  activeSection,
  onNavigateSection,
  onOpenSearch,
  isMobileOpen,
  setIsMobileOpen,
}: SidebarProps) {
  const [projectsExpanded, setProjectsExpanded] = useState(true);

  /**
   * `onNavigateSection` is wired to `scrollToSection` in src/app/page.tsx and
   * only scrolls. The active highlight itself is owned by the scroll-spy
   * observer, so every target must be an id that really exists in the page.
   * The mobile drawer is closed here so the scroll is visible on small screens.
   */
  const navigateToSection = (sectionId: string) => {
    onNavigateSection(sectionId);
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  const navItems: NavItem[] = [
    {
      id: "overview",
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "snippets",
      label: "Snippets Hub",
      icon: Code2,
      // Derived from the real data source instead of a hardcoded "48".
      badge: String(featuredSnippets.length),
      badgeColor: "bg-gradient-to-b from-[#ff5126] to-[#dd1600]",
    },
    ...(featuredProjects.length > 0
      ? [
          {
            id: "projects",
            label: "Projects",
            icon: FolderGit2,
            isDropdown: true,
            subItems: featuredProjects.map((project) => ({
              id: project.id,
              name: project.name,
              color: project.dotColor,
            })),
          },
        ]
      : []),
    {
      id: "tech-stack",
      label: "Tech Stack",
      icon: Cpu,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Glass Sidebar Container */}
      <aside
        className={`fixed top-4 bottom-4 left-4 z-50 w-72 flex-col rounded-3xl glass-panel transition-all duration-300 ease-out flex ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Figma _toolbar: Traffic lights & Mode switch */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 traffic-dot bg-[#FF5F56] shadow-[0_0_8px_rgba(255,95,86,0.6)] cursor-pointer" />
            <span className="w-3 h-3 traffic-dot bg-[#FFBD2E] shadow-[0_0_8px_rgba(255,189,46,0.6)] cursor-pointer" />
            <span className="w-3 h-3 traffic-dot bg-[#27C93F] shadow-[0_0_8px_rgba(39,201,63,0.6)] cursor-pointer" />
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close navigation menu"
              className="lg:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Profile Card Header matching Figma _profile */}
        <div className="px-5 py-4 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            {/* Avatar with Figma-style multi-layer glow ring */}
            <div className="relative group">
              {/* 52px = inner w-12 (48px) + 2px padding on each side, so the
                  gradient ring keeps its exact former 2px thickness. */}
              <div className="w-[52px] h-[52px] rounded-full p-[2px] bg-gradient-to-tr from-blue-500/60 via-purple-500/40 to-white/40 shadow-glass-sm">
                <div className="w-12 h-12 rounded-full overflow-hidden relative bg-slate-900 border border-white/20">
                  <Image
                    src={assetPath(profileData.avatar)}
                    alt={profileData.name}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              {profileData.status && (
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#21FF6B] border-2 border-[#0e1322] shadow-glow-emerald animate-pulse"
                  title={profileData.status.label}
                />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium tracking-wider text-blue-300/80 uppercase">
                {profileData.greeting}
              </p>
              <h2 className="text-base font-bold text-white truncate tracking-tight">
                {profileData.name}
              </h2>
              {profileData.shortRole && (
                <p
                  className="text-[11px] text-slate-400 truncate"
                  title={profileData.role}
                >
                  {profileData.shortRole}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Search Bar matching Figma _search */}
        <div className="px-4 py-3">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/15 hover:border-white/25 text-slate-300 hover:text-white transition-all text-xs group backdrop-blur-sm"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
              <span>Search code, tools...</span>
            </div>
            <ShortcutHint className="px-1.5 py-0.5 text-[10px] font-mono bg-white/10 border border-white/15 rounded text-slate-300" />
          </button>
        </div>

        {/* Navigation Menu List matching Figma _cell */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            if (item.disabled) {
              return (
                // The wrapper carries the tooltip because browsers do not
                // reliably surface `title` (nor hover styles) on a natively
                // disabled button.
                <div
                  key={item.id}
                  title={item.title}
                  className="cursor-not-allowed"
                >
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500/80 opacity-60 select-none cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-slate-500/80" />
                      <span>{item.label}</span>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-white/[0.06] border border-white/10 rounded-md">
                      {item.badge || "Soon"}
                    </span>
                  </button>
                </div>
              );
            }

            if (item.isDropdown) {
              return (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={() => {
                      navigateToSection(item.id);
                      setProjectsExpanded(!projectsExpanded);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "glass-menu-active text-white"
                        : "text-slate-300 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                        projectsExpanded ? "rotate-90" : ""
                      }`}
                    />
                  </button>

                  {/* Sub-projects list with colored dots from Figma */}
                  {projectsExpanded && (
                    <div className="pl-9 pr-2 space-y-1 py-1">
                      {item.subItems?.map((sub) => (
                        <button
                          key={sub.id}
                          type="button"
                          title={`跳转到 Projects 区域：#projects（${sub.name}）`}
                          onClick={() => navigateToSection("projects")}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all group"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2 h-2 rounded-full shadow-sm"
                              style={{ backgroundColor: sub.color }}
                            />
                            <span>{sub.name}</span>
                          </div>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => navigateToSection(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "glass-menu-active text-white font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-blue-400" : "text-slate-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold text-white rounded-md shadow-sm ${
                      item.badgeColor || "bg-white/10 text-slate-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 pb-1">
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          <a
            href={`mailto:${profileData.links.email}`}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all"
          >
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>Contact Me</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
          </a>
        </nav>

        {profileData.links.github && (
          <div className="p-4 border-t border-white/[0.08]">
            <a
              href={profileData.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-between p-3 rounded-2xl overflow-hidden glass-cta-button transition-all duration-300 hover:scale-[1.02] hover:shadow-glow"
            >
              {/* Glow sweep effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-indigo-500/20 to-purple-600/30 opacity-80 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10 flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-blue-500/30 border border-blue-400/40 text-blue-200">
                  <Sparkles className="w-4 h-4 text-blue-200 animate-spin-slow" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-white tracking-tight">
                    GitHub Profile
                  </p>
                  <p className="text-[10px] text-blue-200/80">Connect &amp; Explore</p>
                </div>
              </div>

              <div className="relative z-10 w-7 h-7 rounded-full bg-white/10 border border-white/25 flex items-center justify-center text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </a>
          </div>
        )}
      </aside>
    </>
  );
}
