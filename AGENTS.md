# AGENTS.md

Guidance for AI agents working in this repository.

## Project

Matthew Harvey's portfolio: an Astro + Tailwind CSS site with blog/case-study content.
Node 22+ is required (see `.nvmrc` and `package.json` `engines`).

## Commands

| Command               | Purpose                                                |
| :-------------------- | :----------------------------------------------------- |
| `npm install`         | Install dependencies                                   |
| `npm run dev`         | Start the dev server at `localhost:3000`               |
| `npm run build`       | Build the production site to `dist/`                   |
| `npm run preview`     | Serve the production build locally (port 4321)         |
| `npm run check`       | Astro, ESLint and Prettier checks                      |
| `npm run fix`         | Auto-fix ESLint and Prettier issues                    |
| `npm run pulse:local` | Audit the local production build against `.pulse.json` |

Run `npm run check` and `npm run build` before opening a pull request.

## Pull requests

- Keep each PR focused on a single change. Split unrelated refactors, fixes and features.
- Use the existing conventional-commit style for the PR title and commits, for example
  `fix(skills): give icons intrinsic dimensions so they render`.
- In the description, cover:
  - **What changed** and **why**.
  - **How it was verified** (commands run, checks passed).
  - Any follow-up work or known limitations.
- The Pulse workflow (`.github/workflows/pulse.yml`) builds the PR commit, audits the
  production output and posts a sticky performance/accessibility comment. Address
  regressions, or update `.pulse.json` when a new cost is intentional.

### Visual verification screenshots

Any PR that changes rendered UI (layout, styling, components, imagery or page content
that is visible to users) must include visual verification screenshots in the PR
description. Screenshots are how reviewers confirm the change looks right without
checking out the branch.

- Capture from the **production build** (`npm run build && npm run preview`), not the
  dev server, so the screenshots match CI and deployment.
- Include **before and after** for changed UI, and cover every affected route.
- Cover at least:
  - **Desktop** (1440×900) and **mobile** (390×844).
  - **Light and dark** themes when the change touches colours, contrast or theming.
- State the route, viewport and theme under each screenshot so it is unambiguous.
- Attach screenshots to the PR by dragging them into the description or a comment;
  GitHub uploads and embeds them. Do **not** commit them: `screenshots/` is gitignored
  and captures are working artifacts.
- If a PR genuinely has no visual impact, say so explicitly ("No visual changes") and
  explain why screenshots are not applicable.

## Content and assets

- Blog posts and case studies live in `src/data/post/` as Markdown.
- Configuration is in `src/config.yaml`; site assets are under `src/assets/` and `public/`.
