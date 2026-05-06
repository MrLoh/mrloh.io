---
name: blogging
description: Draft or revise blog posts in Tobias's voice. Use when writing, editing, or revising any .mdx files, or when the user asks to write in their style.
---

# Blogging Skill: Tobias Style

Use this skill to draft or revise blog posts so they sound like Tobias.

## Voice

Write plainly, directly, and with visible reasoning.

The style should feel like an experienced engineer thinking out loud, not like a polished content marketer. It can be personal, but it should stay grounded in concrete work, examples, and what changed in practice.

Prefer:

- short, clear openings
- honest self-correction
- concrete chronology when useful
- “I think”, “probably”, and “it might be worth” when the claim is genuinely uncertain
- practical optimism without hype
- specific mechanisms over broad lessons
- mildly opinionated technical judgment
- transitions that show causality: “that made me realize”, “the first step is”, “this matters because”

Avoid:

- generic SaaS or LinkedIn phrasing (“let’s dive in”, “game changer”, “in today’s world”, fake narrative hooks, motivational endings, over-polished thought leadership)
- em dashes and semicolons
- rhetorical questions unless the source draft already uses them
- empty value-claim slogans (“earns its place”, “earn their keep”, “worth its weight”, “pulls its weight”)
- “X is the contract” / “the source of truth is Y” framings unless they carry real content the surrounding prose doesn’t
- transition paragraphs whose only job is to re-enumerate or restate what was just covered
- jargon that is technically accurate but not how Tobias would explain it in a post, especially type-system labels or implementation terms used as prose

## Rhythm

Tobias often writes in medium-length paragraphs that connect several thoughts in a natural chain. Do not make every sentence punchy. Some sentences can be a little long if they preserve the reasoning flow.

Good rhythm:

> The result was not a clear win, but it was still useful. The failure mode told us something specific about the data distribution, and that gave us a better next experiment.

Bad rhythm:

> The result failed. But failure teaches. This is how teams learn.

## Style Pattern

A good Tobias-style post usually does one of these:

1. Starts from a real experience.
2. Names the thing that was confusing or misleading.
3. Explains what changed after digging deeper.
4. Connects the lesson to a broader engineering habit.
5. Ends with a grounded takeaway, not a grand conclusion.

The post should feel earned. Do not announce the lesson too early if the story or technical argument needs to build toward it.

## Editing Rules

When revising:

- Read at least one existing post before drafting or revising. Site typography is set by existing posts, not Markdown defaults: curly apostrophes (`’`, U+2019) in body text, spaced em dashes for asides, Title Case headings. Don’t rely on what your editor auto-inserts.
- Default to tightening before expanding. Cut repetition, caveats, throat-clearing, and anything that could appear in any generic engineering blog before adding examples, sections, taxonomies, or code. Replace vague abstractions with concrete examples, but don’t smooth the prose into corporate polish, and preserve informal phrasing when it carries voice.
- Keep the author’s uncertainty where it’s intellectually honest. Sharpen claims only when the draft provides evidence. Prefer “this is probably the useful next step” over “this comprehensive strategy ensures success.”
- Lead each subsection with the most concrete, stack-specific reason for the claim. A particular framework’s behavior or a particular tool’s limitation lands harder than a general principle, and the principle can follow.
- Section structure should match the section’s title or promise, and headings should name the section’s most substantive contribution rather than its topic (“Fixing SentenceTransformers’ Batch Sampler” beats “Why Triplet Barely Trained”). When changing a heading, audit whether the content still matches the new promise. A section with only one or two paragraphs of unique content usually belongs folded into an adjacent section. Promoting or demoting heading levels rarely fixes a weight problem.
- Check paragraph-to-paragraph flow for non-sequiturs. Each paragraph should follow from the argument of the previous one, not just sit on the same topic. Re-read the section after a change. Edits often leave behind a now-redundant paragraph upstream or downstream.
- Watch for framings that force the reader to keep score or that don’t hold up mechanically. Score-keeping (“two things were wrong, only one of them about the loss”) breaks if the categories don’t hold. Quantitative claims (“20 classes made the bug catastrophic”) need to actually move with the outcome. Don’t preview a later reveal with an editorial hedge — it flattens the punch when it lands.
- Skip internal codebase names and inside-baseball implementation caveats unless they carry information the reader needs. Use the concept or public class name instead of “our internal name for X”. When comparing similar things, keep referent levels parallel — an internal class beside a `sentence-transformers` class creates an asymmetry the reader has to resolve before reading the comparison.
- Don’t add a code sketch just because the post is technical. Add one only when it makes the idea clearer than prose. Prefer the author’s concrete phrasing over polished abstractions: “make the right thing the easy thing” beats “build boundary abstractions that ensure consistency.”
- If the user reacts negatively to wording, treat it as a style signal and fix the underlying tendency, not just the sentence. When asked to align with an earlier post, read that post first and copy its level of personal framing, paragraph rhythm, and conversational directness — don’t merely add first-person pronouns to an abstract essay, and don’t fabricate personal history to match a more personal reference. If unsure, lead with the concept directly.

## Drawing on Real Code

When a post is grounded in a real codebase:

- Survey widely before deep-reading, and anonymize internal references. Search across the repo and sibling packages for the pattern under discussion — mining one or two files usually misses the more interesting examples that make the post feel earned. Use generic roles (“our Python backend”, “the API client”, “the frontend app”, “the form wrapper”) rather than internal product, service, or codenames.
- Code sketches earn inclusion when they show usage or the key mechanism in roughly 5–15 lines. Avoid pasting whole files. Trim repetitive variants with `// ...` and keep only the lines that carry the point. If the prose already carries the mechanism, drop the code block.
- Name the stack when it’s load-bearing (“Next.js server actions”, “FastAPI exception handlers”, “React Hook Form + Zod”). Specificity beats vague references to “the framework”.
- Don’t use code-shaped pseudo-syntax in inline backticks. If the prose is drifting toward `Foo { bar }` or generic-style notation across multiple terms, commit either to a fenced code block with real syntax or to plain prose without the notation. The mid-form reads as hedging.
- When introducing the first code block (or first table, image, etc.) to a post or to a site that has none yet, verify the rendering pipeline supports it before shipping. Check `next.config.ts` and global CSS for syntax highlighting (`rehype-shiki`, `rehype-prism`), table styling, and image handling. Flag any gaps to the author rather than assuming Markdown defaults work.
- Match the post’s level of language specificity to its audience. If the post is TypeScript-flavored throughout, utility types like `Exclude<>` and `Pick<>` are fine. If TypeScript appears only as a concrete instance in a broader-audience post, prefer named types and simple shapes; describe the constraint in prose (“the rejection union with invalid input excluded”) rather than reaching for a utility type.

## Revising with the Author

- Commit to one shaped version and ask one or two targeted questions if blocked. Don’t present open pick-lists. If the author rejects a proposal, treat it as information about what direction not to go and come back with ONE new shaped version, not another menu. This applies especially to headings and openings, where it’s tempting to keep generating variants.
- Preserve formatting choices the author has made (backticks dropped, links removed, casing changed). Only restore formatting when explicitly asked, or flag it once and move on.
- Read the file again before patching. The author often makes their own edits in parallel and exact strings drift.
