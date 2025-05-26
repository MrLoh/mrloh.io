import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

export function Button({
  children,
  href,
  onClick,
  className,
  ...props
}:
  | ({ children: React.ReactNode; href: string; onClick?: never } & React.ComponentProps<'a'>)
  | ({
      children: React.ReactNode;
      href?: never;
      onClick?: () => unknown;
    } & React.ComponentProps<'button'>)) {
  const buttonClassName = twMerge(
    'flex grow basis-60 items-center justify-center gap-2 rounded-md px-4 py-2 transition',
    'text-sm text-zinc-800 italic no-underline dark:text-zinc-200',
    'bg-zinc-100 dark:bg-zinc-800',
    'hover:bg-teal-500 hover:text-white hover:shadow-lg hover:shadow-teal-400/20 dark:hover:bg-teal-600',
    className,
  );
  return href ? (
    href.startsWith('http') ? (
      <a href={href} className={buttonClassName} {...(props as React.ComponentProps<'a'>)}>
        {children}
      </a>
    ) : (
      <Link href={href} className={buttonClassName} {...(props as React.ComponentProps<'a'>)}>
        {children}
      </Link>
    )
  ) : (
    <button
      className={buttonClassName}
      onClick={onClick}
      {...(props as React.ComponentProps<'button'>)}
    >
      {children}
    </button>
  );
}
