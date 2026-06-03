import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { remark } from 'remark';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';

import { DOMAIN } from '@/config';

import { getMeta, listSlugs } from '../../repo';

type MdastNode = {
  type: string;
  name?: string;
  value?: string;
  url?: string;
  alt?: string;
  children?: MdastNode[];
  attributes?: { name?: string; value?: unknown }[];
};

const getAttr = (node: MdastNode, name: string): unknown =>
  node.attributes?.find((attr) => attr.name === name)?.value;

// Turn MDX into plain Markdown for agents: drop ESM imports/exports and `{…}`
// expressions, unwrap inline JSX to its text, and render <Figure> as a real
// image whose URL is the imported asset's hashed build path (resolved by
// importing it, since the transform only sees the raw `src={ident}` reference).
const stripMdx = () => async (tree: MdastNode) => {
  // Map import identifiers to their resource filename, e.g.
  // `import nautilusCopilotLight from './resources/x.png'` -> nautilusCopilotLight: x.png
  const imports = new Map<string, string>();
  for (const node of tree.children ?? []) {
    if (node.type !== 'mdxjsEsm' || !node.value) continue;
    const pattern = /import\s+(\w+)\s+from\s+['"][^'"]*\/resources\/([^'"]+)['"]/g;
    for (const [, ident, file] of node.value.matchAll(pattern)) imports.set(ident, file);
  }

  const resolveImageUrl = async (ident: string): Promise<string | undefined> => {
    const file = imports.get(ident);
    if (!file) return undefined;
    const { default: image } = (await import(`@/blog/resources/${file}`)) as {
      default: { src: string };
    };
    return `https://${DOMAIN}${image.src}`;
  };

  const clean = async (nodes: MdastNode[] = []): Promise<MdastNode[]> => {
    const out: MdastNode[] = [];
    for (const node of nodes) {
      switch (node.type) {
        case 'yaml':
        case 'mdxjsEsm':
        case 'mdxFlowExpression':
        case 'mdxTextExpression':
          break;
        case 'mdxJsxFlowElement': {
          if (node.name !== 'Figure') break;
          const caption = getAttr(node, 'caption');
          const src = getAttr(node, 'src');
          const ident =
            src && typeof src === 'object' ? (src as { value?: string }).value : undefined;
          const url = ident ? await resolveImageUrl(ident) : undefined;
          const alt = typeof caption === 'string' ? caption : '';
          if (url) out.push({ type: 'paragraph', children: [{ type: 'image', url, alt }] });
          break;
        }
        case 'mdxJsxTextElement':
          out.push(...(await clean(node.children)));
          break;
        default:
          if (node.children) node.children = await clean(node.children);
          out.push(node);
      }
    }
    return out;
  };

  tree.children = await clean(tree.children);
};

export async function getPostMarkdown(slug: string): Promise<string> {
  const raw = await fs.readFile(path.join(process.cwd(), 'blog', `${slug}.mdx`), 'utf-8');
  const { title, description, date } = await getMeta(slug);
  const body = (
    await remark().use(remarkMdx).use(remarkFrontmatter).use(remarkGfm).use(stripMdx).process(raw)
  )
    .toString()
    .trim();
  const longDate = date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  return `# ${title}\n\n> ${description}\n\n_${longDate}_\n\n${body}\n`;
}

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
  return await listSlugs().then((slugs) => slugs.map((slug) => ({ slug })));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const markdown = await getPostMarkdown(slug);
  return new NextResponse(markdown, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
