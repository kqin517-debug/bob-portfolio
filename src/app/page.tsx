"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { HeaderToolbar } from "@/components/layout/HeaderToolbar";
import { HeroCockpit } from "@/components/home/HeroCockpit";
import { FeaturedSnippets } from "@/components/home/FeaturedSnippets";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { TechStackGrid } from "@/components/home/TechStackGrid";
import { SearchCommandModal } from "@/components/home/SearchCommandModal";
import { ArrowUp } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { profileData } from "@/data/profile";
import { featuredSnippets } from "@/data/snippets";
import { featuredProjects } from "@/data/projects";
import { useCopyEmail } from "@/lib/useCopyEmail";

const SECTION_IDS = [
  "overview",
  "snippets",
  ...(featuredProjects.length > 0 ? ["projects"] : []),
  "tech-stack",
];

export default function HomePage() {
  const { copied, copyEmail } = useCopyEmail(profileData.links.email);
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
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      element.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    }
  }, []);

  const scrollToTop = useCallback(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
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

        // Match the observer band (-80px top, -55% bottom) so a section
        // peeking in from below cannot steal the highlight at page top.
        const bandTop = 80;
        const bandBottom = window.innerHeight * 0.45;
        const overlap = (element: Element) => {
          const rect = element.getBoundingClientRect();
          return Math.max(
            0,
            Math.min(rect.bottom, bandBottom) - Math.max(rect.top, bandTop)
          );
        };
        const mostVisible = Array.from(visible).reduce((a, b) =>
          overlap(a) >= overlap(b) ? a : b
        );
        setActiveSection(mostVisible.id);
      },
      {
        rootMargin: "-80px 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
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
    <div className="flex min-h-screen">
      <Sidebar
        activeSection={activeSection}
        onNavigateSection={scrollToSection}
        onOpenSearch={openSearch}
        isMobileOpen={isMobileNavOpen}
        setIsMobileOpen={setIsMobileNavOpen}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 p-4 transition-all sm:p-6 lg:p-8 lg:pl-80">
        <HeaderToolbar
          onOpenMobileMenu={() => setIsMobileNavOpen(true)}
          onOpenSearch={openSearch}
          activeSectionTitle={activeSection}
        />

        <div className="space-y-16 sm:space-y-20">
          <HeroCockpit onNavigateSnippets={() => scrollToSection("snippets")} />

          <FeaturedSnippets
            selectedSnippetId={selectedSnippetId}
            onSelectedSnippetChange={setSelectedSnippetId}
            selectionNonce={snippetSelectionNonce}
          />

          {featuredProjects.length > 0 && <FeaturedProjects />}

          <TechStackGrid />

          <footer className="border-t border-white/[0.06] pb-10 pt-6">
            <div className="flex flex-col gap-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
              <p>
                © 2026 {profileData.name} · 用 Next.js 15 与 Tailwind CSS 构建
              </p>

              <div className="flex items-center gap-5">
                {profileData.links.github && (
                  <a
                    href={profileData.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-slate-200"
                  >
                    <GithubIcon className="h-3.5 w-3.5" />
                    GitHub
                  </a>
                )}

                <button
                  type="button"
                  onClick={copyEmail}
                  title={
                    copied
                      ? "邮箱已复制"
                      : `复制邮箱 ${profileData.links.email}`
                  }
                  className="transition-colors hover:text-slate-200"
                >
                  {copied ? "邮箱已复制" : "邮箱"}
                </button>

                <button
                  onClick={scrollToTop}
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-slate-200"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                  回到顶部
                </button>
              </div>
            </div>
          </footer>
        </div>

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
