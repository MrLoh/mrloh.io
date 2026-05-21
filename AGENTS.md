# Agent guidance (mrloh.io)

## Stack

Next.js 16 App Router, React 19, Tailwind v4 (beta), MDX, shiki, `next-themes`, **pnpm**. No tests — verify with `pnpm typecheck` and `pnpm lint`; run `pnpm build` only when touching MDX, layout, or the build pipeline.

## Project map

- `app/layout.tsx`, `app/globals.css` — root shell + custom `prose` / layout classes
- `app/blog/[slug]/page.tsx` renders `blog/*.mdx`; `app/about` and `app/colophon` render colocated `.mdx`
- `mdx-components.tsx` — MDX element overrides (use plain Markdown in posts)
- `components/Header.tsx` — scroll-driven; see comments in the file before editing

## Code style

- Trust the formatter — Prettier handles quotes, width, import order, and Tailwind class order (incl. inside `twJoin` / `clsx` / `cn` / `twMerge`).
- Group long `className` strings with `twJoin`, one logical group per line (layout / surface / hover+focus / dark). Short combinations stay plain strings.
- Pair every color utility with a `dark:` counterpart.

## Layout shell

Use the shared classes from `globals.css`. Do not add per-page `max-w-*` / `px-*` wrappers.

| Class                     | Role                             |
| ------------------------- | -------------------------------- |
| `layout`                  | Viewport centering               |
| `layout-7xl`              | Card shell                       |
| `layout-px`               | Inner card padding               |
| `prose-max`               | 42rem column                     |
| `prose-px` / `prose-wrap` | 42rem column + horizontal gutter |

Tailwind v4 can't `@apply` these custom classes from other rules in `globals.css` — repeat the utility stack or use plain CSS.

Prose pages (about, colophon, blog posts) share the wrapper `prose … mt-6 w-full max-w-none`; gutter and measure come from `.prose > …` rules, not extra padding on `<article>`. Non-prose blocks inside those pages need `prose-wrap`, not `prose-max` alone.
