import Link from "next/link";
import { Clock, FileText, GraduationCap } from "lucide-react";
import { formatDate, type LatestUpdate } from "@/lib/content";

interface LatestUpdatesProps {
  items: LatestUpdate[];
}

export function LatestUpdates({ items }: LatestUpdatesProps) {
  if (items.length === 0) return null;

  return (
    <section
      aria-label="最新更新"
      className="mt-5 border-t border-white/[0.06] pb-2 pt-4"
    >
      <div className="flex items-center gap-3 px-3 py-1 text-sm text-slate-400">
        <Clock className="h-4 w-4 text-muted" />
        最新更新
      </div>

      <ul className="mt-2 space-y-0.5">
        {items.map((item) => {
          const Icon = item.kind === "paper" ? FileText : GraduationCap;

          return (
            <li key={item.id}>
              <Link
                href={item.href}
                className="group flex w-full items-start gap-2.5 rounded-xl px-3 py-2 text-left transition-colors hover:bg-white/[0.04]"
              >
                <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" />

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs text-slate-300 transition-colors group-hover:text-white">
                    {item.title}
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-[10px] text-muted">
                    <span>{item.kind === "paper" ? "论文" : "课程作业"}</span>
                    <span
                      className="h-0.5 w-0.5 rounded-full bg-white/25"
                      aria-hidden="true"
                    />
                    <span className="font-mono tabular-nums">
                      {formatDate(item.date)}
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
