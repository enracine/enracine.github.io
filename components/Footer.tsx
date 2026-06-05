"use client";
import { useI18n } from "@/lib/i18n";

const EMAIL = "junyuxue@outlook.com";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-8 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
        <span>{t.footer.tagline}</span>
        <span className="flex flex-col gap-x-3 gap-y-1 sm:flex-row sm:items-center">
          <span>{t.footer.rights}</span>
          <span className="hidden sm:inline" aria-hidden>
            ·
          </span>
          <span>
            {t.footer.contact}:{" "}
            <a
              href={`mailto:${EMAIL}`}
              className="underline-offset-2 transition-colors hover:text-ink hover:underline"
            >
              {EMAIL}
            </a>
          </span>
        </span>
      </div>
    </footer>
  );
}
