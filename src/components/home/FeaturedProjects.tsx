"use client";

import { ExternalLink, Star, ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { featuredProjects } from "@/data/projects";
import { profileData } from "@/data/profile";

export function FeaturedProjects() {
  return (
    <section id="projects" className="scroll-mt-24 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="mb-2 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            <span className="h-px w-8 bg-accent/50" />
            Code
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            代码项目
          </h2>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <p className="max-w-sm text-xs leading-relaxed text-slate-400 sm:text-right">
            课程项目、实验代码与公开作品，包含技术栈与源码入口。
          </p>
          {profileData.links.github && (
            <a
              href={profileData.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-accent transition-colors hover:text-white"
            >
              更多代码
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {featuredProjects.map((project) => {
          const hasLinks = Boolean(project.demoUrl || project.githubUrl);
          const hasBottomRow = Boolean(
            project.metrics || project.demoUrl || project.githubUrl
          );

          return (
            <div
              key={project.id}
              className="group relative flex flex-col justify-between p-6 rounded-3xl glass-panel glass-panel-hover border border-white/10"
            >
              {/* Top ambient highlight on hover */}
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="space-y-4">
                {/* Category & Stars */}
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-medium text-slate-300">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: project.dotColor }}
                    />
                    <span>{project.category}</span>
                  </div>

                  {project.stars && (
                    <div className="flex items-center gap-1 text-xs font-mono text-amber-300/90 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                      <span>{project.stars}</span>
                    </div>
                  )}
                </div>

                {/* Title & Tagline */}
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-accent flex items-center justify-between">
                    <span>{project.name}</span>
                    {hasLinks && (
                      <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-white transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    )}
                  </h3>
                  <p className="text-xs font-medium text-accent">
                    {project.tagline}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-[11px] font-mono rounded-md bg-white/[0.03] text-slate-300 border border-white/[0.06]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions & Metrics */}
              {hasBottomRow && (
                <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs">
                  {project.metrics ? (
                    <span className="font-mono text-slate-300 text-[11px]">
                      {project.metrics}
                    </span>
                  ) : (
                    <span />
                  )}

                  <div className="flex items-center gap-2">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] text-slate-300 hover:text-white border border-white/10 transition-all"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] text-slate-300 hover:text-white border border-white/10 transition-all"
                        title="Source Code"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
