'use client';

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ChevronLeft, ChevronRight, MoveRight, X } from 'lucide-react';
import Image, { type StaticImageData } from 'next/image';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { twJoin } from 'tailwind-merge';

import { LinkedIn } from '@/components/SocialIcons';

const GAP_PX = 32;
const SCROLL_END_DEBOUNCE_MS = 140;

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

// Rect-based so it works regardless of the slide's offsetParent: the scroll
// container is position:static, so slide.offsetLeft is NOT in the container's
// scroll coordinate space. Deriving the target from the current scrollLeft plus
// the visual gap to center keeps us exactly on the snap point (no snap-back).
function centerScrollLeft(container: HTMLDivElement, slide: HTMLElement) {
  const containerRect = container.getBoundingClientRect();
  const slideRect = slide.getBoundingClientRect();
  const delta =
    slideRect.left - containerRect.left - (container.clientWidth - slide.offsetWidth) / 2;
  return container.scrollLeft + delta;
}

function closestPhysicalIndex(container: HTMLDivElement) {
  const containerRect = container.getBoundingClientRect();
  const viewportCenter = containerRect.left + container.clientWidth / 2;
  let closestIndex = 0;
  let closestDistance = Infinity;

  for (let i = 1; i < container.children.length - 1; i++) {
    const slide = container.children[i] as HTMLElement;
    const slideRect = slide.getBoundingClientRect();
    const slideCenter = slideRect.left + slide.offsetWidth / 2;
    const distance = Math.abs(viewportCenter - slideCenter);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = i - 1;
    }
  }

  return closestIndex;
}

export type Endorsement = {
  name: string;
  title: string;
  relationship: string;
  quote: string;
  image: StaticImageData;
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
        {quote.slice(0, quote.lastIndexOf(' ') + 1)}
        <span className="whitespace-nowrap">
          {quote.slice(quote.lastIndexOf(' ') + 1)}
          <MoveRight
            type="button"
            className="-mt-0.5 ml-0.5 inline-block size-4 cursor-pointer text-zinc-400 hover:text-teal-500"
          />
        </span>
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
                alt={endorsement.name}
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

export function Endorsements({
  endorsements,
  className,
}: {
  endorsements: Endorsement[];
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigatingRef = useRef(false);
  const pendingScrollLeftRef = useRef<number | null>(null);
  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);
  const [layout, setLayout] = useState({ slideWidth: 0, edgePad: 0, perView: 1 });
  const [openItem, setOpenItem] = useState<Endorsement | null>(null);

  const loop = endorsements.length > 1;
  const loopedItems: (Endorsement & { key: string; copy: number; logicalIndex: number })[] = loop
    ? Array.from({ length: 3 }, (_, copy) =>
        endorsements.map((item, logicalIndex) => ({
          ...item,
          key: `${copy}-${item.linkedin}`,
          copy,
          logicalIndex,
        })),
      ).flat()
    : endorsements.map((item, logicalIndex) => ({
        ...item,
        key: item.linkedin,
        copy: 0,
        logicalIndex,
      }));

  const updateLayout = useCallback(() => {
    const container = scrollRef.current;
    if (!container || container.clientWidth === 0) return;
    setLayout(measureLayout(container));
  }, []);

  const targetScrollLeft = useCallback((physicalIndex: number) => {
    const container = scrollRef.current;
    if (!container) return 0;

    const slide = slideAt(container, physicalIndex);
    if (!slide) return 0;

    const maxScroll = container.scrollWidth - container.clientWidth;
    return Math.max(0, Math.min(centerScrollLeft(container, slide), maxScroll));
  }, []);

  const scrollBehavior = useCallback((): ScrollBehavior => {
    const container = scrollRef.current;
    if (!container) return 'smooth';
    return slidesPerView(container.clientWidth) === 1 ? 'instant' : 'smooth';
  }, []);

  const finishNavScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container || !navigatingRef.current) return;

    const target = pendingScrollLeftRef.current;
    container.style.scrollSnapType = '';
    if (target !== null) container.scrollLeft = target;
    navigatingRef.current = false;
    pendingScrollLeftRef.current = null;
  }, []);

  const repositionLoop = useCallback(() => {
    if (!loop || navigatingRef.current) return;

    const container = scrollRef.current;
    if (!container || layout.slideWidth === 0) return;

    const n = endorsements.length;
    const cycleWidth = n * (layout.slideWidth + GAP_PX);
    const physical = closestPhysicalIndex(container);

    if (physical < n) {
      container.scrollLeft += cycleWidth;
    } else if (physical >= 2 * n) {
      container.scrollLeft -= cycleWidth;
    }
  }, [endorsements.length, layout.slideWidth, loop]);

  const scrollToLeft = useCallback(
    (targetLeft: number, behavior: ScrollBehavior) => {
      const container = scrollRef.current;
      if (!container) return;

      if (behavior === 'smooth') {
        navigatingRef.current = true;
        pendingScrollLeftRef.current = targetLeft;
        container.style.scrollSnapType = 'none';
        container.scrollTo({ left: targetLeft, behavior: 'smooth' });
        return;
      }

      container.scrollTo({ left: targetLeft, behavior: 'instant' });
      repositionLoop();
    },
    [repositionLoop],
  );

  const scrollToPhysical = useCallback(
    (physicalIndex: number) => {
      scrollToLeft(targetScrollLeft(physicalIndex), scrollBehavior());
    },
    [scrollBehavior, scrollToLeft, targetScrollLeft],
  );

  const scrollTo = useCallback(
    (logicalIndex: number) => {
      scrollToPhysical(loop ? endorsements.length + logicalIndex : logicalIndex);
    },
    [endorsements.length, loop, scrollToPhysical],
  );

  const scrollByCard = useCallback(
    (direction: -1 | 1) => {
      const container = scrollRef.current;
      if (!container) return;
      scrollToPhysical(closestPhysicalIndex(container) + direction);
    },
    [scrollToPhysical],
  );

  useLayoutEffect(() => {
    updateLayout();
  }, [endorsements.length, updateLayout]);

  useLayoutEffect(() => {
    if (layout.slideWidth === 0) return;
    const container = scrollRef.current;
    if (!container) return;
    container.scrollLeft = targetScrollLeft(
      loop ? endorsements.length + indexRef.current : indexRef.current,
    );
  }, [endorsements.length, layout.slideWidth, layout.edgePad, loop, targetScrollLeft]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const slidesToObserve = loop
      ? container.querySelectorAll<HTMLElement>('[data-carousel-copy="1"]')
      : container.querySelectorAll<HTMLElement>('[data-carousel-slide]');

    const observer = new IntersectionObserver(
      (entries) => {
        const centered = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!centered) return;

        const logical = Number((centered.target as HTMLElement).dataset.logicalIndex);
        if (Number.isNaN(logical)) return;

        indexRef.current = logical;
        setIndex(logical);
      },
      { root: container, rootMargin: '0px -50% 0px -50%', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    slidesToObserve.forEach((slide) => observer.observe(slide));

    let scrollEndTimer: ReturnType<typeof setTimeout>;

    const onScrollEnd = () => {
      clearTimeout(scrollEndTimer);
      finishNavScroll();
      repositionLoop();
    };
    container.addEventListener('scrollend', onScrollEnd);

    const onScroll = () => {
      clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => {
        finishNavScroll();
        repositionLoop();
      }, SCROLL_END_DEBOUNCE_MS);
    };
    container.addEventListener('scroll', onScroll, { passive: true });

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return;
      e.preventDefault();
      window.scrollBy({ top: e.deltaY });
    };
    container.addEventListener('wheel', onWheel, { passive: false });

    const resizeObserver = new ResizeObserver(() => {
      updateLayout();
      requestAnimationFrame(() => {
        const c = scrollRef.current;
        if (!c || measureLayout(c).slideWidth === 0) return;
        c.scrollLeft = targetScrollLeft(
          loop ? endorsements.length + indexRef.current : indexRef.current,
        );
      });
    });
    resizeObserver.observe(container);

    return () => {
      clearTimeout(scrollEndTimer);
      observer.disconnect();
      container.removeEventListener('scroll', onScroll);
      container.removeEventListener('scrollend', onScrollEnd);
      container.removeEventListener('wheel', onWheel);
      resizeObserver.disconnect();
    };
  }, [finishNavScroll, endorsements.length, loop, repositionLoop, targetScrollLeft, updateLayout]);

  if (endorsements.length === 0) return null;

  const showControls = endorsements.length > 1;

  return (
    <section aria-labelledby="endorsements-heading" className={className}>
      <div
        className={twJoin(
          'prose-wrap mb-3',
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
            'flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-auto',
            '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          )}
          style={{ gap: GAP_PX }}
        >
          <div aria-hidden className="shrink-0" style={{ width: layout.edgePad }} />
          {loopedItems.map(({ key, copy, logicalIndex, ...item }) => (
            <div
              key={key}
              data-carousel-slide
              data-carousel-copy={String(copy)}
              data-logical-index={logicalIndex}
              className={twJoin('coverflow-item flex shrink-0 snap-center snap-always')}
              style={{ width: layout.slideWidth > 0 ? layout.slideWidth : '100%' }}
            >
              <div className="coverflow-card h-full w-full">
                <EndorsementCard {...item} onReadMore={() => setOpenItem(item)} />
              </div>
            </div>
          ))}
          <div aria-hidden className="shrink-0" style={{ width: layout.edgePad }} />
        </div>
      </div>

      {showControls && (
        <div className="mt-2 flex items-center justify-center gap-3">
          <CarouselButton label="Previous endorsement" onClick={() => scrollByCard(-1)}>
            <ChevronLeft className="size-5" />
          </CarouselButton>
          <div className="flex gap-2" role="tablist" aria-label="Endorsement slides">
            {endorsements.map((item, i) => (
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
