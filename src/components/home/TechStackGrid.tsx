"use client";

import React from "react";
import { Cpu, Layers, Terminal } from "lucide-react";

export function TechStackGrid() {
  const stackCategories = [
    {
      title: "Framework & Language",
      icon: Layers,
      accent: "#3865FF",
      skills: [
        { name: "Next.js 15", note: "App Router / 静态导出" },
        { name: "React 19", note: "Client Components / Hooks" },
        { name: "TypeScript 5", note: "严格类型检查" },
        { name: "Tailwind CSS 3", note: "原子化样式与设计令牌" },
      ],
    },
    {
      title: "UI & Interaction",
      icon: Cpu,
      accent: "#00E5FF",
      skills: [
        { name: "Glassmorphism CSS", note: "backdrop-filter / 内阴影高光" },
        { name: "Lucide React", note: "图标系统" },
        { name: "IntersectionObserver", note: "滚动高亮导航" },
        { name: "Clipboard API", note: "一键复制代码" },
      ],
    },
    {
      title: "Delivery",
      icon: Terminal,
      accent: "#21FF6B",
      skills: [
        { name: "GitHub Actions", note: "推送 main 自动构建" },
        { name: "GitHub Pages", note: "静态托管" },
        { name: "Static Export", note: "next build → out/" },
        { name: "No Third-Party Analytics", note: "无追踪脚本" },
      ],
    },
  ];

  return (
    <section id="tech-stack" className="space-y-5 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>BUILT WITH</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            本站技术栈 (Tech Stack)
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md">
          这个页面实际使用的框架、样式与部署工具，均可在源码与 package.json 中核对。
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stackCategories.map((category) => {
          const Icon = category.icon;
          return (
            <div
              key={category.title}
              className="p-6 rounded-3xl glass-panel glass-panel-hover border border-white/10"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-white/[0.08]">
                  <div
                    className="p-2 rounded-xl bg-white/[0.04] border border-white/10"
                    style={{ color: category.accent }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-white text-sm">
                    {category.title}
                  </h3>
                </div>

                <div className="space-y-3.5">
                  {category.skills.map((skill) => (
                    <div key={skill.name} className="space-y-1">
                      <p className="text-xs font-medium text-slate-200">
                        {skill.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {skill.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
