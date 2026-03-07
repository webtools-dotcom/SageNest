
Task: Add a new blog post to the project.

I will provide a complete blog object (slug/title/description/readingTime/updatedAt/faq/content).  
You must insert it at the TOP of the `blogPosts` array in `src/data/blogPosts.ts` and then complete the full blog publish pipeline.

Follow these requirements exactly:

1) Understand existing structure before editing:
- Read `codex.md`
- Read `latestchange.md` (to avoid contradictions)
- Inspect `src/data/blogPosts.ts` format and keep style consistent.

2) Apply my content:
- Insert the provided blog object at the TOP of `blogPosts` in `src/data/blogPosts.ts`.
- Do not alter unrelated posts.
- Do not change field names or types.

3) Regenerate static/blog/indexing artifacts using project scripts:
- `npm run generate:blog`
- `npm run generate:redirects`
- `npm run generate:sitemap`

This should create/update:
- `public/blog/<slug>/index.html`
- `public/_redirects`
- `public/sitemap.xml`

4) Validate:
- `npm run check:blog-sync`
- `npm run check:redirects`
- `npm run check:sitemap`
- If anything fails, fix and rerun until all pass.

5) Update changelog:
- Prepend a new dated entry to `latestchange.md` with:
  - what was changed
  - why we changed it

6) Git workflow:
- Show `git status`
- Commit all relevant files with a clear message like:
  - `Add blog post: <slug>`
- Create a PR using the make_pr tool with:
  - concise title
  - body containing summary + testing commands run.

7) Guardrails:
- Keep changes minimal and scoped only to this task.
- No unnecessary refactors.
- No unresolved conflict markers.
- If README needs updating due to changed documented behavior, update it; otherwise leave README untouched.
- In final output, explicitly state:
  - Whether any SUPABASE changes are needed
  - Whether any Cloudflare env/config changes are needed

After I send the blog object, execute all steps end-to-end.
