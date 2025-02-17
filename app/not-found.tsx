import { twJoin } from 'tailwind-merge';

export default function NotFound() {
  return (
    <div
      className={twJoin(
        'flex flex-1 flex-col items-center justify-center',
        '-mb-18 [@media(min-height:768px)]:mb-8',
      )}
    >
      <h1
        className={twJoin(
          'text-8xl text-transparent',
          'bg-gradient-to-b from-teal-400 via-teal-500 to-teal-900 bg-clip-text',
        )}
      >
        404
      </h1>
      <p className="mt-2 ml-1 text-xl text-zinc-500 italic">page not found</p>
    </div>
  );
}
