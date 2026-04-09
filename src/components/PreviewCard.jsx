import React from 'react';
import { Sparkles } from 'lucide-react';

function joinClasses(...classes) {
  return classes.filter(Boolean).join(' ');
}

const layoutClasses = {
  glow: 'justify-end text-left',
  frame: 'justify-center text-center',
  split: 'justify-between text-left',
  minimal: 'justify-center text-center',
};

const patternClasses = {
  stars: 'pattern-stars',
  arches: 'pattern-arches',
  lattice: 'pattern-lattice',
  dots: 'pattern-dots',
  none: '',
};

const fontClasses = {
  amiri: { arabic: 'font-amiri', latin: 'font-inter' },
  naskh: { arabic: 'font-naskh', latin: 'font-inter' },
  cairo: { arabic: 'font-cairo', latin: 'font-cairo' },
  serif: { arabic: 'font-amiri', latin: 'font-display' },
};

export default function PreviewCard({
  id,
  item,
  palette,
  pattern,
  layout,
  fontPair,
  format,
  language,
  watermark,
  compact = false,
  showMeta = true,
}) {
  const copy = language === 'fr' ? item.fr : item.en;
  const fonts = fontClasses[fontPair] || fontClasses.amiri;
  const isStory = format === 'story';

  return (
    <article
      id={id}
      className={joinClasses(
        'group relative isolate overflow-hidden rounded-[28px] border border-white/20 shadow-[0_24px_70px_-26px_rgba(15,23,42,0.6)]',
        'transition-all duration-300',
        isStory ? 'aspect-[9/16] w-full max-w-[360px]' : 'aspect-square w-full max-w-[360px]',
        compact ? 'rounded-[24px]' : ''
      )}
      style={{
        color: palette.text,
        background: palette.gradient,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.24),transparent_42%)]" />
      <div className={joinClasses('absolute inset-0 opacity-20 mix-blend-screen', patternClasses[pattern])} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent_35%,rgba(0,0,0,0.12))]" />

      {layout === 'frame' && (
        <div className="absolute inset-4 rounded-[22px] border border-white/25" />
      )}

      {layout === 'split' && (
        <>
          <div className="absolute left-5 top-5 h-14 w-14 rounded-full border border-white/20 bg-white/10" />
          <div className="absolute bottom-5 right-5 h-20 w-20 rounded-full border border-white/20 bg-white/10" />
        </>
      )}

      <div
        className={joinClasses(
          'relative z-10 flex h-full flex-col gap-5 p-5 sm:p-6',
          layoutClasses[layout],
          layout === 'glow' && !isStory ? 'pt-9' : '',
          isStory ? 'justify-center' : ''
        )}
      >
        {showMeta && (
          <div className={joinClasses(
            'text-[11px] font-semibold uppercase tracking-[0.28em] text-current/70',
            isStory ? 'absolute inset-x-5 top-5 flex items-center justify-between' : 'flex items-center justify-between'
          )}>
            <span>{item.type === 'ayah' ? 'Quran' : 'Hadith'}</span>
            <span>{isStory ? 'Story' : 'Post'}</span>
          </div>
        )}

        <div className={joinClasses('flex flex-1 flex-col', isStory ? 'justify-center' : layout === 'glow' ? 'justify-end' : 'justify-center')}>
          <div className={joinClasses('mx-auto flex w-full max-w-[92%] flex-col gap-4', compact ? 'gap-3' : '')}>
            <p
              dir="rtl"
              className={joinClasses(
                'leading-[1.9] tracking-[0.01em] text-center',
                fonts.arabic,
                compact ? 'text-[1.55rem]' : isStory ? 'text-[1.95rem]' : 'text-[1.8rem]'
              )}
            >
              {item.ar}
            </p>

            <div className={joinClasses('mx-auto h-px w-14 rounded-full bg-current/30', compact ? 'w-10' : '')} />

            <p
              className={joinClasses(
                'leading-relaxed text-current/90 text-center',
                fonts.latin,
                compact ? 'text-[0.84rem]' : isStory ? 'text-[1.05rem]' : 'text-[0.98rem]'
              )}
            >
              {copy}
            </p>
          </div>
        </div>

        <div className={joinClasses(
          'space-y-2',
          isStory ? 'absolute inset-x-5 bottom-5 flex flex-col items-center text-center' : ''
        )}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-current/65">{item.ref}</p>
          {watermark && (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-current/80 backdrop-blur-sm">
              <Sparkles size={12} />
              MedPost
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
