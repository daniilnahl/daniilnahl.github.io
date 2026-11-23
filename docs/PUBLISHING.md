# Publish the profile site

Target repository: [daniilnahl/daniilnahl.github.io](https://github.com/daniilnahl/daniilnahl.github.io)

Target address: **https://daniilnahl.github.io/**

This is a GitHub user site, so its repository name matches the account and the site is served at `/`. `src/data/site.json` uses that origin and root base. No custom domain, token, backend, or paid hosting is needed for this setup.

## Upload the prepared source

The local copy and clean source package are ready. The connected GitHub integration returned `403: Resource not accessible by integration` when creating the branch, so no source branch or PR was created by this task.

The archive is in **`artifacts/profile-pages-source.tar.gz`**, with its file hashes in **`artifacts/profile-pages-manifest.json`**. Open a normal terminal at the original project folder and run:

```sh
pages_archive="$PWD/artifacts/profile-pages-source.tar.gz"
pages_checkout="$(mktemp -d)"
git clone https://github.com/daniilnahl/daniilnahl.github.io.git "$pages_checkout/site"
cd "$pages_checkout/site"
git switch -c setup/profile-pages
tar -xzf "$pages_archive"
git status --short
git add .
git commit -m "Add personal website and GitHub Pages setup"
git push -u origin setup/profile-pages
```

Then open [the branch comparison](https://github.com/daniilnahl/daniilnahl.github.io/compare/main...setup/profile-pages?expand=1) and create a draft pull request. Review the source and check results before merging. Use your normal GitHub authentication for the push; no token belongs in the source files.

## First publication

1. Review and merge the prepared site-source PR into `main`.
2. Open [repository Settings → Pages](https://github.com/daniilnahl/daniilnahl.github.io/settings/pages). Under **Build and deployment**, select **GitHub Actions** as the source.
3. Open **Actions → Deploy GitHub Pages → Run workflow**. Select `main` and run it.
4. Wait for the build and deployment jobs to finish. The deployment’s environment link should open `https://daniilnahl.github.io/`.
5. On your GitHub profile, choose **Edit profile** and set the **Website** field to `https://daniilnahl.github.io/`.

The deployment workflow is manual and accepts `main` only. A PR, draft branch, or ordinary push does not publish the site. The build installs locked dependencies, validates content/types, runs unit tests, builds Astro, checks generated links, and uploads only `dist/`. The deploy job has Pages write and OIDC permissions; no personal access token is required. Pages must be enabled in Settings before the first deployment.

GitHub’s setup reference: [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

## Later updates

Edit the content, push a reviewed change to `main`, and run **Deploy GitHub Pages** again. Weekly songs are edited in `src/data/listening.json`; see [WEEKLY-MUSIC.md](WEEKLY-MUSIC.md).

To check the production output locally:

```sh
npm ci
npm run check
npm test
npm run build
npm run preview
```

The default local URL is `http://localhost:4321/`. Check direct project-page visits, résumé downloads, RSS, and both display modes. The Pages workflow can derive a repository base for a fork or project site, but the intended profile site uses `/`.

## Prepare a clean source package

When working from the original local project folder, this command makes a clean source copy and archive:

```sh
node scripts/package-pages.mjs
```

It prints a temporary source directory and saves the archive and SHA-256 manifest into the project’s `artifacts/` folder. It copies application source, public assets, workflows, tests, dependency/config files, and the maintenance docs. It excludes `node_modules`, `dist`, `.astro`, actual `.env` files, the original information folder, local clarification answers, review notes, and implementation-history notes. The already-approved public résumé under `public/documents/` is included.

The package is source for GitHub Actions to build; it is not a second hosting service or a prebuilt Pages deployment. Keep the manifest with the package when reviewing or uploading it. Nothing is published by the packaging command.
