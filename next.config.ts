import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // Expose the agent-friendly markdown of each post at the conventional
  // `/blog/<slug>.md` URL (slugs never contain dots, so the match is unambiguous).
  async rewrites() {
    return { beforeFiles: [{ source: '/blog/:slug.md', destination: '/blog/:slug/md' }] };
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [['remark-gfm'], ['remark-frontmatter'], ['remark-mdx-frontmatter']],
    rehypePlugins: [['rehype-slug']],
  },
});

export default withMDX(nextConfig);
