'use client';

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ChevronLeft, ChevronRight, MoveRight, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { twJoin } from 'tailwind-merge';

import { LinkedIn } from '@/components/SocialIcons';

const GAP_PX = 32;

function slidesPerView(width: number) {
  if (width >= 1280) return 3;
  if (width >= 640) return 2;
  return 1;
}

function measureLayout(container: HTMLDivElement) {
  const width = container.clientWidth;
  const perView = slidesPerView(width);
  const slideWidth = perView === 1 ? width - 24 : (width - GAP_PX * (perView - 1)) / perView;
  const edgePad = Math.max(0, (width - slideWidth) / 2);
  return { slideWidth, edgePad, perView };
}

function slideAt(container: HTMLDivElement, physicalIndex: number) {
  return container.children[physicalIndex + 1] as HTMLElement;
}

function centerScrollLeft(container: HTMLDivElement, slide: HTMLElement) {
  return slide.offsetLeft - (container.clientWidth - slide.offsetWidth) / 2;
}

function updateCoverflow(container: HTMLDivElement) {
  const viewportCenter = container.scrollLeft + container.clientWidth / 2;
  const falloff = Math.max(container.clientWidth * 0.5, 1);

  for (let i = 1; i < container.children.length - 1; i++) {
    const slide = container.children[i] as HTMLElement;
    const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
    const offset = slideCenter - viewportCenter;
    const t = Math.min(1, Math.abs(offset) / falloff);

    const scale = 1 - t * 0.06;
    const rotateY = (offset / falloff) * 12;
    const opacity = 1 - t * 0.28;

    slide.style.transform = `perspective(1000px) rotateY(${rotateY.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
    slide.style.opacity = opacity.toFixed(3);
    slide.style.zIndex = String(Math.round(100 - t * 50));
  }
}

export type Endorsement = {
  name: string;
  title: string;
  relationship: string;
  quote: string;
  image: string;
  linkedin: string;
  text: string;
};

function EndorsementCard({
  name,
  title,
  quote,
  image,
  linkedin,
  onReadMore,
}: Endorsement & { onReadMore: () => void }) {
  return (
    <button
      type="button"
      tabIndex={-1}
      className={twJoin(
        'not-prose relative flex h-full w-full flex-col rounded-xl border px-6 py-5 text-left outline-none',
        'border-zinc-100 bg-white dark:border-zinc-700 dark:bg-zinc-800',
      )}
      onClick={onReadMore}
    >
      <blockquote
        className={twJoin('flex-1 text-sm leading-relaxed', 'text-zinc-700 dark:text-zinc-300')}
      >
        {quote}
        <MoveRight
          type="button"
          className="-mt-0.5 ml-0.5 inline-block size-4 cursor-pointer text-zinc-400 hover:text-teal-500"
        />
      </blockquote>
      <a
        href={linkedin}
        target="_blank"
        rel="noreferrer"
        className={twJoin('group mt-4 flex items-center outline-teal-500 transition')}
      >
        <Image
          src={image}
          alt={name}
          width={48}
          height={48}
          className={twJoin(
            'mr-2 -ml-1 size-9 shrink-0 rounded-full object-cover',
            'ring-2 ring-zinc-100 transition dark:ring-zinc-700',
            'group-hover:ring-teal-600/40 group-focus:ring-teal-500',
          )}
        />
        <div className={twJoin('min-w-0 flex-1')}>
          <p className="truncate text-sm font-bold text-zinc-800 italic transition group-hover:text-teal-500 group-focus:text-teal-500 dark:text-zinc-200 dark:group-hover:text-teal-400 dark:group-focus:text-teal-400">
            {name}
          </p>
          <p className="truncate text-xs text-zinc-500 transition group-hover:text-teal-600 group-focus:text-teal-500 dark:text-zinc-400 dark:group-hover:text-teal-400 dark:group-focus:text-teal-400">
            {title}
          </p>
        </div>
      </a>
    </button>
  );
}

function EndorsementModal({
  endorsement,
  onClose,
}: {
  endorsement: Endorsement;
  onClose: () => void;
}) {
  const paragraphs = endorsement.text.split(/\n+/).filter(Boolean);

  return (
    <Dialog open onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className={twJoin(
          'fixed inset-0 bg-zinc-800/40 backdrop-blur-sm duration-150',
          'data-[closed]:opacity-0 data-[enter]:ease-out data-[leave]:ease-in',
          'dark:bg-black/80',
        )}
      />
      <div className="fixed inset-0 overflow-y-auto p-4 sm:p-8">
        <div className="flex min-h-full items-center justify-center">
          <DialogPanel
            transition
            className={twJoin(
              'relative w-full max-w-lg rounded-xl border p-6',
              'border-zinc-100 bg-white dark:border-zinc-700 dark:bg-zinc-800',
              'duration-150 data-[closed]:scale-95 data-[closed]:opacity-0',
              'data-[enter]:ease-out data-[leave]:ease-in',
            )}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className={twJoin(
                'absolute top-4 right-4 rounded-md p-1 outline-teal-500 transition',
                'text-zinc-500 hover:text-teal-500 dark:text-zinc-400 dark:hover:text-teal-400',
              )}
            >
              <X className="size-5" aria-hidden />
            </button>

            <div className="flex items-center gap-3 pr-8">
              <Image
                src={endorsement.image}
                alt=""
                width={48}
                height={48}
                className={twJoin(
                  'size-12 shrink-0 rounded-full object-cover',
                  'ring-2 ring-zinc-100 dark:ring-zinc-700',
                )}
              />
              <div className="min-w-0 flex-1">
                <DialogTitle className="truncate text-sm font-bold text-zinc-800 italic dark:text-zinc-200">
                  {endorsement.name}
                </DialogTitle>
                <p className="truncate pl-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  {endorsement.title}
                </p>
                <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {endorsement.relationship}
                </p>
              </div>
            </div>

            <div
              className={twJoin(
                'mt-5 space-y-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300',
              )}
            >
              {paragraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

function CarouselButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => unknown;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={twJoin(
        'flex size-8 items-center justify-center rounded-md transition',
        'text-zinc-500 dark:text-zinc-400',
        'hover:bg-zinc-100 hover:text-teal-500 dark:hover:bg-zinc-800 dark:hover:text-teal-400',
        'focus:bg-zinc-100 focus:text-teal-500 focus:outline-none dark:focus:bg-zinc-800 dark:focus:text-teal-400',
      )}
    >
      {children}
    </button>
  );
}

export function Endorsements({ items }: { items: Endorsement[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const repositioningRef = useRef(false);
  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);
  const [layout, setLayout] = useState({ slideWidth: 0, edgePad: 0, perView: 1 });
  const [openItem, setOpenItem] = useState<Endorsement | null>(null);

  const loop = items.length > 1;
  const loopedItems: (Endorsement & { key: string })[] = loop
    ? Array.from({ length: 3 }, (_, copy) =>
        items.map((item) => ({ ...item, key: `${copy}-${item.linkedin}` })),
      ).flat()
    : items.map((item) => ({ ...item, key: item.linkedin }));

  const updateLayout = useCallback(() => {
    const container = scrollRef.current;
    if (!container || container.clientWidth === 0) return;
    setLayout(measureLayout(container));
  }, []);

  const getScrollBehavior = useCallback((): ScrollBehavior => {
    const container = scrollRef.current;
    if (!container) return 'smooth';
    return slidesPerView(container.clientWidth) === 1 ? 'instant' : 'smooth';
  }, []);

  const scrollToPhysical = useCallback((physicalIndex: number, behavior: ScrollBehavior) => {
    const container = scrollRef.current;
    if (!container) return;

    const slide = slideAt(container, physicalIndex);
    if (!slide) return;

    const maxScroll = container.scrollWidth - container.clientWidth;
    const target = Math.max(0, Math.min(centerScrollLeft(container, slide), maxScroll));
    container.scrollTo({ left: target, behavior });
  }, []);

  const closestPhysicalIndex = useCallback(() => {
    const container = scrollRef.current;
    if (!container || container.children.length < 3) return 0;

    const viewportCenter = container.scrollLeft + container.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;

    for (let i = 1; i < container.children.length - 1; i++) {
      const slide = container.children[i] as HTMLElement;
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const distance = Math.abs(viewportCenter - slideCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i - 1;
      }
    }

    return closestIndex;
  }, []);

  const normalizeLoop = useCallback(() => {
    if (!loop || repositioningRef.current) return;

    const n = items.length;
    const physicalIndex = closestPhysicalIndex();

    if (physicalIndex < n) {
      repositioningRef.current = true;
      scrollToPhysical(physicalIndex + n, 'instant');
      requestAnimationFrame(() => {
        repositioningRef.current = false;
      });
    } else if (physicalIndex >= 2 * n) {
      repositioningRef.current = true;
      scrollToPhysical(physicalIndex - n, 'instant');
      requestAnimationFrame(() => {
        repositioningRef.current = false;
      });
    }
  }, [closestPhysicalIndex, items.length, loop, scrollToPhysical]);

  const syncScroll = useCallback(() => {
    const container = scrollRef.current;
    if (container) updateCoverflow(container);

    const physicalIndex = closestPhysicalIndex();
    const logicalIndex = loop ? physicalIndex % items.length : physicalIndex;
    indexRef.current = logicalIndex;
    setIndex(logicalIndex);
  }, [closestPhysicalIndex, items.length, loop]);

  const scrollTo = useCallback(
    (logicalIndex: number) => {
      scrollToPhysical(
        loop ? items.length + logicalIndex : logicalIndex,
        getScrollBehavior(),
      );
    },
    [getScrollBehavior, items.length, loop, scrollToPhysical],
  );

  const scrollByCard = useCallback(
    (direction: -1 | 1) => {
      scrollToPhysical(closestPhysicalIndex() + direction, getScrollBehavior());
    },
    [closestPhysicalIndex, getScrollBehavior, scrollToPhysical],
  );

  const settleScroll = useCallback(() => {
    normalizeLoop();
    requestAnimationFrame(() => {
      if (repositioningRef.current) return;
      const container = scrollRef.current;
      if (!container) return;

      const physical = closestPhysicalIndex();
      const slide = slideAt(container, physical);
      if (slide) {
        const target = centerScrollLeft(container, slide);
        const maxScroll = container.scrollWidth - container.clientWidth;
        const clamped = Math.max(0, Math.min(target, maxScroll));
        if (Math.abs(container.scrollLeft - clamped) > 2) {
          scrollToPhysical(physical, 'instant');
        }
      }

      updateCoverflow(container);
      syncScroll();
    });
  }, [closestPhysicalIndex, normalizeLoop, scrollToPhysical, syncScroll]);

  useLayoutEffect(() => {
    updateLayout();
    const container = scrollRef.current;
    if (container) updateCoverflow(container);
  }, [items.length, updateLayout]);

  useLayoutEffect(() => {
    if (layout.slideWidth === 0) return;
    scrollToPhysical(loop ? items.length + indexRef.current : indexRef.current, 'instant');
  }, [items.length, layout.slideWidth, layout.edgePad, loop, scrollToPhysical]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    syncScroll();

    let scrollEndTimer: ReturnType<typeof setTimeout>;

    const onScroll = () => {
      syncScroll();
      clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(settleScroll, 120);
    };
    container.addEventListener('scroll', onScroll, { passive: true });

    const onScrollEnd = () => {
      clearTimeout(scrollEndTimer);
      settleScroll();
    };
    container.addEventListener('scrollend', onScrollEnd);

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return;
      e.preventDefault();
      window.scrollBy({ top: e.deltaY });
    };
    container.addEventListener('wheel', onWheel, { passive: false });

    const resizeObserver = new ResizeObserver(() => {
      updateLayout();
      requestAnimationFrame(settleScroll);
    });
    resizeObserver.observe(container);

    return () => {
      clearTimeout(scrollEndTimer);
      container.removeEventListener('scroll', onScroll);
      container.removeEventListener('scrollend', onScrollEnd);
      container.removeEventListener('wheel', onWheel);
      resizeObserver.disconnect();
    };
  }, [items.length, loop, scrollToPhysical, settleScroll, syncScroll, updateLayout]);

  if (items.length === 0) return null;

  const showControls = items.length > 1;

  return (
    <section aria-labelledby="endorsements-heading" className="mt-14 w-full">
      <div
        className={twJoin(
          'prose-wrap mb-2',
          'flex flex-wrap items-center justify-center gap-x-8 gap-y-2 min-[30rem]:justify-between',
        )}
      >
        <h2
          id="endorsements-heading"
          className="text-base font-extrabold text-zinc-800 uppercase dark:text-zinc-200"
        >
          Endorsements
        </h2>
        <a
          href={'https://www.linkedin.com/in/tobiaslohse/details/recommendations/'}
          target="_blank"
          rel="noreferrer"
          className={twJoin(
            'group flex items-center text-xs text-zinc-400 italic no-underline',
            'rounded-md px-1.5 py-0.5 outline-teal-500 transition',
            'hover:text-teal-500 focus:text-teal-500 dark:text-zinc-600 dark:hover:text-teal-400',
            'hover:bg-teal-50 focus:bg-teal-50 dark:hover:bg-teal-900/30 dark:focus:bg-teal-900/30',
            'border border-transparent hover:border-teal-500/10 focus:border-teal-500/30',
          )}
        >
          View on LinkedIn
          <LinkedIn className="mt-px ml-1.5 size-3.5 text-zinc-300 transition group-hover:text-teal-500 group-focus:text-teal-500 dark:text-zinc-700" />
        </a>
      </div>

      <div
        className={twJoin(
          'overflow-hidden border-y border-zinc-100 bg-zinc-50 py-8 dark:border-zinc-700 dark:bg-zinc-900',
        )}
      >
        <div
          ref={scrollRef}
          className={twJoin(
            'flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-auto sm:scroll-smooth',
            '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
            '[perspective:1000px]',
          )}
          style={{ gap: GAP_PX }}
        >
          <div aria-hidden className="shrink-0" style={{ width: layout.edgePad }} />
          {loopedItems.map(({ key, ...item }) => (
            <div
              key={key}
              className={twJoin(
                'flex shrink-0 origin-center snap-center snap-always will-change-transform',
                '[backface-visibility:hidden] [transform-style:preserve-3d]',
              )}
              style={{ width: layout.slideWidth > 0 ? layout.slideWidth : '100%' }}
            >
              <EndorsementCard {...item} onReadMore={() => setOpenItem(item)} />
            </div>
          ))}
          <div aria-hidden className="shrink-0" style={{ width: layout.edgePad }} />
        </div>
      </div>

      {showControls && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <CarouselButton label="Previous endorsement" onClick={() => scrollByCard(-1)}>
            <ChevronLeft className="size-5" />
          </CarouselButton>
          <div className="flex gap-2" role="tablist" aria-label="Endorsement slides">
            {items.map((item, i) => (
              <button
                key={item.linkedin}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show endorsement from ${item.name}`}
                onClick={() => scrollTo(i)}
                className={twJoin(
                  'size-2 rounded-full transition',
                  i === index
                    ? 'bg-teal-500 dark:bg-teal-400'
                    : 'bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-600 dark:hover:bg-zinc-500',
                )}
              />
            ))}
          </div>
          <CarouselButton label="Next endorsement" onClick={() => scrollByCard(1)}>
            <ChevronRight className="size-5" />
          </CarouselButton>
        </div>
      )}
      {openItem && <EndorsementModal endorsement={openItem} onClose={() => setOpenItem(null)} />}
    </section>
  );
}
