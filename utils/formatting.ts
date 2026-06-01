import '@formatjs/intl-durationformat/polyfill.js';

import { Temporal } from 'temporal-polyfill-lite';

export const formatDuration = (duration: Temporal.Duration) => {
  return duration.toLocaleString('en-US', { style: 'long' }).replace(',', '');
};

export const formatYearMonth = (value: Temporal.PlainYearMonth | Temporal.PlainDate) =>
  (value instanceof Temporal.PlainYearMonth ? value.toPlainDate({ day: 1 }) : value).toLocaleString(
    'en-US',
    { month: 'short', year: 'numeric' },
  );

export const formatDate = (date: Temporal.Instant) =>
  date.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const relativeTimeFormatter = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });
export const formatRelativeTimeAgo = (date: Temporal.Instant): string => {
  const seconds = Temporal.Now.instant().since(date).total('second');
  for (const [unit, size] of [
    ['year', 365 * 24 * 60 * 60],
    ['month', 30 * 24 * 60 * 60],
    ['day', 24 * 60 * 60],
    ['hour', 60 * 60],
    ['minute', 60],
  ] as const) {
    if (Math.abs(seconds) >= size) {
      return relativeTimeFormatter.format(-Math.round(seconds / size), unit);
    }
  }
  return 'moments ago';
};
