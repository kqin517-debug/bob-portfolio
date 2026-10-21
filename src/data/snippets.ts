export interface CodeSnippet {
  id: string;
  title: string;
  category: "React" | "TypeScript" | "CSS/Glass" | "DevOps" | "Algorithms";
  language: string;
  badgeColor: string;
  description: string;
  tags: string[];
  code: string;
  explanation: string;
  complexity: string;
  executionNote?: string;
  updatedAt: string;
}

export const featuredSnippets: CodeSnippet[] = [
  {
    id: "custom-use-debounce",
    title: "useDebounceFn：可取消的防抖 Hook",
    category: "React",
    language: "typescript",
    badgeColor: "#3865FF",
    description: "支持 leading / trailing 触发与手动 flush / cancel 的 React 防抖 Hook。",
    tags: ["React", "Hooks", "Performance"],
    complexity: "O(1) Memory",
    updatedAt: "2026-10-20",
    explanation: "用 useRef 缓存最新回调与定时器引用，避免闭包捕获旧函数；组件卸载时自动清理定时器。",
    code: `import { useCallback, useEffect, useRef } from 'react';

export interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
}

export function useDebounceFn<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300,
  options: { leading?: boolean; trailing?: boolean } = { trailing: true }
): DebouncedFunction<T> {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastArgsRef = useRef<Parameters<T> | null>(null);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    lastArgsRef.current = null;
  }, []);

  const flush = useCallback(() => {
    if (timerRef.current && lastArgsRef.current) {
      fnRef.current(...lastArgsRef.current);
      cancel();
    }
  }, [cancel]);

  const debounced = useCallback((...args: Parameters<T>) => {
    lastArgsRef.current = args;
    const callNow = options.leading && !timerRef.current;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (callNow) {
      fnRef.current(...args);
    }

    timerRef.current = setTimeout(() => {
      if (options.trailing && !callNow && lastArgsRef.current) {
        fnRef.current(...lastArgsRef.current);
      }
      timerRef.current = null;
      lastArgsRef.current = null;
    }, delay);
  }, [delay, options.leading, options.trailing]);

  useEffect(() => cancel, [cancel]);

  return Object.assign(debounced, { cancel, flush });
}`,
  },
  {
    id: "concurrency-pool-runner",
    title: "asyncPool：限制并发度的异步任务池",
    category: "TypeScript",
    language: "typescript",
    badgeColor: "#FF4C24",
    description: "按给定并发上限执行异步任务，保持结果顺序并按索引返回。",
    tags: ["TypeScript", "Async", "Concurrency"],
    complexity: "O(N) Time / O(Limit) Space",
    updatedAt: "2026-10-20",
    explanation: "维护执行中的 Promise 集合；达到并发上限时等待最先完成的任务，再继续添加后续任务。",
    code: `export async function asyncPool<T, R>(
  limit: number,
  items: readonly T[],
  iteratorFn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  const executing = new Set<Promise<void>>();

  for (let index = 0; index < items.length; index++) {
    const item = items[index];
    const promise = (async () => {
      results[index] = await iteratorFn(item, index);
    })().finally(() => {
      executing.delete(promise);
    });

    executing.add(promise);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
}`,
  },
];
