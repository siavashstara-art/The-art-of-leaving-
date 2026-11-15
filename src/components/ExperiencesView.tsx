import { FormEvent, useEffect, useState } from 'react';
import { Check, CheckCircle2, Copy, Mail, Trash2 } from 'lucide-react';
import { LocalizedContent, Language, SubmittedExperience } from '../data/content';

export interface ExperiencePrefill {
  categoryId: string;
  suggestedTitle: string;
  reflectionQuestion: string;
  nonce: number;
}

interface ExperiencesViewProps {
  content: LocalizedContent;
  language: Language;
  isRtl: boolean;
  experiences: SubmittedExperience[];
  prefill: ExperiencePrefill | null;
  onAddExperience: (item: SubmittedExperience) => void;
  onRemoveExperience: (id: string) => void;
}

export function ExperiencesView({
  content,
  language,
  isRtl,
  experiences,
  prefill,
  onAddExperience,
  onRemoveExperience,
}: ExperiencesViewProps) {
  const [authorName, setAuthorName] = useState('');
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(content.experiencesView.categories[0].id);
  const [narrative, setNarrative] = useState('');
  const [consentBook, setConsentBook] = useState(true);
  const [consentApp, setConsentApp] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastSubmitted, setLastSubmitted] = useState<SubmittedExperience | null>(null);
  const [copiedEmailBody, setCopiedEmailBody] = useState(false);

  useEffect(() => {
    if (prefill) {
      setCategoryId(prefill.categoryId);
      setTitle(prefill.suggestedTitle);
      setErrorMsg(null);
      setLastSubmitted(null);
    }
  }, [prefill]);

  const getCategoryLabel = (id: string) => {
    return (
      content.experiencesView.categories.find((c) => c.id === id)?.label ??
      content.experiencesView.categories[content.experiencesView.categories.length - 1].label
    );
  };

  const formatEmailText = (item: SubmittedExperience) => {
    const categoryLabel = getCategoryLabel(item.categoryId);
    const consentLines = [
      `${content.experiencesView.form.consentBook}: ${item.consentBook ? '✓' : '✗'}`,
      `${content.experiencesView.form.consentApp}: ${item.consentApp ? '✓' : '✗'}`,
    ].join('\n');

    return [
      `${content.brand} — ${content.experiencesView.heading}`,
      `----------------------------------------`,
      `${content.experiencesView.form.titleLabel}: ${item.title}`,
      `${content.experiencesView.form.nameLabel}: ${item.authorName}`,
      `${content.experiencesView.form.categoryLabel}: ${categoryLabel}`,
      '',
      item.narrative,
      '',
      `----------------------------------------`,
      consentLines,
    ].join('\n');
  };

  const buildMailtoHref = (item: SubmittedExperience) => {
    const subject = encodeURIComponent(`${content.brand} | ${item.title}`);
    const body = encodeURIComponent(formatEmailText(item));
    return `mailto:${content.experiencesView.authorEmail}?subject=${subject}&body=${body}`;
  };

  const handleCopyEmailBody = async (item: SubmittedExperience) => {
    const text = formatEmailText(item);
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
    setCopiedEmailBody(true);
    window.setTimeout(() => setCopiedEmailBody(false), 2200);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedTitle = title.trim();
    const trimmedNarrative = narrative.trim();

    if (!trimmedTitle || !trimmedNarrative) {
      setErrorMsg(content.experiencesView.form.validationError);
      return;
    }

    const newItem: SubmittedExperience = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      authorName: authorName.trim() || content.experiencesView.form.anonymousFallback,
      title: trimmedTitle,
      categoryId,
      narrative: trimmedNarrative,
      consentBook,
      consentApp,
      createdAt: new Date().toISOString(),
      language,
    };

    onAddExperience(newItem);
    setLastSubmitted(newItem);
    setAuthorName('');
    setTitle('');
    setNarrative('');
  };

  const formatDate = (iso: string) => {
    try {
      const locale = language === 'fa' ? 'fa-IR' : language === 'ar' ? 'ar-SA' : 'en-US';
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(new Date(iso));
    } catch {
      return iso.slice(0, 10);
    }
  };

  const filteredExperiences =
    filterCategory === 'all'
      ? experiences
      : experiences.filter((item) => item.categoryId === filterCategory);

  return (
    <div className="space-y-8">
      <div className="border-b border-[var(--border-hairline)] pb-6">
        <h1
          className={`text-2xl font-semibold text-[var(--primary)] sm:text-3xl ${
            isRtl ? 'font-rtl' : 'font-ltr-display text-4xl'
          }`}
        >
          {content.experiencesView.heading}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--ink-muted)]">
          {content.experiencesView.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Submission Form */}
        <section className="lg:col-span-6">
          <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--surface)] p-6 sm:p-8">
            {prefill?.reflectionQuestion && (
              <div className="mb-6 rounded-lg border border-[var(--border-hairline)] bg-[var(--surface-muted)]/70 p-4">
                <p className="text-xs font-medium text-[var(--gold)]">
                  {content.chaptersView.reflectionHeading}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--primary)]">
                  {prefill.reflectionQuestion}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label
                  htmlFor="exp-name"
                  className="mb-1.5 block text-sm font-medium text-[var(--ink)]"
                >
                  {content.experiencesView.form.nameLabel}
                </label>
                <input
                  id="exp-name"
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder={content.experiencesView.form.namePlaceholder}
                  className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--canvas)] px-3.5 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--ink-muted)]/70 focus:border-[var(--primary)] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="exp-title"
                  className="mb-1.5 block text-sm font-medium text-[var(--ink)]"
                >
                  {content.experiencesView.form.titleLabel}
                </label>
                <input
                  id="exp-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={content.experiencesView.form.titlePlaceholder}
                  className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--canvas)] px-3.5 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--ink-muted)]/70 focus:border-[var(--primary)] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="exp-category"
                  className="mb-1.5 block text-sm font-medium text-[var(--ink)]"
                >
                  {content.experiencesView.form.categoryLabel}
                </label>
                <select
                  id="exp-category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--canvas)] px-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--primary)] focus:outline-none"
                >
                  {content.experiencesView.categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="exp-text"
                  className="mb-1.5 block text-sm font-medium text-[var(--ink)]"
                >
                  {content.experiencesView.form.textLabel}
                </label>
                <textarea
                  id="exp-text"
                  rows={5}
                  required
                  value={narrative}
                  onChange={(e) => setNarrative(e.target.value)}
                  placeholder={content.experiencesView.form.textPlaceholder}
                  className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--canvas)] px-3.5 py-2.5 text-sm leading-relaxed text-[var(--ink)] placeholder:text-[var(--ink-muted)]/70 focus:border-[var(--primary)] focus:outline-none"
                />
              </div>

              <div className="space-y-3 border-t border-[var(--border-hairline)] pt-4">
                <label className="flex cursor-pointer items-start gap-2.5 text-sm text-[var(--ink)]">
                  <input
                    type="checkbox"
                    checked={consentBook}
                    onChange={(e) => setConsentBook(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-[var(--primary)]"
                  />
                  <span>{content.experiencesView.form.consentBook}</span>
                </label>

                <label className="flex cursor-pointer items-start gap-2.5 text-sm text-[var(--ink)]">
                  <input
                    type="checkbox"
                    checked={consentApp}
                    onChange={(e) => setConsentApp(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-[var(--primary)]"
                  />
                  <span>{content.experiencesView.form.consentApp}</span>
                </label>
              </div>

              {errorMsg && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200"
                >
                  {errorMsg}
                </div>
              )}

              {lastSubmitted && (
                <div
                  role="status"
                  className="space-y-3 rounded-lg border border-[var(--primary)]/30 bg-[var(--surface-muted)] p-4 text-sm text-[var(--primary)]"
                >
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
                    <span>{content.experiencesView.form.successMessage}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    <a
                      href={buildMailtoHref(lastSubmitted)}
                      className="inline-flex min-h-[38px] items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-xs font-medium text-[var(--primary-ink)] transition-opacity hover:opacity-90 whitespace-nowrap shrink-0"
                    >
                      <Mail className="h-3.5 w-3.5" strokeWidth={1.75} />
                      <span>{content.experiencesView.form.sendToGmailLabel}</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopyEmailBody(lastSubmitted)}
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[var(--border-hairline)] bg-[var(--surface)] px-3.5 py-2 text-xs font-medium text-[var(--ink)] transition-colors hover:border-[var(--primary)] whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {copiedEmailBody ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-[var(--primary)]" strokeWidth={1.75} />
                          <span>{content.experiencesView.form.copiedForEmailLabel}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" strokeWidth={1.75} />
                          <span>{content.experiencesView.form.copyForEmailLabel}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-[var(--ink-muted)]">
                    {content.experiencesView.form.emailHint}
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[var(--primary)] px-6 py-2.5 text-sm font-medium text-[var(--primary-ink)] transition-opacity duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] whitespace-nowrap cursor-pointer sm:w-auto"
              >
                {content.experiencesView.form.submit}
              </button>
            </form>
          </div>
        </section>

        {/* Submitted Reflections Journal */}
        <section className="space-y-5 lg:col-span-6">
          <div className="flex flex-col gap-3">
            <h2
              className={`text-xl font-semibold text-[var(--primary)] ${
                isRtl ? 'font-rtl' : 'font-ltr-display text-2xl'
              }`}
            >
              {content.experiencesView.archive.heading}
            </h2>

            {/* Interactive Category Filter Buttons */}
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setFilterCategory('all')}
                className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filterCategory === 'all'
                    ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-ink)]'
                    : 'border-[var(--border-hairline)] bg-[var(--surface)] text-[var(--ink-muted)] hover:text-[var(--ink)]'
                }`}
              >
                {content.experiencesView.archive.filterAll}
              </button>
              {content.experiencesView.categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFilterCategory(cat.id)}
                  className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    filterCategory === cat.id
                      ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-ink)]'
                      : 'border-[var(--border-hairline)] bg-[var(--surface)] text-[var(--ink-muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {filteredExperiences.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[var(--border-hairline)] bg-[var(--surface)] p-8 text-center">
              <p className="text-base font-medium text-[var(--primary)]">
                {content.experiencesView.archive.emptyTitle}
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[var(--ink-muted)]">
                {content.experiencesView.archive.emptyDescription}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredExperiences.map((item) => {
                const consentNotes: string[] = [];
                if (item.consentBook) {
                  consentNotes.push(content.experiencesView.archive.bookConsentNote);
                }
                if (item.consentApp) {
                  consentNotes.push(content.experiencesView.archive.appConsentNote);
                }

                return (
                  <article
                    key={item.id}
                    className="rounded-xl border border-[var(--border-hairline)] bg-[var(--surface)] p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--ink-muted)]">
                          <span className="font-medium text-[var(--gold)]">
                            {getCategoryLabel(item.categoryId)}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{item.authorName}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{formatDate(item.createdAt)}</span>
                        </div>
                        <h3
                          className={`mt-2 text-lg font-semibold text-[var(--primary)] ${
                            isRtl ? 'font-rtl' : 'font-ltr-display text-xl'
                          }`}
                        >
                          {item.title}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveExperience(item.id)}
                        aria-label={content.experiencesView.archive.deleteLabel}
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[var(--ink-muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-red-700 dark:hover:text-red-300 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                    </div>

                    <p
                      className={`mt-3 whitespace-pre-line text-sm leading-[1.85] text-[var(--ink)] prose-optical ${
                        isRtl ? 'font-rtl' : 'font-ltr-body'
                      }`}
                    >
                      {item.narrative}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-hairline)] pt-3">
                      <p className="text-xs text-[var(--ink-muted)]">
                        {consentNotes.join(' · ')}
                      </p>

                      <a
                        href={buildMailtoHref(item)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--primary)] transition-opacity hover:opacity-75 whitespace-nowrap shrink-0"
                      >
                        <Mail className="h-3.5 w-3.5" strokeWidth={1.75} />
                        <span>{content.experiencesView.archive.sendViaEmailLabel}</span>
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
