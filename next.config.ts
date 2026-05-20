import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = { pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'] };

const withMDX = createMDX({
  options: {
    remarkPlugins: [['remark-gfm'], ['remark-frontmatter'], ['remark-mdx-frontmatter']],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
