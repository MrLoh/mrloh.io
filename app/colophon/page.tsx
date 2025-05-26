export default async function Colophon() {
  const { default: Content } = await import('./colophon.mdx');
  return (
    <div className="mt-12 flex flex-1 flex-col items-center">
      <article className="prose prose-zinc dark:prose-invert relative max-w-2xl px-6">
        <h1>Colophon</h1>
        <Content />
      </article>
    </div>
  );
}
