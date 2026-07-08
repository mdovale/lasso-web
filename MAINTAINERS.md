# Keeping the LASSO website up to date

_A practical guide for group members. No programming experience needed._

The website reads everything it shows — names, papers, projects, news, photos
— from a handful of plain-text files in the **`content/`** folder. Updating
the site means editing those files and letting the site rebuild. You never
need to touch the code.

## The golden rules

1. **Only edit files inside `content/`, and only add files inside `public/`.**
   Everything else is code — leave it alone.
2. **Copy an existing entry and modify it.** Every file starts with a comment
   block explaining its format, and existing entries are your best template.
3. **Indentation matters.** These files are YAML: use spaces (never tabs) and
   keep the same indentation as the entry you copied.
4. **Check your work** by running `npm run validate:content` (see below). If
   something is wrong, the message tells you which file and which field.
5. When in doubt, make a small change, check it, and commit. Small changes are
   easy to undo; big ones are not.

## One-time setup

You need [Node.js](https://nodejs.org) (version 20 or newer) and
[Git](https://git-scm.com). Then, in a terminal:

```bash
git clone <repository-url>
cd lasso-web
npm install
```

## Your editing workflow

```bash
git pull                      # 1. get the latest version
# 2. edit files in content/ (any text editor works; VS Code is nice)
npm run validate:content      # 3. check your edits
npm run dev                   # 4. preview at http://localhost:3000 (optional)
git add content/ public/      # 5. save your changes to git
git commit -m "Add new group member Jane Doe"
git push                      # 6. publish — GitHub Pages deploys automatically
```

If `validate:content` prints a ✗, read the message — it names the file and
field (for example `people.yaml → people → 3 → name: Required`). Fix it and
run the command again. **The site can never go live with broken content**; the
build refuses to publish it.

## Common tasks

### Add a person

1. Open `content/people.yaml`.
2. Copy an existing entry (from `- id:` to the blank line) into the right
   spot.
3. Change the `id` (lowercase, hyphens, unique — e.g. `jane-doe`), name,
   role, `group` (faculty / postdocs / students / alumni), and bio.
4. Put a headshot (a square-ish JPEG, roughly 800×800 px) in
   `public/images/people/` and set
   `headshot: /images/people/jane-doe.jpg`. No photo yet? Skip the
   `headshot` line — the site shows a tidy placeholder.

### Move someone to alumni

In their entry, change `group: students` to `group: alumni` and add:

```yaml
years: 2021–2026
currentPosition: Now at NASA Goddard
```

### Add a publication

1. Open `content/publications.yaml` and copy an entry to the top of the list.
2. Fill in `id` (e.g. `doe-2027-interferometry`), `title`, `authors` (one per
   line), `year`, and `venue`.
3. Add whatever links you have: `doi` (just the number, like
   `10.1364/AO.493108`), `arxiv` (full URL), or `pdf` (put the file in
   `public/publications/` and write `/publications/Doe2027.pdf`).
4. Want it on the homepage? Add `featured: true` — and remove that line from
   an older paper so the homepage stays at 3–4 highlights.

### Post a news item

1. Open `content/news.yaml` and copy an entry to the top.
2. Set a unique `slug` (it becomes the web address, `/news/<slug>`), the
   `date` as `YYYY-MM-DD`, a one-sentence `summary`, and the `body`
   (paragraphs separated by a blank line; `**bold**` and
   `[links](https://example.com)` work).
3. Optionally add an image in `public/images/news/` and link related
   `people:` or `projects:` by their ids.

### Add a photo or video to the gallery

1. Copy the photo into `public/media/` (JPEG, at most ~1600 px wide is
   plenty).
2. Add an entry in `content/media.yaml` — copy one, change the `id`, `title`,
   `type` (usually `lab-photo` or `image`), `src`, and **always write `alt`
   text** (a short description for screen readers).
3. For videos, paste a YouTube or Vimeo URL as `src` with `type: video` — the
   player is embedded automatically.

### Update a project

Projects live in `content/projects.yaml`. Edit the `summary` (card text) or
`description` (project page text) freely. The lists at the bottom of each
entry connect the project to people, publications, and media by their ids —
add ids there when a new paper or member belongs to the project.

### Change page wording, contact details, or menus

- Headlines and intro text of every page: `content/pages.yaml`
- Group name, email, address, footer: `content/site.yaml`
- Menu items: `content/navigation.yaml`
- Job openings on the Join page: `content/pages.yaml` under `join → openings`

## Things that still say PLACEHOLDER

The site launched with example entries marked `PLACEHOLDER` (and `# EDIT:`
comments for details like phone numbers). Search the `content/` folder for
those words and replace them with real information as it becomes available.

## If something goes wrong

- **Validation error you can't figure out** — you probably broke the
  indentation. Compare your entry against its neighbors, or undo with
  `git checkout -- content/<file>.yaml` and start over.
- **The site looks broken locally** — stop the dev server (Ctrl-C) and run
  `npm run dev` again.
- **Really stuck** — nothing publishes until it passes validation, so you
  can't break the live site. Ask the group's website maintainer, or open an
  issue in the repository describing what you changed.
