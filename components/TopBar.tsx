"use client";
import { useState } from "react";
import { Feather } from "lucide-react";
import { useI18n, type Lang } from "@/lib/i18n";
import Logo from "./Logo";
import AboutDialog from "./AboutDialog";

const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "zh", label: "中" },
];

export default function TopBar() {
  const { t, lang, setLang } = useI18n();
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <header className="mx-auto w-full max-w-6xl px-6 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Logo size={26} />
          <span className="font-display text-sm font-bold uppercase tracking-[0.2em] text-ink">
            Enracine
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAboutOpen(true)}
            className="flex cursor-pointer items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-ink hover:text-ink"
          >
            <Feather className="h-3.5 w-3.5" strokeWidth={1.75} />
            {t.topbar.poem}
          </button>

          <div
            role="group"
            aria-label="Language"
            className="flex items-center rounded-full border border-line p-0.5"
          >
            {LANGS.map((l) => {
              const active = l.code === lang;
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLang(l.code)}
                  aria-pressed={active}
                  className={`cursor-pointer rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                    active ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {l.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <AboutDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </header>
  );
}
