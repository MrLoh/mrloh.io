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
            'group text-inherit no-underline',
            'hover:text-teal-500 focus:text-teal-500',
            'rounded-md outline-none focus:bg-teal-50 dark:focus:bg-teal-900/30',
          )}
          target="_blank"
        >
          {props.children}
          <SquareArrowOutUpRight
            className={twJoin(
              'mb-[1.5px] ml-0.5 inline-block size-3 stroke-[2.5px]',
              'group-hover:text-teal-500 group-focus:text-teal-500',
              'rounded-md outline-none focus:bg-teal-50 dark:focus:bg-teal-900/20',
            )}
          />
        </a>
      ) : (
        <Link {...props} className="text-teal-500" />
      ),
    h2: (props) => (
      <h2
        {...props}
        className={twJoin(
          'font-sans text-base font-extrabold text-zinc-800 uppercase dark:text-zinc-200',
          props.className,
        )}
      >
        {props.children}
      </h2>
    ),
    ...components,
  };
}

// document.querySelectorAll("p").forEach(p => {
//   p.innerHTML = p.innerHTML.replace(/([,"'])/g, '<span class="special-char">$1</span>');
// });
