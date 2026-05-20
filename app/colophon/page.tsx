export default async function Colophon() {
  const { default: Content } = await import('./colophon.mdx');
  return (
    <div className="flex flex-col">
      <article className="prose prose-zinc dark:prose-invert mt-6 w-full max-w-none">
        <h1>Colophon</h1>
        <Content />
      </article>
    </div>
  );
}
