# Daniil’s website

Astro source for my personal website at `https://daniilnahl.github.io/`. Order is the default layout; Chaos uses the same content in a typographic layout.

## Local development

The project requires Node.js 22.23.4 or newer and npm. Use Node 22 to match the GitHub Actions workflows. If these are already installed, skip to **Run the project** below.

### Install on Ubuntu (Bash)

Install the tools needed to download Node.js:

```sh
sudo apt update
sudo apt install -y curl ca-certificates git
```

Install [nvm](https://github.com/nvm-sh/nvm#installing-and-updating), then use it to install Node 22 and its bundled npm. These commands install nvm under your user account and load it into the current terminal:

```sh
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.41.0/install.sh -o /tmp/nvm-install.sh
NVM_DIR="$HOME/.nvm" bash /tmp/nvm-install.sh
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"

nvm install 22
nvm use 22
nvm alias default 22
node --version
npm --version
```

`node --version` should report `v22.x.x`, at least `v22.23.4`; `npm --version` should print a version number. The nvm installer adds its startup configuration to your shell profile. Reopen the terminal in your editor if it was already running before installation. Node release information is available on the [official download page](https://nodejs.org/en/download).

If a new terminal reports `nvm: command not found`, load it with the `export NVM_DIR` and `. "$NVM_DIR/nvm.sh"` commands above, then run `nvm use 22`. If downloads fail with “Could not resolve host,” restore network/DNS access before retrying the failed download. Run project npm commands as your normal user; they do not require `sudo`.

### Run the project

In a terminal opened at the repository root (the folder containing `package.json`):

```sh
npm install
npm run dev
```

The default local path is `http://localhost:4321/`. Astro prints the local URL. The base is configurable; it is used in development as well as production.

```sh
npm run check
npm test
npm run build
npm run preview
```

`check` validates source content and runs Astro’s type checker. `build` also checks generated routes and local asset links. Preview serves the production output. No backend, API keys, or account connection is needed.

A `package-lock.json` is included. Use `npm ci` for a clean install of the locked dependencies, as the GitHub Actions workflows do. Use `npm install` when intentionally changing dependencies.

## Content

- `src/content/projects/*.md`: case studies; automatically appear in `/projects/`, receive a detail route, and enter the homepage index and Chaos composition.
- `src/content/experiences/*.md`: roles and research; automatically appear at `/experience/#filename`.
- `src/content/posts/*.md`: articles; `draft: true` excludes an article from every public surface. The launch collection is empty.
- `src/content/personal/*.md`: personal collection entries at `/about/#filename`. Entries with `placeholder: true` stay unpublished; the personal collection is currently empty.
- `src/data/site.json`: displayed name, email, biography, education, profile links, navigation, publication origin, and default base.
- `src/data/skills.json`: technical skill groups shown on About.
- `src/data/topics.json`: names and descriptions for the project index’s topic threads.
- `src/data/relationships.json`: optional content relationships; initially empty.
- `src/data/listening.json`: your manually maintained weekly top five.
- `src/data/project-history.json`: commit-range source records for the four projects whose dates come from repository history.

Frontmatter is written as a JSON object between YAML delimiters. JSON is valid YAML; this convention allows the additional content validator to run using Node alone. Use lowercase kebab-case filenames as stable slugs. Do not add a separate `slug` field.

Example project:

```md
---
{
  "title": "A new project",
  "summary": "A short, factual description.",
  "tags": ["software"],
  "technologies": ["Rust"],
  "featured": false,
  "placeholder": false
}
---

## Problem
Describe the actual problem and your contribution.

## Approach and results
Explain what was built and what can be substantiated.
```

`role`, `repository`, `demo`, `dates`, `dateLabel`, `image`, and `chaos` are optional for projects. Image objects use `src` (a path under `/images/`), meaningful `alt`, `width`, and `height`. Put assets in `public/images/`. Add an asset source/license record to `docs/SOURCES.md`. Missing optional images are fine; supplied image paths must resolve.

For articles, add `published` as an ISO date and explicitly set `draft: true` or `false`; optionally add `updated`. The collection schema lives in `src/content.config.ts`. Topics used in tags must exist in `topics.json`. Content references use collection prefixes such as `project:aqmod` and `experience:uw-research`. References to absent entries fail validation. The homepage work index automatically lists projects and experiences, and tags still group projects in **Explore a thread**.

All entries receive a deterministic Chaos treatment. Optional treatment fields are `geometry` (`block`, `band`, `cylinder`), `palette` (`electric-blue`, `azure`, `ice-blue`, `sand`), `scale` (`small`, `medium`, `large`), `rotation` (−12 to 12 degrees), and an optional local `artwork` path under `/images/` for decorative artwork. The initial featured projects have specific placement in `Labyrinth.astro`; further projects flow into the composition’s collection below them. New nonfeatured entries do not require graph or layout changes.

Experience entries can use `status` (`incoming`, `current`, or `completed`), `location`, and an optional `period` label such as `Summer 2027` when exact months are unavailable. Incoming roles stay explicitly labeled. Homepage and experience-page dates use the same component. Display order is configured in `src/data/presentation.json`.

The site content comes from my résumé and project repositories. Source records are in [SOURCES.md](docs/SOURCES.md). Local clarification notes are excluded from the public source package.

## Behavior and accessibility

Order is the default. Chaos is an explicit URL state, `?mode=chaos`, preserved on internal content links. Switching retains the route, hash, and other query parameters. Browser Back/Forward restores mode; no cross-session preference is saved. Reduced motion switches immediately. Without JavaScript, all core routes, navigation, and the text index work in Order.

In Order, projects and experiences are available through a plain-link work index. Each link opens its destination directly, including without JavaScript. Experience remains above Projects. The node network, preview interaction, and React dependencies have been removed. Both modes and the project index’s **Explore a thread** section remain available.

The footer’s **Blog feed (RSS)** link is a machine-readable subscription feed. Add its URL to a feed reader to receive future blog posts. It remains valid while the blog is empty.

## Music

Music is a manually curated **weekly top five**. Edit `src/data/listening.json` with a `weekOf` date and exactly five ranked `{ "title", "artist", "url" }` entries. Both About and Chaos use that same list. An empty list remains empty until you supply real tracks; a saved week stays dated if you skip an update.

See [the weekly music guide](docs/WEEKLY-MUSIC.md) for the copyable format and weekly update steps. No Spotify connection, API credentials, or automatic refresh is required.

## Résumé and project dates

The owner-approved original résumé is copied to `public/documents/daniil-nahliuk-resume.pdf` and linked from the homepage, About, and footer. Replace that PDF when updating the public résumé. These links work under the configured deployment base and do not carry mode query parameters.

The workshop, DJRTrailFinder, stock-tracker, and small-projects date ranges use the oldest and newest commits reachable from their repositories’ default branches, observed on 2026-11-22. They are labeled **Repository activity** in the index and case-study metadata; they are not personal employment dates. The observed UTC timestamps and commit links are recorded in `src/data/project-history.json`. This is an authored snapshot, not a live GitHub integration. AQMod and the STM32 clock keep their résumé date ranges.

## Verification

```sh
npm test
npm run check
npm run build
node scripts/test-post-fixture.mjs
npx playwright install --with-deps chromium
npm run test:browser
```

On Ubuntu, `playwright install --with-deps chromium` installs Chromium and its required system libraries; installing the system libraries may request your sudo password. Run these commands from the repository root after `npm install`.

The fixture check creates one published and one draft post, builds, verifies public inclusion/exclusion, removes both source fixtures, then rebuilds the real launch state. It refuses to overwrite files. Browser checks run against the built preview at desktop, tablet, and mobile widths, covering mode history, route context, reduced motion, horizontal overflow, empty writing, direct work links, and navigation without JavaScript. CI runs the checks under root and repository bases.

Test an alternate base locally by applying the same environment to build and preview:

```sh
BASE_PATH=/ npm run build
BASE_PATH=/ npm run test:browser
BASE_PATH=/another-repo/ npm run build
BASE_PATH=/another-repo/ npm run test:browser
```

Also visually review the built homepage in both modes around 1440px, 768px, and 390px. Automated behavioral checks do not substitute for checking the composition, overlap, long titles, contrast, and touch usability.

## GitHub Pages

The profile-site repository is [`daniilnahl/daniilnahl.github.io`](https://github.com/daniilnahl/daniilnahl.github.io). The production address is `https://daniilnahl.github.io/`, with a root base path.

The **Deploy GitHub Pages** workflow is manual and runs from `main`. After merging the prepared source, enable **GitHub Actions** in repository Settings → Pages, then run the workflow. Setup and profile-link instructions are in [PUBLISHING.md](docs/PUBLISHING.md).

`SITE_URL` and `BASE_PATH` can override the build defaults. Astro reads these from the shell environment; copying `.env.example` to `.env` alone does not configure `astro.config.mjs`. Canonical URLs, sitemap, RSS, navigation, and downloads all use the configured base. Routes are real static directories and need no server rewrites.

Use `node scripts/package-pages.mjs` to create `artifacts/profile-pages-source.tar.gz` and its manifest. That command does not publish anything. The upload commands are in [PUBLISHING.md](docs/PUBLISHING.md).
