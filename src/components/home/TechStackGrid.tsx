"use client";

import React from "react";
import { Cpu, Layers, Terminal } from "lucide-react";

export function TechStackGrid() {
  const stackCategories = [
    {
      title: "框架与语言",
      icon: Layers,
      skills: [
        { name: "Next.js 15", note: "App Router / 静态导出" },
        { name: "React 19", note: "Client Components / Hooks" },
        { name: "TypeScript 5", note: "严格类型检查" },
        { name: "Tailwind CSS 3", note: "原子化样式与设计令牌" },
      ],
    },
    {
      title: "界面与交互",
      icon: Cpu,
      skills: [
        { name: "Glassmorphism CSS", note: "backdrop-filter / 内阴影高光" },
        { name: "Lucide React", note: "图标系统" },
        { name: "IntersectionObserver", note: "滚动高亮导航" },
        { name: "Clipboard API", note: "一键复制代码" },
      ],
    },
    {
      title: "构建与部署",
      icon: Terminal,
      skills: [
        { name: "GitHub Actions", note: "推送 main 自动构建" },
        { name: "GitHub Pages", note: "静态托管" },
        { name: "Static Export", note: "next build → out/" },
        { name: "No Third-Party Analytics", note: "无追踪脚本" },
      ],
    },
  ];

  return (
    <section id="tech-stack" className="scroll-mt-24 space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            <span className="h-px w-8 bg-accent/50" />
            Colophon
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            本站如何构建
          </h2>
        </div>
        <p className="max-w-sm text-xs leading-relaxed text-slate-400 sm:text-right">
          页面实际使用的框架、样式与部署工具，均可在源码与 package.json 中核对。
        </p>
      </div>

      <div className="glass-panel-subtle rounded-2xl p-6 sm:p-8">
        <div className="grid gap-7 md:grid-cols-3 md:gap-0 md:divide-x md:divide-white/[0.06]">
          {stackCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.title}
                className="md:px-7 md:first:pl-0 md:last:pr-0"
              >
                <div className="flex items-center gap-2 text-xs font-medium text-slate-200">
                  <Icon className="h-4 w-4 text-muted" />
                  <h3>{category.title}</h3>
                </div>

                <ul className="mt-5 space-y-4">
                  {category.skills.map((skill) => (
                    <li key={skill.name} className="space-y-0.5">
                      <p className="text-[13px] text-slate-200">{skill.name}</p>
                      <p className="font-mono text-[11px] text-slate-400">
                        {skill.note}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
