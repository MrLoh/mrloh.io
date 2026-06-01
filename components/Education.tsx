'use client';

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import Image from 'next/image';
import { useRef } from 'react';
import { twJoin } from 'tailwind-merge';

type Institution = { name: string; logo: string; url: string; description: string };

function InstitutionPopover({ name, logo, url, description }: Institution) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  return (
    <Popover className="flex">
      {({ open, close }) => {
        const cancelClose = () => clearTimeout(closeTimer.current);
        const scheduleClose = () => {
          cancelClose();
          closeTimer.current = setTimeout(() => close(), 120);
        };
        const openOnHover = () => {
          cancelClose();
          if (!open) buttonRef.current?.click();
        };

        return (
          <>
            <PopoverButton
              ref={buttonRef}
              aria-label={name}
              onMouseEnter={openOnHover}
              onMouseLeave={scheduleClose}
              className={twJoin(
                'flex size-11 items-center justify-center rounded-md p-0.5',
                'bg-white transition outline-none hover:scale-120 data-[open]:scale-120 dark:bg-zinc-300',
              )}
            >
              <Image
                src={logo}
                alt=""
                width={40}
                height={40}
                className="size-full object-contain"
              />
            </PopoverButton>
            <PopoverPanel
              anchor={{ to: 'top', gap: 8 }}
              transition
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
              className={twJoin(
                // Card styling lives on the panel itself: anchor sets overflow on
                // this element, which would clip the shadow of any inner wrapper.
                'z-20 w-60 rounded-xl border p-4 shadow-lg',
                'border-zinc-100 bg-white dark:border-zinc-700 dark:bg-zinc-800',
                'transition duration-150 data-[closed]:opacity-0',
              )}
            >
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={twJoin(
                  'block text-sm leading-tight font-bold text-zinc-800 italic transition',
                  'hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-400',
                )}
              >
                {name}
              </a>
              <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                {description}
              </p>
            </PopoverPanel>
          </>
        );
      }}
    </Popover>
  );
}

export function Education({
  summary,
  institutions,
  className,
}: {
  summary: string;
  institutions: Institution[];
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="mb-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-base font-extrabold text-zinc-800 uppercase dark:text-zinc-200">
          Education
        </h2>
        <div className="-mt-2 mr-2 flex max-w-80 flex-1 items-center justify-between">
          {institutions.map((institution) => (
            <InstitutionPopover key={institution.url} {...institution} />
          ))}
        </div>
      </div>
      <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{summary.trim()}</p>
    </section>
  );
}
