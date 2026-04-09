import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toPng } from 'html-to-image';
import {
  Bookmark,
  Check,
  Copy,
  Download,
  Heart,
  Home,
  Languages,
  LayoutGrid,
  Moon,
  RefreshCcw,
  Sparkles,
  Sun,
} from 'lucide-react';
import PreviewCard from './components/PreviewCard';
import { useContent } from './hooks/useContent';

const STORAGE_KEYS = {
  favorites: 'medpost-favorites',
  theme: 'medpost-theme',
};

const PALETTES = [
  { id: 'emerald', name: 'Emerald Glow', gradient: 'linear-gradient(135deg, #064e3b 0%, #059669 52%, #6ee7b7 100%)', text: '#f0fdf4' },
  { id: 'sapphire', name: 'Sapphire Night', gradient: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 55%, #93c5fd 100%)', text: '#eff6ff' },
  { id: 'sunset', name: 'Sunset Sand', gradient: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 48%, #fdba74 100%)', text: '#fff7ed' },
  { id: 'rose', name: 'Rose Dusk', gradient: 'linear-gradient(135deg, #4c0519 0%, #be185d 50%, #f9a8d4 100%)', text: '#fff1f2' },
  { id: 'amethyst', name: 'Amethyst', gradient: 'linear-gradient(135deg, #3b0764 0%, #7c3aed 50%, #c4b5fd 100%)', text: '#faf5ff' },
  { id: 'oasis', name: 'Oasis', gradient: 'linear-gradient(135deg, #083344 0%, #0891b2 48%, #67e8f9 100%)', text: '#ecfeff' },
  { id: 'olive', name: 'Olive Gold', gradient: 'linear-gradient(135deg, #3f6212 0%, #84cc16 45%, #fde68a 100%)', text: '#fefce8' },
  { id: 'obsidian', name: 'Obsidian', gradient: 'linear-gradient(135deg, #020617 0%, #1e293b 52%, #64748b 100%)', text: '#f8fafc' },
  { id: 'pearl', name: 'Pearl Light', gradient: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 58%, #cbd5e1 100%)', text: '#0f172a' },
  { id: 'desert', name: 'Desert Bloom', gradient: 'linear-gradient(135deg, #78350f 0%, #d97706 52%, #fef3c7 100%)', text: '#fffbeb' },
  { id: 'midnight', name: 'Midnight Sky', gradient: 'linear-gradient(135deg, #0f172a 0%, #131a40 50%, #2e2f66 100%)', text: '#edf2ff' },
  { id: 'coral', name: 'Coral Sunset', gradient: 'linear-gradient(135deg, #7b341e 0%, #fb7185 55%, #fcd34d 100%)', text: '#ffffff' },
  { id: 'lavender', name: 'Lavender Mist', gradient: 'linear-gradient(135deg, #322659 0%, #6d28d9 50%, #c4b5fd 100%)', text: '#f8fafc' },
  { id: 'forest', name: 'Forest Dawn', gradient: 'linear-gradient(135deg, #0f3d24 0%, #166534 50%, #a7f3d0 100%)', text: '#f8fafc' },
  { id: 'solar', name: 'Solar Flare', gradient: 'linear-gradient(135deg, #b45309 0%, #f97316 50%, #fde68a 100%)', text: '#1f2937' },
];

const PATTERNS = [
  { id: 'arches', name: 'Arches' },
  { id: 'lattice', name: 'Lattice' },
  { id: 'stars', name: 'Stars' },
  { id: 'dots', name: 'Dots' },
  { id: 'none', name: 'Clean' },
];

const LAYOUTS = [
  { id: 'glow', name: 'Glow' },
  { id: 'frame', name: 'Frame' },
  { id: 'split', name: 'Split' },
  { id: 'minimal', name: 'Minimal' },
];

const FONT_PAIRS = [
  { id: 'amiri', name: 'Amiri' },
  { id: 'naskh', name: 'Naskh' },
  { id: 'cairo', name: 'Cairo' },
  { id: 'serif', name: 'Serif Mix' },
];

const TABS = [
  { id: 'generator', label: 'Generator', icon: Sparkles },
  { id: 'explore', label: 'Explore', icon: Home },
  { id: 'favorites', label: 'Favorites', icon: Heart },
];

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function readLocalJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

async function exportNode(node, filename) {
  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: 3,
    skipFonts: false,
    backgroundColor: '#ffffff',
  });
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

function buildCaption(item, language) {
  const translation = language === 'fr' ? item.fr : item.en;
  return `${item.ar}\n\n${translation}\n${item.ref}`;
}

function LayoutPill({ active, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex min-w-[92px] items-center justify-center rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
        active
          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:border-emerald-400 dark:text-emerald-300'
          : 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'
      }`}
    >
      {label}
    </button>
  );
}

function MiniPreview({ active }) {
  return (
    <span className={`grid h-8 w-8 place-items-center rounded-xl border ${active ? 'border-current bg-current/10' : 'border-current/30'}`}>
      <span className="grid h-4 w-4 grid-cols-2 gap-0.5">
        <span className="rounded-sm bg-current/80" />
        <span className="rounded-sm bg-current/50" />
        <span className="rounded-sm bg-current/60" />
        <span className="rounded-sm bg-current/35" />
      </span>
    </span>
  );
}

export default function App() {
  const { collections, loading, error, getRandomItem } = useContent();
  const previewRef = useRef(null);
  const [activeTab, setActiveTab] = useState('generator');
  const [contentType, setContentType] = useState('random');
  const [format, setFormat] = useState('square');
  const [language, setLanguage] = useState('en');
  const [palette, setPalette] = useState(PALETTES[0]);
  const [pattern, setPattern] = useState(PATTERNS[0].id);
  const [layout, setLayout] = useState(LAYOUTS[0].id);
  const [fontPair, setFontPair] = useState(FONT_PAIRS[0].id);
  const [watermark, setWatermark] = useState(true);
  const [currentItem, setCurrentItem] = useState(null);
  const [batchPosts, setBatchPosts] = useState([]);
  const [controlsOpen, setControlsOpen] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [theme, setTheme] = useState('system');
  const [resolvedTheme, setResolvedTheme] = useState('light');
  const [deferredInstall, setDeferredInstall] = useState(null);

  useEffect(() => {
    setFavorites(readLocalJson(STORAGE_KEYS.favorites, []));
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme) || 'system';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.theme, theme);
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = () => {
      const next = theme === 'system' ? (media.matches ? 'dark' : 'light') : theme;
      setResolvedTheme(next);
      document.documentElement.classList.toggle('dark', next === 'dark');
    };
    applyTheme();
    media.addEventListener('change', applyTheme);
    return () => media.removeEventListener('change', applyTheme);
  }, [theme]);

  useEffect(() => {
    const onBeforeInstall = (event) => {
      event.preventDefault();
      setDeferredInstall(event);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  const favoritePosts = useMemo(
    () => collections.all.filter((item) => favorites.includes(item.id)),
    [collections.all, favorites]
  );

  const randomizeDesign = () => {
    setPalette(randomFrom(PALETTES));
    setPattern(randomFrom(PATTERNS).id);
    setLayout(randomFrom(LAYOUTS).id);
    setFontPair(randomFrom(FONT_PAIRS).id);
  };

  const generateRandom = () => {
    const next = getRandomItem(contentType, currentItem?.id);
    if (!next) return;
    setCurrentItem(next);
    randomizeDesign();
  };

  const generateBatch = () => {
    const list = Array.from({ length: 5 }, (_, index) => {
      const item = getRandomItem(contentType, index === 0 ? currentItem?.id : undefined);
      return {
        item,
        palette: randomFrom(PALETTES),
        pattern: randomFrom(PATTERNS).id,
        layout: randomFrom(LAYOUTS).id,
        fontPair: randomFrom(FONT_PAIRS).id,
        format,
      };
    }).filter((entry) => entry.item);
    setBatchPosts(list);
    if (list[0]) {
      setCurrentItem(list[0].item);
      setPalette(list[0].palette);
      setPattern(list[0].pattern);
      setLayout(list[0].layout);
      setFontPair(list[0].fontPair);
    }
    setActiveTab('explore');
  };

  useEffect(() => {
    if (!loading && collections.all.length && !currentItem) {
      setCurrentItem(getRandomItem('random'));
    }
  }, [loading, collections.all, currentItem, getRandomItem]);

  const handleDownloadCurrent = async () => {
    if (!previewRef.current || !currentItem) return;
    setDownloading(true);
    try {
      await exportNode(previewRef.current, `medpost-${currentItem.type}-${Date.now()}.png`);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadBatch = async (index) => {
    const node = document.getElementById(`batch-card-${index}`);
    if (!node || !batchPosts[index]) return;
    await exportNode(node, `medpost-batch-${index + 1}.png`);
  };

  const handleCopyCaption = async () => {
    if (!currentItem) return;
    await navigator.clipboard.writeText(buildCaption(currentItem, language));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [id, ...current]
    );
  };

  const installApp = async () => {
    if (!deferredInstall) return;
    await deferredInstall.prompt();
    setDeferredInstall(null);
  };

  const themeIcon =
    theme === 'system' ? <Languages size={18} /> : resolvedTheme === 'dark' ? <Moon size={18} /> : <Sun size={18} />;

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-100 text-slate-700 dark:bg-slate-950 dark:text-slate-100">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="h-12 w-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          />
          <p className="text-sm font-medium">Loading MedPost...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-full flex-col pb-[calc(env(safe-area-inset-bottom)+180px)] lg:max-w-screen-xl lg:px-6">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-100/85 px-4 pb-3 pt-4 backdrop-blur-xl dark:bg-slate-950/85">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600 dark:text-emerald-300">
                MedPost
              </p>
              <h1 className="mt-1 text-2xl font-bold hidden sm:block">Islamic Post Generator</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
                Generate fast, mobile-ready ayah and hadith posts.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTheme((current) => (current === 'system' ? 'light' : current === 'light' ? 'dark' : 'system'))}
                className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                aria-label="Toggle theme"
              >
                {themeIcon}
              </button>
              {deferredInstall && (
                <button
                  onClick={installApp}
                  className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20"
                >
                  Install
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 px-3 pb-6 pt-3">
          {error && (
            <div className="mb-4 rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
              {error}
            </div>
          )}

          {activeTab === 'generator' && currentItem && (
            <div className="space-y-4 lg:grid lg:grid-cols-[minmax(360px,44%)_minmax(420px,56%)] lg:items-start lg:gap-6">
              <div className="space-y-4 order-2 lg:order-1">
                <section className="grid grid-cols-2 gap-3">
                  <button
                    onClick={generateRandom}
                    className="col-span-2 flex h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 active:scale-[0.99] sm:h-14 sm:text-base"
                  >
                    <Sparkles size={18} />
                    Generate Random
                  </button>
                  <button
                    onClick={generateBatch}
                    className="flex h-10 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-semibold shadow-sm dark:border-slate-800 dark:bg-slate-900"
                  >
                    <LayoutGrid size={18} />
                    Generate 5 Posts
                  </button>
                  <button
                    onClick={handleCopyCaption}
                    className="flex h-10 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-semibold shadow-sm dark:border-slate-800 dark:bg-slate-900"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? 'Copied' : 'Copy Caption'}
                  </button>
                </section>

                <section className="rounded-[28px] bg-white p-3 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                        Controls
                      </p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Thumb-friendly design settings
                      </p>
                    </div>
                    <button
                      onClick={() => setControlsOpen((current) => !current)}
                      className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold dark:border-slate-800"
                    >
                      {controlsOpen ? 'Collapse' : 'Expand'}
                    </button>
                  </div>

                  <AnimatePresence initial={false}>
                    {controlsOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-5 space-y-5">
                          <div>
                            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                              Step 1 · Choose format
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                              {[
                                {
                                  id: 'square',
                                  label: 'Post',
                                  description: 'Optimized for Facebook / Instagram feed',
                                },
                                {
                                  id: 'story',
                                  label: 'Story',
                                  description: 'Optimized for Facebook / Instagram story',
                                },
                              ].map((option) => (
                                <button
                                  key={option.id}
                                  onClick={() => setFormat(option.id)}
                                  className={`rounded-2xl border px-4 py-4 text-left transition ${
                                    format === option.id
                                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:border-emerald-400 dark:text-emerald-300'
                                      : 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200'
                                  }`}
                                >
                                  <p className="text-sm font-semibold">{option.label}</p>
                                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{option.description}</p>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                              Step 2 · Select content
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                              {['ayah', 'hadith', 'random'].map((type) => (
                                <button
                                  key={type}
                                  onClick={() => setContentType(type)}
                                  className={`rounded-2xl px-3 py-3 text-sm font-semibold capitalize transition ${
                                    contentType === type
                                      ? 'bg-emerald-500 text-white'
                                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                                  }`}
                                >
                                  {type}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                              Step 3 · Palette
                            </p>
                            <div className="grid grid-cols-2 gap-3 pb-1 sm:grid-cols-3 lg:grid-cols-5">
                              {PALETTES.map((entry) => (
                                <button
                                  key={entry.id}
                                  onClick={() => setPalette(entry)}
                                  className={`flex flex-col items-start gap-3 rounded-3xl border p-3 text-left ${
                                    palette.id === entry.id
                                      ? 'border-emerald-500 bg-emerald-500/10'
                                      : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950'
                                  }`}
                                >
                                  <span className="h-12 w-full rounded-2xl" style={{ background: entry.gradient }} />
                                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{entry.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                              Step 4 · Pattern
                            </p>
                            <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
                              {PATTERNS.map((entry) => (
                                <LayoutPill
                                  key={entry.id}
                                  active={pattern === entry.id}
                                  label={entry.name}
                                  onClick={() => setPattern(entry.id)}
                                />
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                              Step 5 · Layout
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                              {LAYOUTS.map((entry) => (
                                <button
                                  key={entry.id}
                                  onClick={() => setLayout(entry.id)}
                                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left ${
                                    layout === entry.id
                                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'
                                      : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950'
                                  }`}
                                >
                                  <span className="text-sm font-semibold">{entry.name}</span>
                                  <MiniPreview active={layout === entry.id} />
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                              Step 6 · Font
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                              {FONT_PAIRS.map((entry) => (
                                <button
                                  key={entry.id}
                                  onClick={() => setFontPair(entry.id)}
                                  className={`rounded-2xl border px-4 py-3 text-left ${
                                    fontPair === entry.id
                                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'
                                      : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950'
                                  }`}
                                >
                                  <p className="text-sm font-semibold">{entry.name}</p>
                                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Arabic + translation pairing</p>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => setLanguage((current) => (current === 'en' ? 'fr' : 'en'))}
                              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold dark:border-slate-800 dark:bg-slate-950"
                            >
                              <Languages size={16} />
                              {language === 'en' ? 'English' : 'Français'}
                            </button>
                            <button
                              onClick={() => toggleFavorite(currentItem.id)}
                              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold dark:border-slate-800 dark:bg-slate-950"
                            >
                              <Heart size={16} className={favorites.includes(currentItem.id) ? 'fill-current text-rose-500' : ''} />
                              Favorite
                            </button>
                            <button
                              onClick={() => setWatermark((current) => !current)}
                              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold dark:border-slate-800 dark:bg-slate-950"
                            >
                              <Bookmark size={16} />
                              {watermark ? 'Watermark On' : 'Watermark Off'}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </section>
              </div>

              <motion.section
                layout
                className="order-1 lg:order-2 lg:sticky lg:self-start lg:top-24 rounded-[32px] bg-white/70 p-3 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.45)] ring-1 ring-black/5 backdrop-blur-sm dark:bg-slate-900/75 dark:ring-white/10"
              >
                <div ref={previewRef} className="mx-auto w-full max-w-[360px] lg:max-w-[520px]">
                  <PreviewCard
                    id="main-preview-card"
                    item={currentItem}
                    palette={palette}
                    pattern={pattern}
                    layout={layout}
                    fontPair={fontPair}
                    format={format}
                    language={language}
                    watermark={watermark}
                  />
                </div>
              </motion.section>
            </div>
          )}

          {activeTab === 'explore' && (
            <section className="space-y-4">
              <div className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">Random Feed</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Tap any card to load it into the live generator.
                    </p>
                  </div>
                  <button
                    onClick={generateBatch}
                    className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 text-sm font-semibold text-white"
                  >
                    <RefreshCcw size={16} />
                    Refresh 5
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {batchPosts.map((entry, index) => (
                  <div key={`${entry.item.id}-${index}`} className="space-y-2">
                    <button
                      onClick={() => {
                        setCurrentItem(entry.item);
                        setPalette(entry.palette);
                        setPattern(entry.pattern);
                        setLayout(entry.layout);
                        setFontPair(entry.fontPair);
                        setActiveTab('generator');
                      }}
                      className="w-full text-left"
                    >
                      <PreviewCard
                        id={`batch-card-${index}`}
                        item={entry.item}
                        palette={entry.palette}
                        pattern={entry.pattern}
                        layout={entry.layout}
                        fontPair={entry.fontPair}
                        format={entry.format}
                        language={language}
                        watermark={watermark}
                        compact
                        showMeta={false}
                      />
                    </button>
                    <button
                      onClick={() => handleDownloadBatch(index)}
                      className="flex h-10 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-semibold dark:border-slate-800 dark:bg-slate-900"
                    >
                      <Download size={16} />
                      Download
                    </button>
                  </div>
                ))}
              </div>
              {!batchPosts.length && (
                <div className="rounded-[28px] border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  Generate 5 posts to fill your explore feed.
                </div>
              )}
            </section>
          )}

          {activeTab === 'favorites' && (
            <section className="space-y-4">
              <div className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-slate-800">
                <h2 className="text-lg font-semibold">Saved Favorites</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Stored locally on this device for quick reuse.
                </p>
              </div>

              <div className="space-y-3">
                {favoritePosts.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentItem(item);
                      setActiveTab('generator');
                    }}
                    className="w-full rounded-[24px] bg-white p-4 text-left shadow-sm ring-1 ring-slate-200/70 transition hover:-translate-y-0.5 dark:bg-slate-900 dark:ring-slate-800"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                          {item.type === 'ayah' ? 'Ayah' : 'Hadith'}
                        </p>
                        <p dir="rtl" className="mt-2 font-amiri text-xl leading-loose">
                          {item.ar}
                        </p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                          {language === 'fr' ? item.fr : item.en}
                        </p>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          {item.ref}
                        </p>
                      </div>
                      <Heart className="fill-rose-500 text-rose-500" size={18} />
                    </div>
                  </button>
                ))}
              </div>

              {!favoritePosts.length && (
                <div className="rounded-[28px] border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  Save a few posts from the generator to build your favorites collection.
                </div>
              )}
            </section>
          )}
        </main>

        {currentItem && (
          <div className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+88px)] z-40 mx-auto w-full max-w-full px-4 lg:max-w-screen-xl lg:px-6">
            <div className="pointer-events-auto rounded-[28px] bg-white/92 p-3 shadow-[0_22px_60px_-24px_rgba(15,23,42,0.55)] ring-1 ring-black/5 backdrop-blur-xl dark:bg-slate-900/92 dark:ring-white/10">
              <div className="grid grid-cols-2 gap-3 lg:max-w-3xl lg:mx-auto">
                <button
                  onClick={generateRandom}
                  className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 text-sm font-semibold text-white"
                >
                  <Sparkles size={16} />
                  Generate
                </button>
                <button
                  onClick={handleDownloadCurrent}
                  disabled={downloading}
                  className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-semibold dark:border-slate-800 dark:bg-slate-950"
                >
                  {downloading ? <RefreshCcw size={16} className="animate-spin" /> : <Download size={16} />}
                  Quick Download
                </button>
              </div>
            </div>
          </div>
        )}

        <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto flex w-full max-w-full gap-2 border-t border-white/10 bg-white/92 px-4 pb-[calc(env(safe-area-inset-bottom)+18px)] pt-3 backdrop-blur-xl dark:bg-slate-950/94 lg:max-w-screen-xl lg:px-6">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-xs font-semibold transition ${
                  active
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
