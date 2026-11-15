import { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface EditorialPlateProps {
  src: string;
  alt: string;
  caption?: string;
  aspectClass?: string;
  isRtl?: boolean;
}

export function EditorialPlate({
  src,
  alt,
  caption,
  aspectClass = 'aspect-[4/3]',
  isRtl = false,
}: EditorialPlateProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <figure className="w-full">
      <div
        className={`relative w-full overflow-hidden rounded-lg border border-[var(--border-hairline)] bg-[var(--surface-muted)] ${aspectClass}`}
      >
        {!hasError ? (
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            onError={() => setHasError(true)}
            className="h-full w-full object-cover transition-transform duration-500 ease-out hover:scale-[1.015]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center text-[var(--ink-muted)]">
            <BookOpen className="h-8 w-8 text-[var(--primary)] opacity-70" strokeWidth={1.5} />
            <span className="max-w-xs text-sm leading-relaxed">{alt}</span>
          </div>
        )}
      </div>
      {caption && (
        <figcaption
          className={`mt-2.5 text-xs leading-relaxed text-[var(--ink-muted)] ${
            isRtl ? 'font-rtl' : 'font-ltr-body italic'
          }`}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
