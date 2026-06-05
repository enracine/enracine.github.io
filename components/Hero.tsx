"use client";
import { useI18n } from "@/lib/i18n";

// Compact masthead: title and description sit side by side on desktop to use
// the container width and keep the tool itself high on the page.
export default function Hero() {
  const { t } = useI18n();
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-7 pt-7 sm:pb-9 sm:pt-9">
      <div className="grid items-end gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <h1 className="font-display text-[clamp(1.85rem,3.4vw,3rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-ink text-balance">
          {t.hero.titleMain}
          <br />
          <span className="text-ink-faint">{t.hero.titleFaint}</span>
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-ink-soft lg:pb-1">
          {t.hero.descPre}
          <span className="font-semibold text-ink underline decoration-ink/35 decoration-2 underline-offset-4">
            {t.hero.descHi}
          </span>
          {t.hero.descPost}
        </p>
      </div>
    </section>
  );
}
