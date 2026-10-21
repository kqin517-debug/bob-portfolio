"use client";

import React from "react";
import { Menu, Search, Mail } from "lucide-react";
import { GithubIcon, TwitterIcon } from "@/components/ui/Icons";
import { profileData } from "@/data/profile";
import { ShortcutHint } from "@/components/ui/ShortcutHint";

const SECTION_LABELS: Record<string, string> = {
  overview: "Overview",
  snippets: "Snippets",
  projects: "Projects",
  "tech-stack": "Tech Stack",
};

interface HeaderToolbarProps {
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
  activeSectionTitle: string;
}

export function HeaderToolbar({
  onOpenMobileMenu,
  onOpenSearch,
  activeSectionTitle,
}: HeaderToolbarProps) {
  return (
    <header className="sticky top-4 z-30 mb-6 flex items-center justify-between px-5 py-3 rounded-2xl glass-panel-subtle shadow-glass-sm">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-xl bg-white/[0.04] border border-white/10 lg:hidden text-slate-300 hover:text-white"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono text-slate-500">workspace /</span>
          <span className="font-semibold text-slate-200">
            {SECTION_LABELS[activeSectionTitle] ?? activeSectionTitle}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">
            Static
          </span>
        </div>
      </div>

      {/* Right: Actions, Search pill & Socials */}
      <div className="flex items-center gap-3">
        {/* Fast Search Trigger */}
        <button
          onClick={onOpenSearch}
          aria-haspopup="dialog"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-slate-300 hover:text-white hover:border-white/25 transition-all text-xs backdrop-blur-sm"
        >
          <Search className="w-3.5 h-3.5 text-blue-400" />
          <span>Quick Find</span>
          <ShortcutHint className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-slate-300" />
        </button>

        <div className="h-4 w-px bg-white/10 hidden sm:block" />

        {/* Social Icons with Glass Hover */}
        <div className="flex items-center gap-1.5">
          {profileData.links.github && (
            <a
              href={profileData.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all"
              title="GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          )}
          {profileData.links.twitter && (
            <a
              href={profileData.links.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all"
              title="Twitter"
            >
              <TwitterIcon className="w-4 h-4" />
            </a>
          )}
          <a
            href={`mailto:${profileData.links.email}`}
            className="p-2 rounded-xl bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all"
            title="Email"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
