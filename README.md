# Teaching Online — SETU CPD

**Module 2** of the SETU Continuing Professional Development series for
part-time and industry-based lecturers. A clean, modern, self-paced SCORM 1.2
course built as a **standalone static site** — no build step, no server
framework, no external dependencies (brand fonts are self-hosted, JS is vanilla).

Built from the *Teaching Online — Full Narration & Build Script for Articulate
Rise On-Demand Session* (Script Unit 2), and styled to the **SETU Online Course
Brand Guide** and the *Lifelong Learning at SETU Design Toolkit*.

Derived from [`kenmccarthy/cpd-course-template`](https://github.com/kenmccarthy/cpd-course-template),
which carries the reusable shell (navigation, Rise layer, SCORM plumbing,
animations, accessibility conventions). Fixes to that shell are worth porting
back to the template so later modules inherit them.

**Audience:** Industry-based part-time lecturers with high subject expertise but
limited online teaching experience.
**Pitch level:** NFQ Level 8 (honours bachelor degree standard), with comparative
notes on Level 7 and Level 9 online teaching.
**Runtime:** ~30 minutes, 6 sections.

## Course outline

| Section | Topic | Time |
|--------:|-------|-----:|
| 1 | Welcome & orientation (objectives, Level 8 framing) | 1.5 min |
| 2 | In-person vs online teaching; Community of Inquiry; NFQ level and delivery mode | 5 min |
| 3 | Engaging adult learners online: methods and tools | 7 min |
| 4 | Active, peer, reflective and experiential learning online | 7 min |
| 5 | What makes a good online presentation | 6 min |
| 6 | Summary, references & reflective activity | 3.5 min |

Sections are numbered **1–6** everywhere the learner sees them. Internally each
`<section class="lesson">` keeps a 0-based `data-lesson` id (`0`–`5`) — that id is
what `localStorage` progress and the SCORM bookmark use, so renumbering the
display never disturbs saved progress.

### Theory covered

Community of Inquiry (Garrison, Anderson & Archer, 2000) · andragogy (Knowles,
1984) · social constructivism (Vygotsky, 1978) · Kolb's experiential learning
cycle (2015) · connectivism (Siemens, 2005; Downes, 2010). Full citations appear
in Section 6 with live DOI/publisher links where the script supplied them.

## Reflection-led, not quiz-led

The script is deliberately **reflection-led**. Knowledge checks appear only where
a factual or conceptual check genuinely adds value — there is exactly **one** in
the course (Section 5, on sustaining attention online). Every other section
instead asks learners to apply the concept to their own **industry background**,
through an ungraded reflection prompt. There are five in total.

That drives the completion model:

- `finalQuiz` in `js/course.config.js` is **empty**, so there is no graded quiz.
- The course reports SCORM **`completed`**, never `passed`/`failed`, and **sends
  no score**. `<adlcp:masteryscore>` is omitted from `imsmanifest.xml`.
- Knowledge-check answers are still written as `cmi.interactions.n` entries, so
  per-question analytics survive.
- The results dashboard reports *sections viewed*, *reflections written* and
  *activities explored* instead of a quiz score.

To make a future module graded: list the question ids in `finalQuiz`, mark those
knowledge checks with `data-final`, and restore `<adlcp:masteryscore>`.
`scripts/init_course.py` asks which model you want and writes both.

## Interactions (all native, no libraries)

| Widget | Section | What it does |
|---|---|---|
| **The three presences** | 2 | Side-tab explorer of teaching / social / cognitive presence, each with what it means online |
| **Online teaching by NFQ level** | 2 | Tabs comparing Level 7, 8 and 9 online task design (defaults to Level 8) |
| **Five engagement tools** | 3 | Side-tab explorer: live poll, breakout, chat, discussion board, check-ins — each with what it's best for |
| **Match the tool to the situation** | 3 | Drag-and-drop, tap-to-place *and* keyboard matching, with confetti on a perfect score |
| **Choose your approach** | 4 | Scenario chooser: four approaches to a 90-minute online session, each with its own trade-off feedback. Deliberately unscored — learners are nudged to open all four and compare |
| **Pre-flight checklist** | 5 | Tickable self-audit of the six presentation principles, with a progress ring |
| **Knowledge check** | 5 | One scenario MCQ with instant feedback and retry |
| **Reflections** | 2–5, 6 | Five ungraded industry-link prompts (saved locally, never submitted) with **export-to-file** |
| **Results dashboard** | 6 | Live tiles for sections viewed, reflections written and activities explored |

Which activities the dashboard counts is set by `activities` in
`js/course.config.js`, keyed by the id each widget emits.

### Figures

Self-building inline SVG, theme-aware, no external images: the **Community of
Inquiry Venn diagram**, **Kolb's experiential learning cycle**, a two-column
**in-person vs online comparison**, and **four quadrant cards** for active, peer,
reflective and experiential learning.

### Learner experience

- Left-hand lesson navigation with live **progress bar** and completed ticks
- **Scroll-reveal** entrances and **micro-interactions** — all disabled under `prefers-reduced-motion`
- Previous / Next buttons and **←/→ keyboard** navigation (ignored while a form control, tab list or matching token has focus)
- Progress, answers, activities and reflection notes **persist** in `localStorage`
- **Light / dark** theme (follows the OS, with a manual toggle)
- Fully **responsive** with a slide-out menu on mobile

## Rise-style learner experience (Lifelong Learning at SETU look)

The template follows the Articulate Rise pattern and the *Lifelong Learning at SETU
Design Toolkit* (see `docs/design-toolkit.md`):

- **Course overview page** — the front door: a Slate Grey hero with a gradient
  **U-shape** panel (title, subtitle, tagline "LEARN MORE. GO FURTHER."), a large
  cropped **gradient crest**, a *Start / Continue* button, and **lesson cards**
  showing duration and live status (not started / in progress / completed) with a
  progress bar. Also reachable from the sidebar's "Course overview" item.
- **Hero banner per lesson** — every lesson opens with the *same treatment as the
  overview*: a Slate Grey block with a gradient **U-panel** (eyebrow "Section N of 6",
  title, read time), the large cropped **gradient crest**, and a progress strip on
  the right (one segment per section, completed ones in Grass Green) with a
  "N of 6 sections completed" line. The eyebrow and strip are rendered by
  `js/rise.js` from `Course.SECTIONS`, so the counts are never hand-typed. To add a
  cover photo, place `<img class="hero__bg" src="assets/…" alt="">` as the first
  child of the `.hero` element — it sits behind the crest at reduced opacity.
- **Continue-button reveal** — lesson content is paced in chunks separated by
  `<div class="gate" data-gate></div>` markers. Each *Continue* reveals the next chunk
  with a staggered entrance and scrolls to it; the lesson's Next/Previous bar appears
  only after the last gate. Progress through the gates persists and feeds the lesson
  cards. `Course.rise.revealAll(lessonEl)` opens a lesson fully (testing/accessibility).
- **Horizontal slide transitions** — lessons slide in from the right (forward) or the
  left (back) with a crossfade; a plain swap under `prefers-reduced-motion`. The
  outgoing lesson is pinned at the scroll position the learner was reading (so that
  part is what slides away), the scroll reset is instant rather than smooth, and
  blocks already in view settle at once instead of staggering in on top of the slide —
  one motion per page change, no judder.
- **Rise block layout** — a wider 900px content column for full-bleed blocks, with prose
  held to a ~70-character measure for readability.

### Programme colour year

`programmeYear` in `js/course.config.js` selects the Lifelong Learning accent trio
(always on Slate Grey + White). It drives section accents, tints, mesh gradients,
heroes and cards:

| Year | Accent trio |
|---|---|
| `"2026/27"` (default) | Heather Purple · Sunset Red · Clover Pink |
| `"2027/28"` | Barrow Blue · Suir Blue · Grass Green |
| `"2028/29"` | Sea Green · Sunrise Yellow · Suir Blue |

Section accents cycle through the trio via `data-accent="1|2|3"` on each lesson.
Semantic colours stay fixed (Grass Green = correct, Sunset Red = incorrect).

### Tagline font

The campaign tagline uses **Compressa Condensed Black**, a licensed face. Drop
`assets/fonts/compressa.woff2` into the repo to enable it; until then it falls back to
DM Sans Bold. Set `showTagline: false` in the config to hide the tagline entirely.

### Icons

All UI icons come from a single **inline SVG sprite** at the top of `index.html`
(24px line icons adapted from Lucide, ISC licence) — no emoji, no icon font, no
external requests, so they render identically on every OS and LMS. Use one with

```html
<svg class="icon" aria-hidden="true" focusable="false"><use href="#i-check"></use></svg>
```

or from JavaScript with `Course.icon("check")`. Icons are decorative (the adjacent
text carries the meaning); add new `<symbol id="i-…">` entries to the sprite as
needed. Sizing follows the surrounding font size (`.icon` = 1.05em) with a few
context overrides in `css/styles.css` under *Icons + accessibility utilities*.

## Accessibility

The template is built to WCAG 2.1 AA and audited with axe-core (no violations
across the overview, lessons and the dark theme). Conventions to keep when
authoring new courses:

- **Landmarks & skip link** — `<main id="scroll">`, `<nav aria-label="Course
  sections">`, and a "Skip to course content" link that appears on keyboard focus.
- **Page changes are announced** — a visually hidden live region (`#a11yStatus`)
  receives "Section N of 6: …", "Course overview", "More of this section revealed"
  etc. via `Course.announce(text)`; focus moves to the new lesson's `<h1>` (or the
  newly revealed chunk after *Continue*) so screen-reader and keyboard users land on
  the new content. The active navigation item carries `aria-current="page"`.
- **Real widget semantics** — NFQ levels and the descriptor explorer are ARIA tab
  lists (roving tabindex, ←/→/Home/End); the accordion buttons expose
  `aria-expanded`/`aria-controls`; knowledge-check options are grouped under their
  question, feedback and scores are `role="status"`; reflection textareas are
  labelled by their prompt; budget items use `aria-pressed`; matching tokens are
  keyboard-operable buttons and every placement/removal is announced.
- **Keyboard** — everything works without a mouse: `Esc` closes the mobile menu
  (focus returns to the menu button), the global ←/→ page shortcuts stay out of the
  way of controls, and `:focus-visible` rings are visible on every colour (white on
  slate/gradients, accent elsewhere).
- **Contrast** — text tokens and the sidebar's white-on-slate opacities meet 4.5:1;
  colour is never the only signal (correct/incorrect also show a tick/cross and text).
- **Motion** — every animation and transition, including the slide between lessons,
  is disabled under `prefers-reduced-motion`.
- **Structure** — one `<h1>` per lesson, headings step by one level, figures are
  `role="img"` with a text alternative, decorative art is `aria-hidden`.

## SCORM 1.2 packaging

The course ships ready to package for an LMS. A single **SCO** (`index.html`) and
an `imsmanifest.xml` are included; `js/scorm.js` maps the course onto the SCORM
1.2 data model. It is a **no-op when no LMS is present**, so the same files still
run standalone from `file://`.

**Build the uploadable zip:**

```bash
python3 scripts/build_scorm.py
# -> dist/<course-slug>-scorm12.zip  (manifest at the root)
```

Upload that zip to your LMS, or to <https://cloud.scorm.com> to validate.

**What it reports**

| SCORM (CMI) field | Meaning |
|---|---|
| `cmi.core.lesson_status` | **`completed`** for this course (reflection-led, no graded quiz). With a `finalQuiz` configured it reports `passed` / `failed` instead |
| `cmi.core.score.raw` | Not sent for this course. With a graded quiz: final-quiz percentage (min 0, max 100) |
| `cmi.core.lesson_location` | Bookmark — the section the learner was on |
| `cmi.suspend_data` | Compact resume state (visited sections, Continue-gate progress, answers, activities). Kept **well under the SCORM 1.2 ~4 KB cap**; reflections are **excluded** (private, and local only) |
| `cmi.core.session_time` | Time on task |
| `cmi.interactions.n` | One entry per knowledge-check answer — see *Analytics* |

**Test the adapter offline:** append `?scorm=mock` to the URL to inject a mock
LMS that logs every SCORM call to an in-memory store (used by the automated tests).

## Analytics

Per the chosen design, the **LMS is the analytics store**: every knowledge-check
and pitch-check answer is written as a `cmi.interactions.n` entry, so completion
and per-question results appear in the LMS's own reporting — no third-party
scripts, no external calls, and nothing that breaks the standalone/offline
property. Reflection prompts report only that a note was saved and how long it
was, never its text.

- **Event bus** — all interactions emit typed events through `js/core.js`
  (`section.view`, `knowledge_check.answer`, `interaction.complete`,
  `quiz.complete`, `course.complete`, …). SCORM and analytics subscribe to these.
- **Dev event inspector** — append `?debug=1` to see a live on-screen log of
  every event (and whether an LMS is connected).
- **Optional self-hosted sink** — for non-LMS hosting, set
  `Course.analytics.endpoint = "https://…"` to POST events via `sendBeacon`.
  Disabled by default.

## Running it

It's static, so any of these work:

```bash
# Simplest: just open the file
open index.html            # macOS   (or double-click it)

# Or serve it (recommended for a shared/hosted copy)
python3 -m http.server 8000
# then visit http://localhost:8000
```

Deploy by copying the whole folder to any static host (GitHub Pages, Netlify,
an LMS file area, a shared drive, etc.).

## File structure

```
.
├── index.html                 # all course content + interactive markup (+ inline icon sprite)
├── imsmanifest.xml            # SCORM 1.2 package manifest (single SCO)
├── css/styles.css             # SETU design tokens, layout, components, animations
├── js/
│   ├── course.config.js       # per-course identity (title, slug, storeKey, quiz model, activities)
│   ├── core.js                # section list, state store and the event bus (foundation)
│   ├── scorm.js               # SCORM 1.2 adapter (+ ?scorm=mock test harness)
│   ├── analytics.js           # dev event inspector + optional endpoint sink
│   ├── animations.js          # scroll-reveal, count-ups, self-building diagrams
│   ├── confetti.js            # brand-coloured canvas confetti
│   ├── interactions.js        # course-specific widgets (scenario chooser, checklist)
│   ├── dashboard.js           # results dashboard + export-my-notes
│   ├── rise.js                # overview page, lesson cards, Continue-reveal
│   └── app.js                 # navigation, progress, theme, generic widgets
├── docs/design-toolkit.md     # Lifelong Learning at SETU design reference
├── scripts/
│   ├── build_scorm.py         # builds dist/<slug>-scorm12.zip
│   └── init_course.py         # interactive setup for a new course's identity
└── assets/
    ├── MONO_WHITE.png         # official SETU reversed (white) logo — used in the UI
    ├── MONO_BLACK.png         # official SETU mono-black logo (for light backgrounds)
    ├── RGB.png                # official SETU full-colour logo
    ├── setu-symbol.png        # the "U" symbol, used as a CSS mask
    └── fonts/                 # self-hosted DM Sans + Inter (variable WOFF2)
```

Load order in `index.html`: `course.config → core → scorm → analytics →
animations → confetti → interactions → dashboard → rise → app`. `course.config.js`
must load before `core.js` (which reads `window.CourseConfig`), and
`scorm.js` runs early so it can restore `suspend_data` into the shared state
before the widgets read it.

**Generic vs course-specific.** `app.js` holds the widgets every course reuses
(knowledge checks, reflections, matching, tabs, accordion); `interactions.js`
holds the ones this course adds. Both the matching and tabs components are keyed
by their `data-match` / `data-tabs` value, so a page can carry several of each and
track them separately.

## Logos

The official SETU logo files are used directly. The interface shows
`assets/MONO_WHITE.png` (the reversed/white lockup) in the sidebar and mobile
top bar, both of which sit on Slate Grey. `MONO_BLACK.png` and `RGB.png` are
kept in `assets/` for use on light backgrounds (e.g. print, certificates, or a
light header if you add one). Clear space is preserved around the logo and it is
displayed well above the 60px minimum.

`assets/favicon.png` is used as the browser-tab icon. `assets/setu-symbol.png`
(the official SETU "U" symbol) is used everywhere the course shows its "U"
motif — the cover graphic, the small eyebrow icon on each section, and the
watermark behind statement panels — via a CSS `mask-image` on the `.cover__u`,
`.u-mark`, and `.u-watermark` classes in `css/styles.css`, so it's still tinted
with `currentColor` (white on Slate, accent colours, dark-mode-aware) rather
than baked in as a fixed-colour image.

## Placeholders / items needing your input

- **Hero photography** — every section hero uses the gradient crest. Each one
  carries an HTML comment naming a suggested photo theme from the script; add an
  approved SETU photo via `<img class="hero__bg" src="assets/…" alt="">` as the
  first child of the `.hero` element.
- **Further-reading links** — the list in Section 6 is plain text. Add live
  hyperlinks to SETU/QQI/National Forum resources, and to the specific online
  tools supported at your institution. (The six **References** below it already
  carry the citations from the script.)
- **Institutional tool names** — the course deliberately describes tools
  generically (live poll, breakout, discussion board) rather than naming
  products. Swap in the supported platform names if you want it more concrete.

## Brand fonts

DM Sans and Inter (both open-source, and both named in the SETU guide) are
self-hosted as variable WOFF2 files under `assets/fonts/`, so the course renders
with the correct brand typography **offline and with no external requests**. If
you ever need additional weights/styles, add the WOFF2s and extend the
`@font-face` block at the top of `css/styles.css`.

All diagrams called for in the script (the Community of Inquiry Venn diagram,
Kolb's experiential learning cycle, the in-person vs online comparison, and the
four learning-approach quadrants) are rendered as inline SVG or CSS in the SETU
palette, so they stay crisp and theme-aware without external images.

## A note on dark mode

The SETU guide describes a white-background identity. An optional, restrained
**slate-based dark theme** is included as a learner accessibility feature (toggle
in the sidebar). The default is the on-brand light theme; the dark theme keeps
Slate Grey and the approved accents.
