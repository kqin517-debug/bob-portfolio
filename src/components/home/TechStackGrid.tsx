"use client";

import React from "react";
import { Cpu, Layers, Server, Terminal, Sparkles, CheckCircle2 } from "lucide-react";

export function TechStackGrid() {
  const stackCategories = [
    {
      title: "Frontend Engineering & UI",
      icon: Layers,
      accent: "#3865FF",
      skills: [
        { name: "React 19 & Next.js 15", level: "98%", note: "App Router / Server Actions / SSG" },
        { name: "TypeScript", level: "95%", note: "Advanced Type Gym & Generics" },
        { name: "Tailwind CSS & CSS Tokens", level: "96%", note: "Design Systems & Glassmorphism" },
        { name: "Framer Motion & WebGL", level: "85%", note: "Fluid Micro-Interactions" },
      ],
    },
    {
      title: "Backend Architecture & Systems",
      icon: Server,
      accent: "#21FF6B",
      skills: [
        { name: "Node.js & Bun", level: "92%", note: "High-Throughput Microservices" },
        { name: "Rust", level: "80%", note: "Wasm & High-Performance CLI Tools" },
        { name: "PostgreSQL & Prisma", level: "90%", note: "Schema Design & Index Optimization" },
        { name: "Redis & KV Caches", level: "88%", note: "Distributed State & PubSub" },
      ],
    },
    {
      title: "DevOps & Modern Toolchain",
      icon: Terminal,
      accent: "#FF4C24",
      skills: [
        { name: "Docker & Containerization", level: "90%", note: "Multi-Stage Lightweight Builds" },
        { name: "GitHub Actions CI/CD", level: "92%", note: "Automated Test & Pages Deploy" },
        { name: "Cloudflare Workers & Edge", level: "86%", note: "Serverless Global Routing" },
        { name: "Vite, Turbopack, Shiki", level: "94%", note: "Sub-Second Build & Highlighting" },
      ],
    },
  ];

  return (
    <section id="tech-stack" className="space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>ARSENAL &amp; CAPABILITIES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            技术栈与工程体系 (Tech Arsenal)
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md">
          深度打磨现代化全栈与系统工程体系，保障代码从本地开发到高并发上线的极致性能与稳健。
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stackCategories.map((category) => {
          const Icon = category.icon;
          return (
            <div
              key={category.title}
              className="p-6 rounded-3xl glass-panel glass-panel-hover border border-white/10 flex flex-col justify-between"
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
                    <div key={skill.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-200">
                          {skill.name}
                        </span>
                        <span className="font-mono text-[11px] text-slate-400">
                          {skill.level}
                        </span>
                      </div>

                      {/* Fluency Gauge with glowing bar */}
                      <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden p-[1px]">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: skill.level,
                            backgroundColor: category.accent,
                            boxShadow: `0 0 8px ${category.accent}80`,
                          }}
                        />
                      </div>

                      <p className="text-[10px] text-slate-400 font-mono">
                        {skill.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Production Ready
                </span>
                <span className="font-mono">Verified 2026</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
