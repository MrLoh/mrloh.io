import { SquareArrowOutUpRight } from 'lucide-react';
import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import Link from 'next/link';
import type { JSX } from 'react';
import { twJoin } from 'tailwind-merge';

import { CodeBlock, InlineCode } from '@/components/CodeBlock';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    img: ({ alt, src }: JSX.IntrinsicElements['img']) =>
      typeof src === 'string' ? (
        <Image sizes="100vw" style={{ width: '100%', height: 'auto' }} src={src} alt={alt ?? ''} />
      ) : null,
    a: ({ href, children }: JSX.IntrinsicElements['a']) =>
      !href || href.startsWith('http') ? (
        <a
          href={href}
          className={twJoin(
            'group font-inherit font-normal text-inherit no-underline',
            'hover:text-teal-500 focus:text-teal-500',
            'rounded-md outline-none focus:bg-teal-50 dark:focus:bg-teal-900/30',
          )}
          target="_blank"
        >
          {children}
          <SquareArrowOutUpRight
            viewBox="-2 -2 28 28"
            className={twJoin(
              'mb-[1.5px] ml-0.5 inline-block size-3 stroke-[3px]',
              'group-hover:text-teal-500 group-focus:text-teal-500',
              'rounded-md outline-none focus:bg-teal-50 dark:focus:bg-teal-900/20',
            )}
          />
        </a>
      ) : (
        <Link href={href} className="text-teal-500">
          {children}
        </Link>
      ),
    code: ({ children }: JSX.IntrinsicElements['code']) => <InlineCode>{children}</InlineCode>,
    pre: ({ children }: JSX.IntrinsicElements['pre']) =>
      children &&
      typeof children === 'object' &&
      'props' in children &&
      children.props &&
      typeof children.props === 'object' &&
      'children' in children.props &&
      typeof children.props.children === 'string' ? (
        <CodeBlock
          code={children.props.children}
          lang={
            'className' in children.props && typeof children.props.className === 'string'
              ? children.props.className.replace('language-', '')
              : undefined
          }
        />
      ) : null,
    ...components,
  };
}
