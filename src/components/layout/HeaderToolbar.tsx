"use client";

import React from "react";
import {
  Menu,
  Search,
  Bell,
  Mail,
  Sparkles,
  Command,
} from "lucide-react";
import { GithubIcon, TwitterIcon } from "@/components/ui/Icons";

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
          <span className="font-semibold text-slate-200 capitalize">
            {activeSectionTitle}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
            Live
          </span>
        </div>
      </div>

      {/* Right: Actions, Search pill & Socials */}
      <div className="flex items-center gap-3">
        {/* Fast Search Trigger */}
        <button
          onClick={onOpenSearch}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-slate-300 hover:text-white hover:border-white/25 transition-all text-xs backdrop-blur-sm"
        >
          <Search className="w-3.5 h-3.5 text-blue-400" />
          <span>Quick Find</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-slate-300">
            ⌘K
          </kbd>
        </button>

        <div className="h-4 w-px bg-white/10 hidden sm:block" />

        {/* Social Icons with Glass Hover */}
        <div className="flex items-center gap-1.5">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all"
            title="GitHub"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all"
            title="Twitter"
          >
            <TwitterIcon className="w-4 h-4" />
          </a>
          <a
            href="mailto:developer@example.com"
            className="p-2 rounded-xl bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all"
            title="Email"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>

        {/* Notification bell with orange pill badge from Figma */}
        <div className="relative">
          <button
            className="p-2 rounded-xl bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white transition-all relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-mono font-bold text-white bg-gradient-to-b from-[#ff5126] to-[#dd1600] border border-white/30 shadow-glow-orange">
              3
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
