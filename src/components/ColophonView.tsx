import { LocalizedContent } from '../data/content';

interface ColophonViewProps {
  content: LocalizedContent;
  isRtl: boolean;
}

export function ColophonView({ content, isRtl }: ColophonViewProps) {
  const { colophonView } = content;

  return (
    <div className="space-y-12">
      {/* Archival Colophon Card */}
      <section className="rounded-xl border border-[var(--border-hairline)] bg-[var(--surface)] p-6 sm:p-10">
        <p className="text-xs font-medium text-[var(--gold)]">{colophonView.kicker}</p>
        <h1
          className={`mt-2 text-2xl font-semibold text-[var(--primary)] sm:text-3xl ${
            isRtl ? 'font-rtl' : 'font-ltr-display text-4xl'
          }`}
        >
          {colophonView.title}
        </h1>

        <dl className="mt-8 divide-y divide-[var(--border-hairline)] border-t border-[var(--border-hairline)]">
          <div className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-3 sm:gap-6">
            <dt className="text-sm font-medium text-[var(--ink-muted)]">
              {colophonView.accessionLabels.author}
            </dt>
            <dd className="text-sm font-semibold text-[var(--primary)] sm:col-span-2">
              {colophonView.authorName}
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-3 sm:gap-6">
            <dt className="text-sm font-medium text-[var(--ink-muted)]">
              {colophonView.accessionLabels.rights}
            </dt>
            <dd className="text-sm leading-relaxed text-[var(--ink)] sm:col-span-2">
              {colophonView.owner}
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-3 sm:gap-6">
            <dt className="text-sm font-medium text-[var(--ink-muted)]">
              {colophonView.accessionLabels.dedication}
            </dt>
            <dd className="text-sm font-medium leading-relaxed text-[var(--gold)] sm:col-span-2">
              {colophonView.father}
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-3 sm:gap-6">
            <dt className="text-sm font-medium text-[var(--ink-muted)]">
              {colophonView.accessionLabels.edition}
            </dt>
            <dd className="text-sm text-[var(--ink)] sm:col-span-2">
              {colophonView.editionValue}
            </dd>
          </div>
        </dl>
      </section>

      {/* Portfolio Catalog */}
      <section className="rounded-xl border border-[var(--border-hairline)] bg-[var(--surface)] p-6 sm:p-10">
        <h2
          className={`text-xl font-semibold text-[var(--primary)] sm:text-2xl ${
            isRtl ? 'font-rtl' : 'font-ltr-display text-3xl'
          }`}
        >
          {colophonView.portfolioHeading}
        </h2>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">{colophonView.portfolioLead}</p>

        <ol className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 border-t border-[var(--border-hairline)] pt-6 sm:grid-cols-2 lg:grid-cols-3">
          {colophonView.portfolioItems.map((item, idx) => (
            <li
              key={idx}
              className="flex items-baseline gap-3 border-b border-[var(--border-hairline)]/60 pb-2.5 text-sm text-[var(--ink)]"
            >
              <span className="tabular-nums text-xs font-medium text-[var(--gold)]">
                {String(idx + 1).padStart(2, '0')}.
              </span>
              <span className="leading-snug">{item}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
