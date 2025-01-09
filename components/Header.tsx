'use client';

import { Popover, PopoverBackdrop, PopoverButton, PopoverPanel } from '@headlessui/react';
import { ChevronDown, MoonStar, Sun, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { twJoin } from 'tailwind-merge';

import AvatarImage from '@/components/Avatar';

function MobileNavigation({ links }: { links: { href: string; name: string }[] }) {
  return (
    <Popover className="pointer-events-auto md:hidden">
      <PopoverButton
        className={twJoin(
          'text-sm font-medium text-zinc-800 dark:text-zinc-200',
          'group flex items-center rounded-full bg-white/90 px-4 py-2 backdrop-blur dark:bg-zinc-800/90',
          'ring-1 shadow-lg shadow-zinc-800/5 ring-zinc-900/5 dark:ring-white/10',
          'transition hover:ring-zinc-900/10 dark:hover:ring-white/20',
        )}
      >
        Menu
        <ChevronDown className="mt-0.5 ml-3 h-auto w-3 stroke-zinc-500 group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-400" />
      </PopoverButton>
      <PopoverBackdrop
        transition
        className="fixed inset-0 z-50 bg-zinc-800/40 backdrop-blur-sm duration-150 data-[closed]:opacity-0 data-[enter]:ease-out data-[leave]:ease-in dark:bg-black/80"
      />
      <PopoverPanel
        focus
        transition
        className="fixed inset-x-4 top-8 z-50 origin-top rounded-3xl bg-white p-8 ring-1 ring-zinc-900/5 duration-150 data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:ease-out data-[leave]:ease-in dark:bg-zinc-900 dark:ring-zinc-800"
      >
        <div className="flex flex-row-reverse items-center justify-between">
          <PopoverButton aria-label="Close menu" className="-m-1 p-1">
            <X aria-hidden="true" className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
          </PopoverButton>
          <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Navigation</h2>
        </div>
        <nav className="mt-6">
          <ul className="-my-2 divide-y divide-zinc-100 text-base text-zinc-800 lowercase italic dark:divide-zinc-100/5 dark:text-zinc-300">
            {links.map(({ href, name }) => (
              <li key={href}>
                <PopoverButton as={Link} href={href} className="block py-2">
                  {name}
                </PopoverButton>
              </li>
            ))}
          </ul>
        </nav>
      </PopoverPanel>
    </Popover>
  );
}

function DesktopNavigation({ links }: { links: { href: string; name: string }[] }) {
  const path = usePathname();
  return (
    <nav className="pointer-events-auto hidden md:block">
      <ul
        className={twJoin(
          'px-3 text-sm font-medium text-zinc-800 lowercase italic dark:text-zinc-200',
          'flex rounded-full bg-white/90 backdrop-blur dark:bg-zinc-800/90',
          'ring-1 shadow-lg shadow-zinc-800/5 ring-zinc-900/5 dark:ring-white/10',
        )}
      >
        {links.map(({ href, name }) => (
          <li key={href}>
            <Link
              href={href}
              className={twJoin(
                'relative block px-3 py-2 transition',
                path.startsWith(href)
                  ? 'text-teal-500 dark:text-teal-400'
                  : 'hover:font-bold hover:text-teal-700 dark:hover:text-teal-100',
              )}
            >
              {name}
              {path.startsWith(href) && (
                <span className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-teal-500/0 via-teal-500/40 to-teal-500/0 dark:from-teal-400/0 dark:via-teal-400/40 dark:to-teal-400/0" />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const otherTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <button
      type="button"
      aria-label={mounted ? `Switch to ${otherTheme} theme` : 'Toggle theme'}
      className={twJoin(
        'group flex h-9 w-12 justify-center rounded-full bg-white/90 px-3 py-2 backdrop-blur dark:bg-zinc-800/90',
        'ring-1 shadow-lg shadow-zinc-800/5 ring-zinc-900/5 dark:ring-white/10',
        'transition hover:ring-zinc-900/10 dark:hover:ring-white/20',
      )}
      onClick={() => setTheme(otherTheme)}
    >
      <MoonStar
        className={twJoin(
          'hidden size-5 fill-zinc-700 stroke-zinc-500 transition dark:block',
          '[@media_not_(prefers-color-scheme:dark)]:fill-teal-400/10',
          '[@media_not_(prefers-color-scheme:dark)]:stroke-teal-500',
          '[@media(prefers-color-scheme:dark)]:group-hover:stroke-zinc-400',
        )}
      />
      <Sun
        className={twJoin(
          'size-5 fill-zinc-100 stroke-zinc-500 transition group-hover:fill-zinc-200 group-hover:stroke-zinc-700 dark:hidden',
          '[@media(prefers-color-scheme:dark)]:fill-teal-50',
          '[@media(prefers-color-scheme:dark)]:stroke-teal-500',
          '[@media(prefers-color-scheme:dark)]:group-hover:fill-teal-50',
          '[@media(prefers-color-scheme:dark)]:group-hover:stroke-teal-600',
        )}
      />
    </button>
  );
}

function clamp(number: number, a: number, b: number) {
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  return Math.min(Math.max(number, min), max);
}

function Avatar() {
  const path = usePathname();
  return (
    <div
      className={twJoin(
        '-mt-1 size-11 rounded-full backdrop-blur',
        'transition hover:ring-zinc-900/10 dark:hover:ring-white/20',
        'bg-white/90 backdrop-blur dark:bg-zinc-800/90',
        'ring-1 shadow-lg shadow-zinc-800/5 ring-zinc-900/5 dark:ring-white/10',
      )}
    >
      {path == '/' && (
        <span className="absolute -bottom-px h-full w-full overflow-hidden rounded-full">
          <span
            className={twJoin(
              'absolute bottom-0 h-5 w-12',
              'bg-gradient-to-r from-teal-500/0 via-teal-500/40 to-teal-500/0 dark:from-teal-400/0 dark:via-teal-400/40 dark:to-teal-400/0',
            )}
          />
        </span>
      )}
      <Link href="/" aria-label="Home" className={twJoin('pointer-events-auto')}>
        <AvatarImage
          className="top-1px left-1px absolute rounded-full bg-zinc-100 backdrop-blur dark:bg-zinc-800/90"
          size={44}
          sweater={path == '/'}
        />
      </Link>
    </div>
  );
}

export function Header({ links }: { links: { href: string; name: string }[] }) {
  const headerRef = useRef<React.ElementRef<'div'>>(null);
  const avatarRef = useRef<React.ElementRef<'div'>>(null);
  const isInitial = useRef(true);

  useEffect(() => {
    const downDelay = avatarRef.current?.offsetTop ?? 0;
    const upDelay = 64;

    function setProperty(property: string, value: string) {
      document.documentElement.style.setProperty(property, value);
    }

    function removeProperty(property: string) {
      document.documentElement.style.removeProperty(property);
    }

    function updateHeaderStyles() {
      if (!headerRef.current) {
        return;
      }

      const { top, height } = headerRef.current.getBoundingClientRect();
      const scrollY = clamp(window.scrollY, 0, document.body.scrollHeight - window.innerHeight);

      if (isInitial.current) {
        setProperty('--header-position', 'sticky');
      }

      setProperty('--content-offset', `${downDelay}px`);

      if (isInitial.current || scrollY < downDelay) {
        setProperty('--header-height', `${downDelay + height}px`);
        setProperty('--header-mb', `${-downDelay}px`);
      } else if (top + height < -upDelay) {
        const offset = Math.max(height, scrollY - upDelay);
        setProperty('--header-height', `${offset}px`);
        setProperty('--header-mb', `${height - offset}px`);
      } else if (top === 0) {
        setProperty('--header-height', `${scrollY + height}px`);
        setProperty('--header-mb', `${-scrollY}px`);
      }

      if (top === 0 && scrollY > 0 && scrollY >= downDelay) {
        setProperty('--header-inner-position', 'fixed');
        removeProperty('--header-top');
        removeProperty('--avatar-top');
      } else {
        removeProperty('--header-inner-position');
        setProperty('--header-top', '0px');
        setProperty('--avatar-top', '0px');
      }
    }

    function updateAvatarStyles() {
      const fromScale = 1;
      const toScale = 36 / 64;
      const fromX = 0;
      const toX = 2 / 16;

      const scrollY = downDelay - window.scrollY;

      let scale = (scrollY * (fromScale - toScale)) / downDelay + toScale;
      scale = clamp(scale, fromScale, toScale);

      let x = (scrollY * (fromX - toX)) / downDelay + toX;
      x = clamp(x, fromX, toX);

      setProperty('--avatar-image-transform', `translate3d(${x}rem, 0, 0) scale(${scale})`);

      const borderScale = 1 / (toScale / scale);
      const borderX = (-toX + x) * borderScale;
      const borderTransform = `translate3d(${borderX}rem, 0, 0) scale(${borderScale})`;

      setProperty('--avatar-border-transform', borderTransform);
      setProperty('--avatar-border-opacity', scale === toScale ? '1' : '0');
    }

    function updateStyles() {
      updateHeaderStyles();
      updateAvatarStyles();
      isInitial.current = false;
    }

    updateStyles();
    window.addEventListener('scroll', updateStyles, { passive: true });
    window.addEventListener('resize', updateStyles);

    return () => {
      window.removeEventListener('scroll', updateStyles);
      window.removeEventListener('resize', updateStyles);
    };
  }, []);

  return (
    <>
      <header
        className="pointer-events-none relative z-50 flex flex-none flex-col"
        style={{
          height: 'var(--header-height)',
          marginBottom: 'var(--header-mb)',
        }}
      >
        <div
          ref={headerRef}
          className="top-0 z-10 h-16 pt-6"
          style={{
            position: 'var(--header-position)' as React.CSSProperties['position'],
          }}
        >
          <div
            className={twJoin(
              'top-[var(--header-top,theme(spacing.6))] w-full',
              'mx-auto w-full max-w-7xl sm:px-8 lg:px-8',
            )}
            style={{
              position: 'var(--header-inner-position)' as React.CSSProperties['position'],
            }}
          >
            <div
              className={twJoin(
                'px-4 sm:px-8 lg:px-12',
                'mx-auto max-w-2xl lg:max-w-5xl',
                'relative flex gap-4',
              )}
            >
              <div className="flex flex-1">
                <Avatar />
              </div>
              <div className="flex flex-1 justify-end md:justify-center">
                <MobileNavigation links={links} />
                <DesktopNavigation links={links} />
              </div>
              <div className="flex justify-end md:flex-1">
                <div className="pointer-events-auto">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
