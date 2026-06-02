import Image, { type StaticImageData } from 'next/image';
import { twJoin } from 'tailwind-merge';

export function Figure({
  src,
  srcDark,
  caption,
  className,
}: {
  src: StaticImageData;
  srcDark: StaticImageData;
  caption: string;
  className?: string;
}) {
  return (
    <figure
      tabIndex={0}
      aria-label={caption}
      className={twJoin(
        'prose-wrap group relative !my-3 overflow-hidden px-0 outline-none',
        className,
      )}
    >
      <Image
        src={src}
        alt={caption}
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        className={twJoin(srcDark && 'block dark:hidden')}
      />
      <Image
        src={srcDark}
        alt={caption}
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        className="hidden dark:block"
      />
      <figcaption
        className={twJoin(
          'pointer-events-none absolute inset-x-0 bottom-0 px-6 py-2.5',
          'bg-black/50 backdrop-blur-sm backdrop-brightness-150',
          'text-center text-sm leading-snug text-white',
          'translate-y-10 opacity-0 transition duration-150',
          'group-focus-within:opacity-100 group-hover:opacity-100',
          'group-focus-within:translate-y-0 group-hover:translate-y-0',
        )}
      >
        {caption}
      </figcaption>
    </figure>
  );
}
