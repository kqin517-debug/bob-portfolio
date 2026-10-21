"use client";

import React from "react";
import { Menu, Search, Mail, Check } from "lucide-react";
import { GithubIcon, TwitterIcon } from "@/components/ui/Icons";
import { profileData } from "@/data/profile";
import { useCopyEmail } from "@/lib/useCopyEmail";

const SECTION_LABELS: Record<string, string> = {
  overview: "概览",
  snippets: "代码片段",
  projects: "项目",
  "tech-stack": "技术栈",
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
  const { copied, copyEmail } = useCopyEmail(profileData.links.email);

  return (
    <header className="toolbar-surface sticky top-4 z-30 mb-8 flex h-12 items-center justify-between rounded-2xl px-4">
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenMobileMenu}
          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white lg:hidden"
          aria-label="打开导航"
        >
          <Menu className="h-5 w-5" />
        </button>

        <span className="font-mono text-xs text-slate-600">/</span>
        <span className="text-xs font-medium text-slate-300">
          {SECTION_LABELS[activeSectionTitle] ?? activeSectionTitle}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onOpenSearch}
          aria-label="打开搜索"
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white lg:hidden"
        >
          <Search className="h-4 w-4" />
        </button>

        <div className="mx-1 hidden h-4 w-px bg-white/[0.08] sm:block" />

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

        {profileData.links.twitter && (
          <a
            href={profileData.links.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white"
            title="Twitter"
          >
            <TwitterIcon className="h-4 w-4" />
          </a>
        )}

        <button
          type="button"
          onClick={copyEmail}
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white"
          title={copied ? "邮箱已复制" : "复制邮箱地址"}
          aria-label={copied ? "邮箱已复制" : "复制邮箱地址"}
        >
          {copied ? (
            <Check className="h-4 w-4 text-accent" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
        </button>
      </div>
    </header>
  );
}
