import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronRight } from 'lucide-react';
import { twJoin } from 'tailwind-merge';
import { Temporal } from 'temporal-polyfill-lite';

import { formatDuration } from '@/utils/formatting';

type Skill = {
  name: string;
  description: string;
  technologies: string[];
  duration: Temporal.Duration;
};

const SkillRow = ({ name, description, technologies, duration }: Skill) => (
  <Disclosure as="div" className="not-prose -ml-5">
    <DisclosureButton
      className={twJoin(
        'group flex w-full cursor-pointer items-center gap-1 py-1 text-left outline-none',
      )}
    >
      <ChevronRight
        strokeWidth={2.5}
        className={twJoin(
          'size-4 shrink-0 text-zinc-400 transition',
          'group-hover:text-teal-600 group-data-[open]:rotate-90',
          'dark:text-zinc-500 dark:group-hover:text-teal-700',
        )}
      />
      <span
        className={twJoin(
          'flex min-w-0 flex-1 items-baseline gap-2',
          'font-bold text-zinc-700 italic transition-colors dark:text-zinc-300',
          'group-hover:text-teal-600 dark:group-hover:text-teal-500',
        )}
      >
        <span className="shrink-0">{name}</span>
        <span
          aria-hidden
          className={twJoin(
            'mb-1 h-0.5 min-w-6 flex-1 self-end bg-bottom bg-repeat-x transition-colors',
            'bg-[repeating-linear-gradient(90deg,theme(colors.zinc.400)_0_2px,transparent_2px_10px)]',
            'group-hover:bg-[repeating-linear-gradient(90deg,theme(colors.teal.500)_0_2px,transparent_2px_10px)]',
            'dark:bg-[repeating-linear-gradient(90deg,theme(colors.zinc.700)_0_2px,transparent_2px_10px)]',
            'dark:group-hover:bg-[repeating-linear-gradient(90deg,theme(colors.teal.800)_0_2px,transparent_2px_10px)]',
          )}
        />
        <span
          className={twJoin(
            'shrink-0 text-sm font-semibold not-italic transition-colors',
            'text-zinc-500 dark:text-zinc-400',
            'group-hover:text-teal-700 dark:group-hover:text-teal-600',
          )}
        >
          {formatDuration(duration)}
        </span>
      </span>
    </DisclosureButton>
    <DisclosurePanel
      static
      className={twJoin(
        'grid grid-rows-[0fr] opacity-0 transition-all duration-200 ease-out',
        'data-[open]:grid-rows-[1fr] data-[open]:opacity-100',
        'data-[open]:pt-2 data-[open]:pb-4',
      )}
    >
      <div className="overflow-hidden pb-1 pl-5">
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {technologies.map((technology) => (
            <span
              key={technology}
              className={twJoin(
                'text-xxs rounded-full px-2 py-0.5 font-medium',
                'bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200/70',
                'dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700',
              )}
            >
              {technology}
            </span>
          ))}
        </div>
      </div>
    </DisclosurePanel>
  </Disclosure>
);

export function Skills({
  intro,
  areas,
  className,
}: {
  intro: string;
  areas: Skill[];
  className?: string;
}) {
  return (
    <section className={className} id="skills">
      <h2 className="mb-2 text-base font-extrabold text-zinc-800 uppercase dark:text-zinc-200">
        Skills
      </h2>
      <p className="mb-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {intro.trim()}
      </p>
      {areas.map((skill) => (
        <SkillRow key={skill.name} {...skill} />
      ))}
    </section>
  );
}
