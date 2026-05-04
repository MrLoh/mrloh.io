import type { ReactNode } from 'react';
import { codeToHtml } from 'shiki';
import type { ThemeRegistration } from 'shiki';
import { twJoin } from 'tailwind-merge';

const scopes = {
  comments: ['comment', 'punctuation.definition.comment'],
  keywords: ['keyword', 'storage.type', 'storage.modifier', 'variable.language'],
  names: ['entity.name', 'support.class', 'support.type', 'entity.other.inherited-class'],
  literals: ['string', 'constant', 'string.regexp', 'keyword.other.unit'],
  punctuation: ['punctuation', 'keyword.operator', 'meta.brace'],
} satisfies Record<string, string[]>;

const background = 'border-teal-500/20 bg-teal-500/2';

const makeTheme = (dark: boolean): ThemeRegistration => {
  const styles = (
    lc: string,
    dc: string,
    style: 'italic' | 'bold' | 'normal' | 'bold italic' = 'normal',
  ) => ({ foreground: dark ? `var(--color-${dc})` : `var(--color-${lc})`, fontStyle: style });
  return {
    name: `mrloh-${dark ? 'dark' : 'light'}`,
    type: dark ? 'dark' : 'light',
    colors: { 'editor.background': 'transparent', 'editor.foreground': 'inherit' },
    tokenColors: [
      { scope: scopes.comments, settings: styles('zinc-400', 'zinc-500', 'italic') },
      { scope: scopes.keywords, settings: styles('amber-500', 'amber-500', 'italic') },
      { scope: scopes.names, settings: styles('teal-500', 'teal-400') },
      { scope: scopes.literals, settings: styles('sky-500', 'sky-300') },
      { scope: scopes.punctuation, settings: styles('zinc-500', 'zinc-500') },
    ],
  };
};

export function InlineCode({ children }: { children?: ReactNode }) {
  return (
    <code
      className={twJoin(
        'rounded border px-1 py-0.5 font-sans text-sm font-normal',
        'before:content-none after:content-none',
        'text-teal-800 dark:text-teal-100',
        background,
      )}
    >
      {children}
    </code>
  );
}

export async function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  const html = await codeToHtml(code, {
    lang: lang ?? 'plaintext',
    themes: { dark: makeTheme(true), light: makeTheme(false) },
    defaultColor: false,
  });

  return (
    <div className={twJoin('full-bleed not-prose my-6 border-y', background)}>
      <pre
        className="col-start-2 min-w-0 overflow-x-auto py-8 text-sm font-normal"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
