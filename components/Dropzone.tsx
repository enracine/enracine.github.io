"use client";
import { useCallback, useRef, useState } from "react";
import { ImageUp, Loader2, RefreshCw } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type Props = {
  imageUrl: string | null;
  loading: boolean;
  onFile: (file: File) => void;
};

export default function Dropzone({ imageUrl, loading, onFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const { t } = useI18n();

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (file && file.type.startsWith("image/")) onFile(file);
    },
    [onFile],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={`group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border transition-colors ${
        dragging ? "border-ink bg-card" : "border-line bg-card"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="Uploaded source" className="h-full w-full object-cover" />
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-4 px-8 text-center"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-line text-ink-soft transition-colors group-hover:border-ink group-hover:text-ink">
            <ImageUp className="h-6 w-6" strokeWidth={1.5} />
          </span>
          <span className="space-y-1">
            <span className="block font-display text-lg font-semibold text-ink">
              {t.drop.title}
            </span>
            <span className="block text-sm text-ink-soft">{t.drop.hint}</span>
          </span>
        </button>
      )}

      {imageUrl && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute right-3 top-3 flex cursor-pointer items-center gap-1.5 rounded-full bg-ink/85 px-3 py-1.5 text-xs font-medium text-paper backdrop-blur transition-opacity hover:bg-ink"
        >
          <RefreshCw className="h-3.5 w-3.5" strokeWidth={2} />
          {t.drop.replace}
        </button>
      )}

      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-card/80 backdrop-blur-sm">
          <Loader2 className="h-6 w-6 animate-spin text-ink" strokeWidth={1.75} />
          <span className="text-sm font-medium text-ink-soft">{t.drop.reading}</span>
        </div>
      )}
    </div>
  );
}
