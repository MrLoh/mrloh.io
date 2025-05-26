import { Temporal } from '@js-temporal/polyfill';

const relativeTimeFormatter = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });

const DateTimeDivisions = [
  { amount: 60, name: 'seconds' as const },
  { amount: 60, name: 'minutes' as const },
  { amount: 24, name: 'hours' as const },
  { amount: 7, name: 'days' as const },
  { amount: 12, name: 'months' as const },
  { amount: Number.POSITIVE_INFINITY, name: 'years' as const },
];

export const formatRelativeTimeAgo = (date: Date | string | Temporal.Instant): string => {
  if (typeof date === 'string') {
    date = Temporal.Instant.from(date);
  } else if (date instanceof Date) {
    date = Temporal.Instant.from(date.toISOString());
  }
  let duration = date.epochSeconds - Temporal.Now.instant().epochSeconds;
  let division = DateTimeDivisions[0]!; // Initialize with the smallest division
  while (Math.abs(duration) >= division.amount) {
    duration /= division.amount;
    division = DateTimeDivisions[DateTimeDivisions.indexOf(division) + 1]!;
  }
  if (division.name === 'seconds') return 'moments ago';
  if (division.name === 'months') {
    return date.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
  return relativeTimeFormatter.format(Math.round(duration), division.name);
};
