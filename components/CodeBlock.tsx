import { type ReactElement } from 'react';
import { codeToHtml } from 'shiki';

type CodeProps = { className?: string; children?: string };

type Props = { children: ReactElement<CodeProps> };

export async function CodeBlock({ children }: Props) {
  const code = (children.props.children ?? '').trimEnd();
  const lang = (children.props.className ?? '').replace('language-', '') || 'plaintext';

  const html = await codeToHtml(code, {
    lang,
    themes: { light: 'vitesse-light', dark: 'poimandres' },
    defaultColor: false,
  });

  return (
    <div
      className="not-prose my-6 overflow-x-auto text-sm dark:border-zinc-700"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
