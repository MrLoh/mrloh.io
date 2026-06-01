import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { BriefcaseBusiness, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { twJoin } from 'tailwind-merge';
import { Temporal } from 'temporal-polyfill-lite';

import { formatDuration, formatYearMonth } from '@/utils/formatting';

type Experience = {
  company: string;
  logo?: string;
  linkedin?: string;
  location: string;
  positions: { title: string; start: Temporal.PlainDate; end?: Temporal.PlainDate }[];
  summary: string;
  details?: string[];
  skills?: string[];
};

const formatTotalDuration = (start: Temporal.PlainDate, end?: Temporal.PlainDate) =>
  formatDuration(
    start.until(end ?? Temporal.Now.plainDateISO(), {
      smallestUnit: 'months',
      largestUnit: 'years',
      roundingMode: 'halfExpand',
    }),
  );

const DateRange = ({
  start,
  end,
  className,
}: {
  start: Temporal.PlainDate;
  end?: Temporal.PlainDate;
  className?: string;
}) => (
  <span
    className={twJoin(
      'text-xs leading-tight font-semibold text-zinc-500 dark:text-zinc-400',
      className,
    )}
  >
    {`${formatYearMonth(start)} – ${end ? formatYearMonth(end) : 'Present'} · ${formatTotalDuration(start, end)}`}
  </span>
);

const CompanyLogo = ({
  name,
  logo,
  linkedin,
}: {
  name: string;
  logo?: string;
  linkedin?: string;
}) => {
  const sharedClassName = twJoin(
    'relative z-10 flex size-10 shrink-0 items-center justify-center rounded-md',
    'ring-2 ring-zinc-200 dark:ring-zinc-600',
  );
  const inner = logo ? (
    <Image
      src={logo}
      alt=""
      width={40}
      height={40}
      className={twJoin(sharedClassName, 'object-contain')}
    />
  ) : (
    <div className={twJoin(sharedClassName, 'bg-zinc-200 dark:bg-zinc-600')} aria-hidden>
      <BriefcaseBusiness className="size-5 text-zinc-600 dark:text-zinc-300" />
    </div>
  );

  return linkedin ? (
    <a
      href={linkedin}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      className={twJoin(
        'relative z-10 shrink-0 rounded-md outline-teal-500 transition',
        'hover:ring-2 hover:ring-teal-500/50 dark:hover:ring-teal-400/50',
      )}
    >
      {inner}
    </a>
  ) : (
    inner
  );
};

const CareerStep = ({
  company,
  logo,
  linkedin,
  location,
  positions,
  summary,
  details,
  skills,
  isFirst,
  isLast,
}: Experience & { isFirst: boolean; isLast: boolean }) => {
  const start = positions.at(-1)!.start;
  const hasMultiplePositions = positions.length > 1;
  const hasDetails = Boolean(details && details.length > 0);

  return (
    <div
      className={twJoin(
        'not-prose relative lg:-ml-14',
        isLast ? 'mb-0' : hasDetails ? 'mb-8' : 'mb-12',
        hasMultiplePositions && !isFirst && '-mt-4',
      )}
    >
      {/* One continuous rail through the whole step: starts at the logo center
          and runs into the next step's logo (which masks it). */}
      {!isLast ? (
        <span
          aria-hidden
          className={twJoin(
            'absolute top-5 -bottom-12 left-5 w-0.5 -translate-x-1/2',
            'bg-zinc-200 dark:bg-zinc-600',
          )}
        />
      ) : null}

      {/* Company row: logo node + header. */}
      <div className="flex items-start gap-4">
        <CompanyLogo name={company} logo={logo} linkedin={linkedin} />
        <div className="min-w-0 flex-1">
          {hasMultiplePositions ? (
            <div className="mt-1.5 flex flex-wrap items-center">
              <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
                {company}
              </h3>
              <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400">({location})</span>
              <span className="ml-1 text-xs leading-tight font-semibold text-zinc-500 dark:text-zinc-400">
                · {formatTotalDuration(start, positions.at(0)!.end)}
              </span>
            </div>
          ) : (
            <div className="-mt-4.5">
              <DateRange start={start} end={positions.at(0)!.end} />
              <h3 className="-mt-0.5 text-base font-bold text-zinc-800 italic dark:text-zinc-200">
                {positions.at(0)!.title}
              </h3>
              <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">{company}</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400"> ({location})</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Position rows: each dot is a node sitting on the shared rail. */}
      {hasMultiplePositions ? (
        <ul className="mt-1">
          {positions.map(({ title, start, end }) => (
            <li
              key={`${title}-${start.toString()}`}
              className="flex items-start gap-4 pb-2 last:pb-0"
            >
              <div className="flex w-10 shrink-0 justify-center">
                {/* Aligned to the title line (date sits above), not the row top. */}
                <span
                  className={twJoin(
                    'relative z-10 mt-7.5 size-2 shrink-0 rounded-full',
                    'bg-white ring-2 ring-zinc-200',
                    'dark:bg-zinc-900 dark:ring-zinc-600',
                  )}
                />
              </div>
              <div className="min-w-0 flex-1">
                <DateRange start={start} end={end} />
                <h4 className="-mt-0.5 font-bold text-zinc-800 italic dark:text-zinc-200">
                  {title}
                </h4>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {summary ? (
        <p
          className={twJoin(
            'mt-3 pl-14',
            'text-sm leading-relaxed text-zinc-700 dark:text-zinc-300',
          )}
        >
          {summary}
        </p>
      ) : null}
      {hasDetails ? (
        <Disclosure>
          <div className="mr-2 flex justify-end">
            <DisclosureButton
              className={twJoin(
                'group mt-2 flex cursor-pointer items-center gap-1 text-xs font-bold italic',
                'text-zinc-400 transition outline-none hover:text-teal-500',
                'dark:text-zinc-400 dark:hover:text-teal-400',
              )}
            >
              details{' '}
              <ChevronDown
                strokeWidth={2.5}
                className="mt-0.5 size-3 transition group-data-[open]:rotate-180"
              />
            </DisclosureButton>
          </div>
          <DisclosurePanel
            transition
            className={twJoin(
              'grid grid-rows-[1fr] opacity-100 transition-all duration-200 ease-out',
              'data-[closed]:grid-rows-[0fr] data-[closed]:opacity-0',
            )}
          >
            <div className="mt-2 mb-4 ml-10 overflow-hidden">
              {details ? (
                <ul className="list-none space-y-2.5">
                  {details.map((detail) => (
                    <li
                      key={detail}
                      className="flex text-sm leading-relaxed text-zinc-700 dark:text-zinc-300"
                    >
                      <span
                        aria-hidden
                        className={twJoin('w-4 text-zinc-400 select-none dark:text-zinc-500')}
                      >
                        –
                      </span>
                      <span className="min-w-0 flex-1">{detail}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {skills ? (
                <div className={twJoin('mt-4 mb-0.5 ml-4 flex flex-wrap gap-2 leading-relaxed')}>
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className={twJoin(
                        'text-xxs rounded-full px-2 py-0.5 font-medium',
                        'bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200/70',
                        'dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700',
                      )}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </DisclosurePanel>
        </Disclosure>
      ) : null}
    </div>
  );
};

export function Experiences({
  experiences,
  className,
  action,
}: {
  experiences: Experience[];
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <section className={className}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-base font-extrabold text-zinc-800 uppercase dark:text-zinc-200">
          Experience
        </h2>
        {action}
      </div>
      {experiences.map((experience, index) => (
        <CareerStep
          key={experience.company}
          {...experience}
          isLast={index === experiences.length - 1}
          isFirst={index === 0}
        />
      ))}
    </section>
  );
}
