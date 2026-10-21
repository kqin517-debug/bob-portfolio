import type { ContentSection } from "@/data/types";

export function ArticleBody({ sections }: { sections: ContentSection[] }) {
  return (
    <div className="space-y-10">
      {sections.map((section, index) => (
        <section
          key={section.heading}
          id={`section-${index + 1}`}
          className="scroll-mt-28"
        >
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[11px] tabular-nums text-accent/80">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
              {section.heading}
            </h2>
          </div>

          <div className="mt-4 space-y-4">
            {section.paragraphs.map((paragraph, paragraphIndex) => (
              <p
                key={paragraphIndex}
                className="text-[14px] leading-[1.95] text-slate-300"
              >
                {paragraph}
              </p>
            ))}

            {section.bullets && section.bullets.length > 0 && (
              <ul className="space-y-2.5">
                {section.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex gap-3 text-[13.5px] leading-[1.85] text-slate-300"
                  >
                    <span
                      className="mt-[0.68rem] h-1 w-1 shrink-0 rounded-full bg-accent/70"
                      aria-hidden="true"
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
