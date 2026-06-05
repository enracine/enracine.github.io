"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import Logo from "./Logo";

const EMAIL = "junyuxue@outlook.com";

export default function AboutDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      role="dialog"
      aria-modal="true"
      aria-label={t.about.title}
    >
      <button
        type="button"
        aria-label={t.about.close}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink/55 backdrop-blur-[2px]"
      />
      <div className="animate-rise relative flex max-h-[calc(100dvh-2.5rem)] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-line bg-card shadow-2xl">
        {/* Pinned header */}
        <div className="flex shrink-0 items-center justify-between border-b border-line px-6 py-4">
          <div className="flex items-center gap-2.5">
            <Logo size={22} />
            <span className="font-display text-sm font-bold uppercase tracking-[0.2em] text-ink">
              Enracine
            </span>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t.about.close}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-paper hover:text-ink"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-7 py-7 sm:px-9 sm:py-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-faint">
            {t.about.title}
          </p>
          <p className="mt-2 text-xs italic text-ink-faint">{t.about.nameGloss}</p>
          <div className="mt-5 space-y-1.5 font-display text-[17px] leading-relaxed text-ink sm:text-lg">
            {t.about.poem.map((line, i) =>
              line === "" ? (
                <div key={i} className="h-3" aria-hidden />
              ) : (
                <p key={i}>{line}</p>
              ),
            )}
          </div>
          <p className="mt-7 text-sm leading-relaxed text-ink-soft">{t.about.tie}</p>

          <div className="mt-7 border-t border-line pt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-faint">
              {t.about.missionLabel}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{t.about.mission}</p>
          </div>
        </div>

        {/* Pinned footer */}
        <div className="flex shrink-0 flex-col gap-1 border-t border-line bg-card px-7 py-4 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between sm:px-9">
          <span className="font-medium text-ink-soft">{t.about.signature}</span>
          <span>
            {t.about.contact}:{" "}
            <a
              href={`mailto:${EMAIL}`}
              className="text-ink-soft underline-offset-2 transition-colors hover:text-ink hover:underline"
            >
              {EMAIL}
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
