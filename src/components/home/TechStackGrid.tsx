"use client";

import React from "react";
import { Cpu, Layers, Server, Terminal } from "lucide-react";

export function TechStackGrid() {
  const stackCategories = [
    {
      title: "Frontend Engineering & UI",
      icon: Layers,
      accent: "#3865FF",
      skills: [
        { name: "React 19 & Next.js 15", note: "App Router / Server Actions / SSG" },
        { name: "TypeScript", note: "Advanced Type Gym & Generics" },
        { name: "Tailwind CSS & CSS Tokens", note: "Design Systems & Glassmorphism" },
        { name: "Framer Motion & WebGL", note: "Fluid Micro-Interactions" },
      ],
    },
    {
      title: "Backend Architecture & Systems",
      icon: Server,
      accent: "#21FF6B",
      skills: [
        { name: "Node.js & Bun", note: "High-Throughput Microservices" },
        { name: "Rust", note: "Wasm & High-Performance CLI Tools" },
        { name: "PostgreSQL & Prisma", note: "Schema Design & Index Optimization" },
        { name: "Redis & KV Caches", note: "Distributed State & PubSub" },
      ],
    },
    {
      title: "DevOps & Modern Toolchain",
      icon: Terminal,
      accent: "#FF4C24",
      skills: [
        { name: "Docker & Containerization", note: "Multi-Stage Lightweight Builds" },
        { name: "GitHub Actions CI/CD", note: "Automated Test & Pages Deploy" },
        { name: "Cloudflare Workers & Edge", note: "Serverless Global Routing" },
        { name: "Vite, Turbopack, Shiki", note: "Sub-Second Build & Highlighting" },
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
