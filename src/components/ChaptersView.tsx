import { useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Copy, Link2, PenLine } from 'lucide-react';
import { ChapterItem, LocalizedContent } from '../data/content';
import { EditorialPlate } from './EditorialPlate';

interface ChaptersViewProps {
  content: LocalizedContent;
  isRtl: boolean;
  activeChapterId: string;
  onSelectChapter: (chapterId: string) => void;
  onStartReflection: (chapter: ChapterItem) => void;
}

async function copyTextSafely(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}

export function ChaptersView({
  content,
  isRtl,
  activeChapterId,
  onSelectChapter,
  onStartReflection,
}: ChaptersViewProps) {
  const [largeText, setLargeText] = useState(false);
  const [copiedQuote, setCopiedQuote] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const chapters = content.chaptersView.chapters;
  const activeIndex = Math.max(
    0,
    chapters.findIndex((c) => c.id === activeChapterId)
  );
  const activeChapter = chapters[activeIndex] ?? chapters[0];

  const prevChapter = activeIndex > 0 ? chapters[activeIndex - 1] : null;
  const nextChapter = activeIndex < chapters.length - 1 ? chapters[activeIndex + 1] : null;
  const progressPercent = Math.round(((activeIndex + 1) / chapters.length) * 100);

  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  const handleCopyQuote = async () => {
    const payload = `${activeChapter.quote}\n\n— ${content.authorAttribution} (${activeChapter.numberLabel}: ${activeChapter.title})`;
    await copyTextSafely(payload);
    setCopiedQuote(true);
    window.setTimeout(() => setCopiedQuote(false), 2200);
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}#chapters/${activeChapter.id}`;
    await copyTextSafely(url);
    setCopiedLink(true);
    window.setTimeout(() => setCopiedLink(false), 2200);
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-[var(--border-hairline)] pb-6">
        <h1
          className={`text-2xl font-semibold text-[var(--primary)] sm:text-3xl ${
            isRtl ? 'font-rtl' : 'font-ltr-display text-4xl'
          }`}
        >
          {content.chaptersView.heading}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--ink-muted)]">
          {content.chaptersView.lead}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Margin & Chapter Index Rail */}
        <aside className="space-y-6 lg:col-span-4">
          <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--surface)] p-5">
            <p className="mb-3 text-xs font-medium text-[var(--ink-muted)]">
              {content.chaptersView.indexLabel}
            </p>
            <nav className="flex flex-col gap-1.5" aria-label={content.chaptersView.indexLabel}>
              {chapters.map((chapter) => {
                const isActive = chapter.id === activeChapter.id;
                return (
                  <button
                    key={chapter.id}
                    type="button"
                    onClick={() => onSelectChapter(chapter.id)}
                    className={`flex w-full flex-col items-start rounded-lg px-3.5 py-2.5 text-start transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] ${
                      isActive
                        ? 'bg-[var(--primary)] text-[var(--primary-ink)]'
                        : 'text-[var(--ink)] hover:bg-[var(--surface-muted)]'
                    }`}
                  >
                    <span
                      className={`text-xs ${
                        isActive ? 'text-[var(--primary-ink)]/80' : 'text-[var(--gold)]'
                      }`}
                    >
                      {chapter.numberLabel}
                    </span>
                    <span className="mt-0.5 text-sm font-medium leading-snug">
                      {chapter.title}
                    </span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-5 border-t border-[var(--border-hairline)] pt-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-[var(--ink-muted)]">
                  {content.chaptersView.fontSizeLabel}
                </span>
                <div className="inline-flex rounded-lg border border-[var(--border-hairline)] bg-[var(--canvas)] p-0.5">
                  <button
                    type="button"
                    onClick={() => setLargeText(false)}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      !largeText
                        ? 'bg-[var(--primary)] text-[var(--primary-ink)]'
                        : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {content.chaptersView.fontRegular}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLargeText(true)}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      largeText
                        ? 'bg-[var(--primary)] text-[var(--primary-ink)]'
                        : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {content.chaptersView.fontLarge}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--surface)] p-5">
            <p className="text-xs font-medium text-[var(--gold)]">
              {content.chaptersView.marginTitle}
            </p>
            <p
              className={`mt-2 text-sm leading-relaxed text-[var(--ink-muted)] ${
                isRtl ? 'font-rtl' : 'font-ltr-body italic'
              }`}
            >
              {activeChapter.marginNote}
            </p>
          </div>
        </aside>

        {/* Main Essay Reading Column */}
        <article className="lg:col-span-8">
          <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--surface)] p-6 sm:p-10">
            {/* Subtle Reading Progress Bar */}
            <div className="mb-6 h-1 w-full overflow-hidden rounded-full bg-[var(--surface-muted)]">
              <div
                className="h-full bg-[var(--gold)] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--ink-muted)]">
                <span className="font-medium text-[var(--gold)]">{activeChapter.numberLabel}</span>
                <span aria-hidden="true">·</span>
                <span>{activeChapter.readingTime}</span>
              </div>

              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-hairline)] bg-[var(--canvas)] px-3 py-1.5 text-xs font-medium text-[var(--ink-muted)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] whitespace-nowrap shrink-0 cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[var(--primary)]" strokeWidth={1.75} />
                    <span className="text-[var(--primary)]">{content.chaptersView.copiedLinkLabel}</span>
                  </>
                ) : (
                  <>
                    <Link2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                    <span>{content.chaptersView.copyLinkLabel}</span>
                  </>
                )}
              </button>
            </div>

            <h2
              className={`mt-3 text-2xl font-semibold leading-snug text-[var(--primary)] sm:text-3xl ${
                isRtl ? 'font-rtl' : 'font-ltr-display'
              }`}
              style={{ textWrap: 'balance' }}
            >
              {activeChapter.title}
            </h2>
            <p className="mt-2 text-sm text-[var(--ink-muted)]">{activeChapter.subtitle}</p>
            <p
              className={`mt-3 text-sm leading-relaxed text-[var(--gold)] ${
                isRtl ? 'font-rtl' : 'font-ltr-body italic'
              }`}
            >
              {activeChapter.transitionNote}
            </p>

            {activeChapter.plateSrc && activeChapter.plateAlt && (
              <div className="my-7">
                <EditorialPlate
                  src={activeChapter.plateSrc}
                  alt={activeChapter.plateAlt}
                  caption={activeChapter.plateCaption}
                  aspectClass="aspect-[4/3]"
                  isRtl={isRtl}
                />
              </div>
            )}

            <div className="my-7 border-y border-[var(--border-hairline)] py-5">
              <blockquote
                className={`text-lg leading-relaxed text-[var(--primary)] sm:text-xl ${
                  isRtl ? 'font-rtl font-medium' : 'font-ltr-display italic'
                }`}
              >
                {activeChapter.quote}
              </blockquote>
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleCopyQuote}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-hairline)] bg-[var(--canvas)] px-3 py-1.5 text-xs font-medium text-[var(--ink-muted)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {copiedQuote ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[var(--primary)]" strokeWidth={1.75} />
                      <span className="text-[var(--primary)]">
                        {content.chaptersView.copiedQuoteLabel}
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" strokeWidth={1.75} />
                      <span>{content.chaptersView.copyQuoteLabel}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="max-w-prose space-y-5">
              {activeChapter.paragraphs.map((paragraph, idx) => (
                <p
                  key={idx}
                  className={`leading-[1.9] text-[var(--ink)] prose-optical ${
                    largeText ? 'text-lg' : 'text-base'
                  } ${isRtl ? 'font-rtl' : 'font-ltr-body'}`}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Guided Reflection Prompt */}
            <section className="mt-10 rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-muted)]/60 p-6">
              <p className="text-xs font-medium text-[var(--gold)]">
                {content.chaptersView.reflectionHeading}
              </p>
              <p
                className={`mt-2 text-base font-medium leading-relaxed text-[var(--primary)] ${
                  isRtl ? 'font-rtl' : 'font-ltr-display text-lg'
                }`}
              >
                {activeChapter.reflectionQuestion}
              </p>
              <button
                type="button"
                onClick={() => onStartReflection(activeChapter)}
                className="mt-4 inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-[var(--primary)] bg-[var(--surface)] px-4 py-2 text-xs font-medium text-[var(--primary)] transition-colors hover:bg-[var(--primary)] hover:text-[var(--primary-ink)] whitespace-nowrap shrink-0 cursor-pointer sm:text-sm"
              >
                <PenLine className="h-4 w-4" strokeWidth={1.75} />
                <span>{content.chaptersView.reflectionCta}</span>
              </button>
            </section>

            {/* Chapter Pagination */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-hairline)] pt-6">
              <div>
                {prevChapter && (
                  <button
                    type="button"
                    onClick={() => onSelectChapter(prevChapter.id)}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[var(--border-hairline)] px-4 py-2 text-sm font-medium text-[var(--ink)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <PrevIcon className="h-4 w-4" strokeWidth={1.75} />
                    <span>{content.chaptersView.previousLabel}</span>
                  </button>
                )}
              </div>

              <div>
                {nextChapter && (
                  <button
                    type="button"
                    onClick={() => onSelectChapter(nextChapter.id)}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-ink)] transition-opacity hover:opacity-90 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>{content.chaptersView.nextLabel}</span>
                    <NextIcon className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
