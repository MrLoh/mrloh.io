export default async function Colophon() {
  const { default: Content } = await import('./colophon.mdx');
  return (
    <div className="mt-12 flex flex-1 flex-col items-center">
      <article className="prose font-prose dark:prose-invert relative max-w-160 px-6">
        <h1 className="mt-2 mb-8 flex justify-between font-sans text-3xl italic">Colophon</h1>
        <Content />
      </article>
    </div>
  );
}
