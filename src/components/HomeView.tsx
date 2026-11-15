import { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, Copy, PenLine } from 'lucide-react';
import { HERO_PLATE_SRC, LocalizedContent, TabId } from '../data/content';
import { EditorialPlate } from './EditorialPlate';

interface HomeViewProps {
  content: LocalizedContent;
  isRtl: boolean;
  onNavigateTab: (tab: TabId) => void;
  onSelectChapter: (chapterId: string) => void;
}

export function HomeView({
  content,
  isRtl,
  onNavigateTab,
  onSelectChapter,
}: HomeViewProps) {
  const [copiedQuote, setCopiedQuote] = useState(false);
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const handleCopyStatement = async () => {
    const payload = `${content.home.centralStatement}\n\n— ${content.authorAttribution}`;
    try {
      await navigator.clipboard.writeText(payload);
      setCopiedQuote(true);
      window.setTimeout(() => setCopiedQuote(false), 2200);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = payload;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedQuote(true);
      window.setTimeout(() => setCopiedQuote(false), 2200);
    }
  };

  return (
    <div className="space-y-16">
      {/* Exhibition Marquee Hero */}
      <section className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col justify-between lg:col-span-6">
          <div>
            <p className="text-xs font-medium tracking-wide text-[var(--gold)]">
              {content.home.kicker}
            </p>
            <h1
              className={`mt-4 text-3xl font-semibold leading-tight text-[var(--primary)] sm:text-4xl lg:text-[2.65rem] ${
                isRtl ? 'font-rtl' : 'font-ltr-display'
              }`}
              style={{ textWrap: 'balance' }}
            >
              {content.home.title}
            </h1>

            <div className="my-7 border-y border-[var(--border-hairline)] py-5">
              <blockquote
                className={`text-base leading-relaxed text-[var(--primary)] sm:text-lg ${
                  isRtl ? 'font-rtl font-medium' : 'font-ltr-display italic text-xl'
                }`}
              >
                {content.home.centralStatement}
              </blockquote>
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleCopyStatement}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-hairline)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--ink-muted)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {copiedQuote ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[var(--primary)]" strokeWidth={1.75} />
                      <span className="text-[var(--primary)]">{content.home.copiedQuoteLabel}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" strokeWidth={1.75} />
                      <span>{content.home.copyQuoteLabel}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <p
              className={`max-w-prose text-sm leading-[1.85] text-[var(--ink-muted)] ${
                isRtl ? 'font-rtl' : 'font-ltr-body italic'
              }`}
            >
              {content.home.subtitle}
            </p>

            <p
              className={`mt-4 max-w-prose text-base leading-[1.85] text-[var(--ink)] prose-optical ${
                isRtl ? 'font-rtl' : 'font-ltr-body'
              }`}
            >
              {content.home.philosophy}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => {
                onSelectChapter(content.chaptersView.chapters[0]?.id ?? 'ch-1');
                onNavigateTab('chapters');
              }}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[var(--primary)] px-6 py-2.5 text-sm font-medium text-[var(--primary-ink)] transition-opacity duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <BookOpen className="h-4 w-4" strokeWidth={1.75} />
              <span>{content.home.primaryCta}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('experiences')}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[var(--border-hairline)] bg-[var(--surface)] px-5 py-2.5 text-sm font-medium text-[var(--ink)] transition-colors duration-150 hover:border-[var(--primary)] hover:text-[var(--primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <PenLine className="h-4 w-4" strokeWidth={1.75} />
              <span>{content.home.secondaryCta}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-center lg:col-span-6">
          <EditorialPlate
            src={HERO_PLATE_SRC}
            alt={content.home.heroPlateAlt}
            caption={content.home.heroPlateCaption}
            aspectClass="aspect-[4/3]"
            isRtl={isRtl}
          />
        </div>
      </section>

      {/* Book Narrative Path Strip (Lead Chapter + 2x2 Grid) */}
      <section className="border-t border-[var(--border-hairline)] pt-12">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              className={`text-2xl font-semibold text-[var(--primary)] ${
                isRtl ? 'font-rtl' : 'font-ltr-display text-3xl'
              }`}
            >
              {content.home.chaptersSectionTitle}
            </h2>
            <p className="mt-1 text-sm text-[var(--ink-muted)]">
              {content.home.chaptersSectionLead}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {content.chaptersView.chapters.map((chapter, idx) => (
            <article
              key={chapter.id}
              className={`flex flex-col justify-between rounded-xl border border-[var(--border-hairline)] bg-[var(--surface)] p-6 transition-colors duration-150 hover:border-[var(--primary)]/50 ${
                idx === 0 ? 'md:col-span-2' : ''
              }`}
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-[var(--ink-muted)]">
                  <span className="font-medium text-[var(--gold)]">{chapter.numberLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{chapter.readingTime}</span>
                </div>

                <h3
                  className={`mt-3 text-lg font-semibold leading-snug text-[var(--primary)] ${
                    isRtl ? 'font-rtl' : 'font-ltr-display text-xl'
                  }`}
                >
                  {chapter.title}
                </h3>

                <p
                  className={`mt-2.5 text-sm leading-relaxed text-[var(--ink-muted)] ${
                    isRtl ? 'font-rtl' : 'font-ltr-body'
                  }`}
                >
                  {chapter.transitionNote}
                </p>
              </div>

              <div className="mt-6 border-t border-[var(--border-hairline)] pt-4">
                <button
                  type="button"
                  onClick={() => {
                    onSelectChapter(chapter.id);
                    onNavigateTab('chapters');
                  }}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary)] transition-opacity duration-150 hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>{content.home.readChapterLabel}</span>
                  <ArrowIcon className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Loving Memory Dedication */}
      <section className="rounded-xl border border-[var(--border-hairline)] bg-[var(--surface)] p-6 sm:p-8">
        <p className="text-xs font-medium text-[var(--gold)]">
          {content.home.dedicationTitle}
        </p>
        <p
          className={`mt-2 max-w-3xl text-base leading-[1.85] text-[var(--ink)] prose-optical ${
            isRtl ? 'font-rtl' : 'font-ltr-body'
          }`}
        >
          {content.home.dedicationText}
        </p>
      </section>
    </div>
  );
}
