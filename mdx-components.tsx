import { SquareArrowOutUpRight } from 'lucide-react';
import type { MDXComponents } from 'mdx/types';
import Image, { ImageProps } from 'next/image';
import Link from 'next/link';
import { twJoin } from 'tailwind-merge';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    img: (props) => (
      <Image
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        {...(props as ImageProps)}
        alt={props.alt}
      />
    ),
    a: (props) =>
      props.href.startsWith('http') ? (
        <a
          {...props}
          className={twJoin(
            'group font-inherit font-normal text-inherit no-underline',
            'hover:text-teal-500 focus:text-teal-500',
            'rounded-md outline-none focus:bg-teal-50 dark:focus:bg-teal-900/30',
          )}
          target="_blank"
        >
          {props.children}
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
        <Link {...props} className="text-teal-500" />
      ),
    ...components,
  };
}
