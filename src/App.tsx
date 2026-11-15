/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { ChaptersView } from './components/ChaptersView';
import { ColophonView } from './components/ColophonView';
import { ExperiencesView, ExperiencePrefill } from './components/ExperiencesView';
import { HomeView } from './components/HomeView';
import {
  ChapterItem,
  CONTENT_DATA,
  Language,
  SubmittedExperience,
  TabId,
  ThemeMode,
} from './data/content';

const STORAGE_LANG_KEY = 'honar_zistan_lang';
const STORAGE_THEME_KEY = 'honar_zistan_theme';
const STORAGE_EXPERIENCES_KEY = 'honar_zistan_experiences_v1';

const TAB_ORDER: TabId[] = ['home', 'chapters', 'experiences', 'colophon'];
const VALID_CHAPTER_IDS = new Set(['ch-1', 'ch-2', 'ch-3', 'ch-4', 'ch-5']);

function parseHashState(): { tab: TabId; chapterId: string } {
  if (typeof window === 'undefined') {
    return { tab: 'home', chapterId: 'ch-1' };
  }
  const rawHash = window.location.hash.replace(/^#/, '').trim();
  if (!rawHash || rawHash === 'home') {
    return { tab: 'home', chapterId: 'ch-1' };
  }
  if (rawHash === 'experiences') {
    return { tab: 'experiences', chapterId: 'ch-1' };
  }
  if (rawHash === 'colophon') {
    return { tab: 'colophon', chapterId: 'ch-1' };
  }
  if (rawHash === 'chapters') {
    return { tab: 'chapters', chapterId: 'ch-1' };
  }
  if (rawHash.startsWith('chapters/')) {
    const candidate = rawHash.slice('chapters/'.length);
    return {
      tab: 'chapters',
      chapterId: VALID_CHAPTER_IDS.has(candidate) ? candidate : 'ch-1',
    };
  }
  if (VALID_CHAPTER_IDS.has(rawHash)) {
    return { tab: 'chapters', chapterId: rawHash };
  }
  return { tab: 'home', chapterId: 'ch-1' };
}

export default function App() {
  const initialHash = parseHashState();

  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LANG_KEY);
      if (saved === 'fa' || saved === 'ar' || saved === 'en' || saved === 'es' || saved === 'de' || saved === 'fr') {
        return saved;
      }
    } catch {
      // Ignore storage access errors
    }
    return 'fa';
  });

  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_THEME_KEY);
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
    } catch {
      // Ignore storage access errors
    }
    return 'light';
  });

  const [activeTab, setActiveTab] = useState<TabId>(initialHash.tab);
  const [activeChapterId, setActiveChapterId] = useState<string>(initialHash.chapterId);
  const [experiencePrefill, setExperiencePrefill] = useState<ExperiencePrefill | null>(null);

  const [experiences, setExperiences] = useState<SubmittedExperience[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_EXPERIENCES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // Ignore invalid stored payload
    }
    return [];
  });

  const content = CONTENT_DATA[language];
  const isRtl = content.dir === 'rtl';

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('lang', language);
    html.setAttribute('dir', content.dir);
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_LANG_KEY, language);
      localStorage.setItem(STORAGE_THEME_KEY, theme);
    } catch {
      // Ignore storage write errors
    }
  }, [language, theme, content.dir]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_EXPERIENCES_KEY, JSON.stringify(experiences));
    } catch {
      // Ignore storage write errors
    }
  }, [experiences]);

  useEffect(() => {
    const handleHashChange = () => {
      const next = parseHashState();
      setActiveTab(next.tab);
      if (next.tab === 'chapters') {
        setActiveChapterId(next.chapterId);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const syncHash = (tab: TabId, chapterId: string) => {
    const targetHash = tab === 'chapters' ? `#chapters/${chapterId}` : `#${tab}`;
    if (window.location.hash !== targetHash) {
      window.history.replaceState(null, '', targetHash);
    }
  };

  const handleNavigateTab = (tab: TabId) => {
    setActiveTab(tab);
    syncHash(tab, activeChapterId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectChapter = (chapterId: string) => {
    setActiveChapterId(chapterId);
    syncHash('chapters', chapterId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartReflection = (chapter: ChapterItem) => {
    setExperiencePrefill({
      categoryId: chapter.reflectionCategoryId,
      suggestedTitle: chapter.reflectionSuggestedTitle,
      reflectionQuestion: chapter.reflectionQuestion,
      nonce: Date.now(),
    });
    setActiveTab('experiences');
    syncHash('experiences', activeChapterId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddExperience = (item: SubmittedExperience) => {
    setExperiences((prev) => [item, ...prev]);
  };

  const handleRemoveExperience = (id: string) => {
    setExperiences((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div
      dir={content.dir}
      className={`min-h-screen bg-[var(--canvas)] text-[var(--ink)] ${
        isRtl ? 'font-rtl' : 'font-ltr-body'
      }`}
    >
      {/* Top Bar Contract: 3 zones (Brand — 4 single-line nav links — 1 primary CTA) */}
      <header className="sticky top-0 z-40 border-b border-[var(--border-hairline)] bg-[var(--surface)]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3.5 sm:px-8">
          {/* Zone 1: Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleNavigateTab('home')}
            className={`text-xl font-bold tracking-tight text-[var(--primary)] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] ${
              isRtl ? 'font-rtl' : 'font-ltr-display text-2xl'
            }`}
          >
            {content.brand}
          </button>

          {/* Zone 2: 4 Clean Single-Line Nav Links */}
          <nav
            className="hidden items-center gap-7 md:flex"
            aria-label="Primary Navigation"
          >
            {TAB_ORDER.map((tabId) => {
              const isActive = activeTab === tabId;
              return (
                <button
                  key={tabId}
                  type="button"
                  onClick={() => handleNavigateTab(tabId)}
                  className={`border-b-2 py-1 text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] ${
                    isActive
                      ? 'border-[var(--primary)] text-[var(--primary)]'
                      : 'border-transparent text-[var(--ink-muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  {content.tabs[tabId]}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <button
            type="button"
            onClick={() => handleNavigateTab('experiences')}
            className="inline-flex min-h-[38px] items-center justify-center rounded-lg bg-[var(--primary)] px-4 py-2 text-xs font-medium text-[var(--primary-ink)] transition-opacity duration-150 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] whitespace-nowrap shrink-0 cursor-pointer sm:text-sm"
          >
            {content.headerAction}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-10">
        {/* Mobile Navigation Strip (visible below md breakpoint) */}
        <nav
          className="mb-5 flex items-center gap-1 overflow-x-auto border-b border-[var(--border-hairline)] pb-3 md:hidden"
          aria-label="Mobile Navigation"
        >
          {TAB_ORDER.map((tabId) => {
            const isActive = activeTab === tabId;
            return (
              <button
                key={tabId}
                type="button"
                onClick={() => handleNavigateTab(tabId)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[var(--primary)] text-[var(--primary-ink)]'
                    : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
                }`}
              >
                {content.tabs[tabId]}
              </button>
            );
          })}
        </nav>

        {/* Editorial Utility Ribbon: Language & Theme Controls */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-hairline)] pb-4">
          <p className="text-xs text-[var(--ink-muted)]">{content.utility.editionNote}</p>

          <div className="flex flex-wrap items-center gap-3">
            {/* Language Segmented Selector */}
            <div
              className="inline-flex items-center rounded-lg border border-[var(--border-hairline)] bg-[var(--surface)] p-0.5"
              role="group"
              aria-label={content.utility.languageLabel}
            >
              {(
                [
                  { code: 'fa', label: 'فارسی' },
                  { code: 'ar', label: 'العربية' },
                  { code: 'en', label: 'English' },
                  { code: 'de', label: 'Deutsch' },
                  { code: 'es', label: 'Español' },
                  { code: 'fr', label: 'Français' },
                ] as const
              ).map((langOption) => {
                const isSelected = language === langOption.code;
                return (
                  <button
                    key={langOption.code}
                    type="button"
                    onClick={() => setLanguage(langOption.code)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--primary)] text-[var(--primary-ink)]'
                        : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {langOption.label}
                  </button>
                );
              })}
            </div>

            {/* Theme Switch */}
            <button
              type="button"
              onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-hairline)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--ink)] transition-colors hover:border-[var(--primary)] whitespace-nowrap shrink-0 cursor-pointer"
              aria-label={theme === 'light' ? content.utility.darkLabel : content.utility.lightLabel}
            >
              {theme === 'light' ? (
                <>
                  <Moon className="h-3.5 w-3.5 text-[var(--primary)]" strokeWidth={1.75} />
                  <span>{content.utility.darkLabel}</span>
                </>
              ) : (
                <>
                  <Sun className="h-3.5 w-3.5 text-[var(--gold)]" strokeWidth={1.75} />
                  <span>{content.utility.lightLabel}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Active View */}
        {activeTab === 'home' && (
          <HomeView
            content={content}
            isRtl={isRtl}
            onNavigateTab={handleNavigateTab}
            onSelectChapter={handleSelectChapter}
          />
        )}

        {activeTab === 'chapters' && (
          <ChaptersView
            content={content}
            isRtl={isRtl}
            activeChapterId={activeChapterId}
            onSelectChapter={handleSelectChapter}
            onStartReflection={handleStartReflection}
          />
        )}

        {activeTab === 'experiences' && (
          <ExperiencesView
            content={content}
            language={language}
            isRtl={isRtl}
            experiences={experiences}
            prefill={experiencePrefill}
            onAddExperience={handleAddExperience}
            onRemoveExperience={handleRemoveExperience}
          />
        )}

        {activeTab === 'colophon' && <ColophonView content={content} isRtl={isRtl} />}
      </main>

      <footer className="mt-16 border-t border-[var(--border-hairline)] bg-[var(--surface)]/60">
        <div className="mx-auto max-w-6xl space-y-1.5 px-4 py-8 text-center text-xs leading-relaxed text-[var(--ink-muted)] sm:px-8">
          <p>{content.footer.copyright}</p>
          <p className="text-[var(--gold)]">{content.footer.memory}</p>
        </div>
      </footer>
    </div>
  );
}
