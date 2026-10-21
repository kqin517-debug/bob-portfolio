"use client";

import React, { useEffect, useState } from "react";
import { Check, ChevronDown, ClipboardList, RotateCcw } from "lucide-react";
import { assignments } from "@/data/assignments";

const STORAGE_KEY = "bob-assignments-progress";
const ASSIGNMENT_IDS = new Set(assignments.map((item) => item.id));

export function AssignmentChecklist() {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [hasLoadedStoredState, setHasLoadedStoredState] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setCompletedIds(
            parsed.filter(
              (id): id is string =>
                typeof id === "string" && ASSIGNMENT_IDS.has(id)
            )
          );
        }
      }
    } catch {
      // 本地存储被禁用或内容损坏时，保持全部未完成。
    }
    setHasLoadedStoredState(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedStoredState) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(completedIds));
    } catch {
      // 写入失败不影响当前会话内的勾选状态。
    }
  }, [completedIds, hasLoadedStoredState]);

  if (assignments.length === 0) return null;

  const toggleAssignment = (id: string) => {
    setCompletedIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const resetCompleted = () => setCompletedIds([]);

  const completedCount = completedIds.length;
  const allDone = completedCount === assignments.length;
  const progress = Math.round((completedCount / assignments.length) * 100);

  return (
    <section
      aria-label="论文区"
      className="mt-5 border-t border-white/[0.06] pb-2 pt-4"
    >
      <div className="flex items-center justify-between pl-3 pr-3">
        <button
          type="button"
          onClick={() => setIsExpanded((expanded) => !expanded)}
          aria-expanded={isExpanded}
          aria-controls="assignments-panel"
          className="flex items-center gap-3 rounded-md py-1 text-slate-400 transition-colors hover:text-slate-100"
        >
          <ClipboardList className="h-4 w-4 text-muted" />
          <span className="text-sm">论文区</span>
          <ChevronDown
            className={`h-3.5 w-3.5 text-muted transition-transform duration-200 ${
              isExpanded ? "" : "-rotate-90"
            }`}
          />
        </button>

        <span
          className={`font-mono text-[11px] tabular-nums ${
            allDone ? "text-accent" : "text-muted"
          }`}
          title={`已完成 ${completedCount} / ${assignments.length}`}
        >
          {String(completedCount).padStart(2, "0")} /{" "}
          {String(assignments.length).padStart(2, "0")}
        </span>
      </div>

      <div
        id="assignments-panel"
        hidden={!isExpanded}
        className="mt-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-1.5"
      >
        <div className="px-1.5 pb-2 pt-1">
          <div
            className="h-1 overflow-hidden rounded-full bg-white/[0.06]"
            aria-hidden="true"
          >
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <ul className="space-y-0.5">
          {assignments.map((assignment) => {
            const isDone = completedIds.includes(assignment.id);

            return (
              <li key={assignment.id}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={isDone}
                  onClick={() => toggleAssignment(assignment.id)}
                  className="group flex w-full items-start gap-2.5 rounded-xl px-2 py-1.5 text-left transition-colors hover:bg-white/[0.04]"
                >
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition-colors ${
                      isDone
                        ? "border-accent bg-accent text-[#090b12]"
                        : "border-white/20 text-transparent group-hover:border-white/40"
                    }`}
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-pretty text-sm leading-[1.6] transition-colors ${
                        isDone ? "text-muted line-through" : "text-slate-200"
                      }`}
                    >
                      {assignment.title}
                    </span>
                    <span className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] leading-[1.5] text-muted">
                      <span>{assignment.tag}</span>
                      {assignment.dueAt && (
                        <>
                          <span
                            className="h-0.5 w-0.5 rounded-full bg-white/25"
                            aria-hidden="true"
                          />
                          <span className="tabular-nums">
                            截止 {assignment.dueAt}
                          </span>
                        </>
                      )}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {completedCount > 0 && (
          <div className="mt-1 border-t border-white/[0.05] px-1 pt-1.5">
            <button
              type="button"
              onClick={resetCompleted}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg py-1 text-[11px] text-muted transition-colors hover:bg-white/[0.04] hover:text-slate-200"
            >
              <RotateCcw className="h-3 w-3" />
              重置完成状态
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
