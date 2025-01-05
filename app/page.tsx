import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Coming Soon!</h1>
      <Link
        href="/blog"
        className="mt-4 p-8 text-slate-800 italic hover:text-slate-600 hover:underline"
      >
        blog
      </Link>
    </div>
  );
}
