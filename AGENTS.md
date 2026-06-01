# Agent guidance (mrloh.io)

## Behavior

- **Questions are not change requests.** "Why…?", "What is this?", "What does X do?" — explain only. Do not edit files unless the user explicitly asks to fix, change, refactor, or implement something.

## Stack

Next.js 16 App Router, React 19, Tailwind v4 (beta), MDX, shiki, `next-themes`, **pnpm**. No tests — verify with `pnpm typecheck` and `pnpm lint`; run `pnpm build` only when touching MDX, layout, or the build pipeline.

## Project map

- `app/layout.tsx`, `app/globals.css` — root shell + custom `prose` / layout classes
- `app/blog/[slug]/page.tsx` renders `blog/*.mdx`; `app/about` and `app/colophon` render colocated `.mdx`
- `mdx-components.tsx` — MDX element overrides (use plain Markdown in posts)

## Code style

- Trust the formatter — Prettier handles quotes, width, import order, and Tailwind class order (incl. inside `twJoin` / `clsx` / `cn` / `twMerge`).
- Group long `className` strings with `twJoin`, one logical group per line (layout / surface / hover+focus / dark). Short combinations stay plain strings.
- Pair every color utility with a `dark:` counterpart.
- Do not delete useful comments (invariants, regressions, non-obvious layout rules) unless they are wrong or the code they describe is gone.
- Keep `AGENTS.md` for repo-wide conventions only. Do not add component-local implementation notes (pin logic, one-off regressions, etc.) — put those in comments next to the code.
- Do not extract trivial one-liners into helpers — inline the logic at the call site.

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
