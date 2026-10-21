"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { HeaderToolbar } from "@/components/layout/HeaderToolbar";
import { HeroCockpit } from "@/components/home/HeroCockpit";
import { FeaturedSnippets } from "@/components/home/FeaturedSnippets";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { TechStackGrid } from "@/components/home/TechStackGrid";
import { SearchCommandModal } from "@/components/home/SearchCommandModal";
import { Code2, ArrowUp } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { profileData } from "@/data/profile";
import { featuredSnippets } from "@/data/snippets";

const SECTION_IDS = ["overview", "snippets", "projects", "tech-stack"] as const;

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [selectedSnippetId, setSelectedSnippetId] = useState(
    featuredSnippets[0].id
  );
  const [snippetSelectionNonce, setSnippetSelectionNonce] = useState(0);
  const [pendingScrollTarget, setPendingScrollTarget] = useState<string | null>(
    null
  );

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const openSearch = useCallback(() => {
    setIsMobileNavOpen(false);
    setIsSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => setIsSearchOpen(false), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openSearch]);

  useEffect(() => {
    const sections = SECTION_IDS.map((id) =>
      document.getElementById(id)
    ).filter((el): el is HTMLElement => el !== null);

    const visible = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visible.add(entry.target);
          } else {
            visible.delete(entry.target);
          }
        });

        if (visible.size === 0) return;

        const topMost = Array.from(visible).reduce((a, b) =>
          a.getBoundingClientRect().top <= b.getBoundingClientRect().top ? a : b
        );
        setActiveSection(topMost.id);
      },
      { rootMargin: "-80px 0px -55% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // The modal restores body scroll in its effect cleanup, so scrolling must
  // wait until after that cleanup; scrollIntoView is dropped while locked.
  useEffect(() => {
    if (!pendingScrollTarget) return;
    scrollToSection(pendingScrollTarget);
    setPendingScrollTarget(null);
  }, [pendingScrollTarget, scrollToSection]);

  const handleSelectSnippet = (id: string) => {
    setSelectedSnippetId(id);
    setSnippetSelectionNonce((nonce) => nonce + 1);
    setPendingScrollTarget("snippets");
  };

  const handleSelectProject = () => {
    setPendingScrollTarget("projects");
  };

  return (
    <div className="min-h-screen flex text-slate-100">
      {/* Figma-Inspired Glass Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onNavigateSection={scrollToSection}
        onOpenSearch={openSearch}
        isMobileOpen={isMobileNavOpen}
        setIsMobileOpen={setIsMobileNavOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-80 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full transition-all">
        {/* Top Header Bar */}
        <HeaderToolbar
          onOpenMobileMenu={() => setIsMobileNavOpen(true)}
          onOpenSearch={openSearch}
          activeSectionTitle={activeSection}
        />

        {/* Dynamic Sections */}
        <div className="space-y-12">
          {/* Section 1: Hero Cockpit & Profile Overview */}
          <HeroCockpit
            onNavigateSnippets={() => scrollToSection("snippets")}
            onNavigateProjects={() => scrollToSection("projects")}
          />

          {/* Section 2: Featured Code Snippets Showcase */}
          <FeaturedSnippets
            selectedSnippetId={selectedSnippetId}
            onSelectedSnippetChange={setSelectedSnippetId}
            selectionNonce={snippetSelectionNonce}
          />

          {/* Section 3: Featured Open Source Projects */}
          <FeaturedProjects />

          {/* Section 4: Tech Stack Arsenal */}
          <TechStackGrid />

          {/* Footer with Glass Pill Aesthetic */}
          <footer className="mt-16 pt-8 pb-10 border-t border-white/[0.08] text-xs text-slate-400">
            <div className="rounded-2xl glass-panel-subtle p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-blue-500/20 text-blue-400">
                  <Code2 className="w-4 h-4" />
                </span>
                <span className="font-semibold text-slate-200">
                  {profileData.name} Code Portfolio
                </span>
                <span className="text-slate-600">/</span>
                <span className="font-mono text-[11px] text-slate-400">
                  Glassmorphism UI Kit Edition
                </span>
              </div>

              <div className="flex items-center gap-4 text-[11px]">
                <a
                  href={profileData.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
                <span className="text-slate-600">·</span>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>Back to Top</span>
                </button>
              </div>
            </div>

            <p className="text-center text-slate-500 text-[11px] mt-4 font-mono">
              Designed with Figma Glassmorphism UI Kit · Built with Next.js 15, React 19 &amp; Tailwind CSS
            </p>
          </footer>
        </div>

        {/* Global Search Command Modal (Ctrl/⌘K) */}
        <SearchCommandModal
          isOpen={isSearchOpen}
          onClose={closeSearch}
          onSelectSnippet={handleSelectSnippet}
          onSelectProject={handleSelectProject}
        />
      </main>
    </div>
  );
}
