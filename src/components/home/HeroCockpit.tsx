"use client";

import { Mail, Check } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { profileData } from "@/data/profile";
import { useCopyEmail } from "@/lib/useCopyEmail";

export function HeroCockpit() {
  const { copied, copyEmail } = useCopyEmail(profileData.links.email);

  return (
    <section id="overview" className="scroll-mt-24">
      <div className="max-w-3xl pb-2 pt-4 sm:pt-8">
        <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          <span className="h-px w-8 bg-accent/50" />
          Notes & Papers
        </p>

        <h1 className="mt-5 text-balance text-[2rem] font-semibold leading-[1.15] tracking-tight text-white sm:text-4xl md:text-[2.75rem]">
          {profileData.name} 的学习手记
        </h1>

        <p className="mt-4 max-w-xl text-pretty text-sm leading-[1.8] text-slate-300 sm:text-[15px]">
          {profileData.tagline}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-5 text-xs text-slate-400">
            {profileData.links.github && (
              <a
                href={profileData.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-slate-100"
              >
                <GithubIcon className="h-4 w-4" />
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
              className="inline-flex items-center gap-1.5 transition-colors hover:text-slate-100"
            >
              {copied ? (
                <Check className="h-4 w-4 text-accent" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">
                {copied ? "邮箱已复制" : profileData.links.email}
              </span>
              <span className="sm:hidden">{copied ? "已复制" : "邮箱"}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
