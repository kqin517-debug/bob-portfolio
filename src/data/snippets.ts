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
    title: "useDebounceFn：自适应防抖与取消控制器 Hook",
    category: "React",
    language: "typescript",
    badgeColor: "#3865FF",
    description: "提供开箱即用的高阶防抖控制，支持立即执行 (leading)、延迟执行 (trailing) 以及手动 flush / cancel 生命周期控制。",
    tags: ["React 19", "Hooks", "Performance", "Clean Code"],
    complexity: "O(1) Memory",
    updatedAt: "2026-10-18",
    explanation: "利用 useRef 缓存最新回调函数与定时器引用，避免闭包陷阱；同时在组件卸载时自动清理 timer，彻底根绝内存泄漏隐患。",
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
    id: "glassmorphism-tailwind-tokens",
    title: "Figma 双层微光质感：极致 Glassmorphism 样式体系",
    category: "CSS/Glass",
    language: "css",
    badgeColor: "#00E5FF",
    description: "源自 Figma Glassmorphism UI Kit 原型。结合多重内阴影漫反射、高斯模糊与天光边缘高光，打造真正的晶莹玻璃感。",
    tags: ["CSS 3", "Glassmorphism", "Micro-interactivity", "Design Token"],
    complexity: "GPU Accelerated",
    updatedAt: "2026-10-19",
    explanation: "核心在于不要使用单一透明度！采用微渐变半透明背景 + 顶部 1px 白光高光描边 (inset 0 1px 0 rgba(255,255,255,0.4)) + 40px backdrop-filter 景深虚化。",
    code: `/* Figma Glassmorphism Core Specs */
.glass-container {
  /* 1. 双重半透明天光渐变背景 */
  background: linear-gradient(
    180deg,
    rgba(25, 32, 54, 0.72) 0%,
    rgba(10, 14, 26, 0.85) 100%
  );
  
  /* 2. 硬件加速多阶高斯景深 */
  backdrop-filter: blur(32px) saturate(180%);
  -webkit-backdrop-filter: blur(32px) saturate(180%);

  /* 3. 仿物理玻璃边缘高光 (顶部强光、内部微漫反射、底层漫落阴影) */
  box-shadow: 
    0px 30px 60px -15px rgba(0, 0, 0, 0.65),
    0px 10px 20px -5px rgba(0, 0, 0, 0.4),
    inset 0px 1px 0px 0px rgba(223, 232, 255, 0.35),
    inset 0px 0px 30px 0px rgba(255, 255, 255, 0.05);

  /* 4. 超微发丝渐变边界 */
  border: 1px solid rgba(223, 232, 255, 0.16);
  border-radius: 24px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.glass-container:hover {
  border-color: rgba(223, 232, 255, 0.35);
  box-shadow: 
    0px 40px 80px -15px rgba(0, 0, 0, 0.75),
    inset 0px 1px 1px 0px rgba(255, 255, 255, 0.5),
    inset 0px 0px 40px 0px rgba(78, 117, 255, 0.15);
}`,
  },
  {
    id: "concurrency-pool-runner",
    title: "AsyncPool：带背压保护的高性能异步并发池",
    category: "TypeScript",
    language: "typescript",
    badgeColor: "#FF4C24",
    description: "在海量 API 批处理或大批量代码高亮构建任务中，严格限制并发度（Concurrency Limit），并保证执行顺序与异常隔离。",
    tags: ["Concurrency", "TypeScript", "Async", "Engine"],
    complexity: "O(N) Time / O(Limit) Space",
    updatedAt: "2026-10-15",
    explanation: "维护活跃 promise 集合与任务队列，每当一个任务 settled 即从集合摘除并拉取新任务，相比单纯 chunk 切片吞吐率提升 35% 以上。",
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
