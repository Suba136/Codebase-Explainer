# DESIGN.md — Codebase Explainer

> **Design Direction:** Light-mode futuristic neumorphism with a verdant green palette. Think a biopunk lab terminal — soft, raised, organic surfaces with glowing green accents and crisp technical typography. Feels alive, intelligent, and precise.

---

## 1. Design Philosophy

**Concept: "Living Lab"** The UI feels like a high-tech botanical interface — clean white/sage surfaces with medium neumorphic depth, accented by sharp electric greens. Every raised panel feels like a specimen tray; every inset input like a precise sensor well. Futuristic but warm. Intelligent but approachable.

**One unforgettable detail:** The sidebar is a vertical "spine" — narrow, raised, neumorphic column with icon-only nav items that bloom into labels on hover, like leaves unfolding.

---

## 2. Color Palette

```css
:root {
  /* Base surfaces */
  --bg-base:        #e8ede9;   /* Soft sage-white — main page background */
  --bg-surface:     #eef3ef;   /* Slightly lighter — card/panel faces */
  --bg-deep:        #dde4de;   /* Slightly darker — inset wells, inputs */

  /* Neumorphic shadows */
  --shadow-light:   #ffffff;         /* Highlight (top-left) */
  --shadow-dark:    #c8d0c9;         /* Shadow (bottom-right) */

  /* Neumorphic mixins */
  --neu-raised:     6px 6px 14px var(--shadow-dark), -6px -6px 14px var(--shadow-light);
  --neu-inset:      inset 4px 4px 10px var(--shadow-dark), inset -4px -4px 10px var(--shadow-light);
  --neu-raised-sm:  3px 3px 8px var(--shadow-dark), -3px -3px 8px var(--shadow-light);

  /* Brand greens */
  --green-primary:  #22c55e;   /* Electric green — CTAs, active states */
  --green-glow:     #16a34a;   /* Deep green — hover, pressed states */
  --green-soft:     #bbf7d0;   /* Mint — subtle highlights, tags */
  --green-muted:    #86efac;   /* Medium mint — borders, dividers */

  /* Text */
  --text-primary:   #1a2e1c;   /* Near-black green — headings */
  --text-secondary: #4a6b4e;   /* Forest green — body text */
  --text-muted:     #7a9b7e;   /* Sage — placeholders, metadata */
  --text-on-accent: #ffffff;   /* White — text on green buttons */

  /* Semantic */
  --success:        #22c55e;
  --warning:        #f59e0b;
  --error:          #ef4444;
  --info:           #06b6d4;
}
```

---

## 3. Typography

```css
/* Import in index.css */
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap');

:root {
  --font-display:  'Syne', sans-serif;      /* Headings, nav labels, page titles */
  --font-body:     'Inter', sans-serif;     /* Body text, descriptions */
  --font-mono:     'DM Mono', monospace;    /* Code, file paths, metadata, badges */
}
```

**Usage rules:**

* Page titles → `Syne 700–800`, `var(--text-primary)`
* Section headings → `Syne 600`, `var(--text-primary)`
* Body / descriptions → `Inter 400`, `var(--text-secondary)`
* Code snippets, paths, stats → `DM Mono 400`, `var(--green-glow)`
* Nav labels → `Syne 600`, uppercase, letter-spacing `0.08em`

---

## 4. Layout Architecture

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  ┌──────┐  ┌───────────────────────────────┐    │
│  │      │  │                               │    │
│  │ SIDE │  │        MAIN CONTENT           │    │
│  │  BAR │  │                               │    │
│  │      │  │   (scrollable, padded)        │    │
│  │ 64px │  │                               │    │
│  │      │  └───────────────────────────────┘    │
│  │      │                                       │
│  └──────┘                                       │
│                                                 │
└─────────────────────────────────────────────────┘
```

* **No top navbar. No footer.**
* **Sidebar only** — fixed left, full viewport height
* Default width: `64px` (collapsed, icon-only)
* Hover/active expanded: `220px` (icons + labels)
* Main content: `margin-left: 64px`, expands to `220px` when sidebar opens
* Sidebar transition: `width 0.3s cubic-bezier(0.4, 0, 0.2, 1)`

### Responsive

* **≥ 1024px:** Sidebar always visible (collapsed by default)
* **768px–1023px:** Sidebar icon-only, no label expansion
* **< 768px:** Sidebar becomes a bottom icon bar (5 icons max)

---

## 5. Sidebar Design

### Structure (`Layout.jsx`)

```
Sidebar (fixed, left, full height)
├── Logo mark (top)
├── Nav items (middle, flex-grow)
│   ├── NavItem (icon + label)
│   └── ...
└── Settings / User avatar (bottom)
```

### Visual spec

```css
.sidebar {
  width: 64px;
  background: var(--bg-surface);
  box-shadow: var(--neu-raised);
  border-radius: 0 20px 20px 0;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
}

.sidebar:hover {
  width: 220px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 18px;
  border-radius: 14px;
  margin: 4px 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-muted);
}

.nav-item:hover {
  background: var(--bg-deep);
  box-shadow: var(--neu-inset);
  color: var(--green-primary);
}

.nav-item.active {
  background: var(--bg-deep);
  box-shadow: var(--neu-inset);
  color: var(--green-primary);
}

.nav-item.active .nav-icon {
  filter: drop-shadow(0 0 6px var(--green-primary));
}

.nav-label {
  font-family: var(--font-display);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s ease 0.1s;
}

.sidebar:hover .nav-label {
  opacity: 1;
}
```

### Nav items & Lucide icons


| Page/Component | Lucide Icon      | Label      |
| -------------- | ---------------- | ---------- |
| Landing        | `<Home />`       | Home       |
| Repo           | `<FolderGit2 />` | Repository |
| Ingest         | `<Upload />`     | Ingest     |
| GetRepo        | `<GitBranch />`  | Get Repo   |
| Orient         | `<Compass />`    | Orient     |
| Complexity     | `<BarChart3 />`  | Complexity |
| DataModel      | `<Database />`   | Data Model |

**Bottom section icons:**

* `<Settings />` — Settings (muted)
* `<HelpCircle />` — Help (muted)

### Logo mark

```
Top of sidebar: a small SVG/icon mark — a stylized `</>` or circuit-leaf
symbol in --green-primary, centered in the 64px width.
On expand: logo text "CE" or "CodeEx" appears in Syne 800.
```

---

## 6. Component Patterns

### Cards / Panels

```css
.card {
  background: var(--bg-surface);
  border-radius: 20px;
  padding: 24px;
  box-shadow: var(--neu-raised);
}

.card-inset {
  background: var(--bg-deep);
  border-radius: 14px;
  padding: 16px;
  box-shadow: var(--neu-inset);
}
```

### Buttons

**Primary (CTA):**

```css
.btn-primary {
  background: var(--green-primary);
  color: var(--text-on-accent);
  border-radius: 12px;
  padding: 10px 24px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  border: none;
  box-shadow: 4px 4px 10px rgba(34,197,94,0.3), -2px -2px 6px rgba(255,255,255,0.8);
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn-primary:hover {
  background: var(--green-glow);
  box-shadow: 4px 4px 14px rgba(22,163,74,0.45), -2px -2px 6px rgba(255,255,255,0.8);
  transform: translateY(-1px);
}

.btn-primary:active {
  box-shadow: inset 2px 2px 6px rgba(0,0,0,0.15);
  transform: translateY(0);
}
```

**Secondary (ghost-neumorphic):**

```css
.btn-secondary {
  background: var(--bg-surface);
  color: var(--text-secondary);
  border-radius: 12px;
  padding: 10px 24px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  box-shadow: var(--neu-raised-sm);
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn-secondary:hover {
  color: var(--green-primary);
  box-shadow: var(--neu-raised);
}

.btn-secondary:active {
  box-shadow: var(--neu-inset);
}
```

### Inputs / Text fields

```css
.input {
  background: var(--bg-deep);
  box-shadow: var(--neu-inset);
  border: none;
  border-radius: 12px;
  padding: 12px 16px;
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--text-primary);
  outline: none;
  width: 100%;
  transition: box-shadow 0.2s ease;
}

.input::placeholder {
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.82rem;
}

.input:focus {
  box-shadow: var(--neu-inset), 0 0 0 2px var(--green-muted);
}
```

### Badges / Tags

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: var(--green-soft);
  color: var(--green-glow);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 20px;
}
```

### Code / Path display

```css
.code-pill {
  background: var(--bg-deep);
  box-shadow: var(--neu-inset);
  border-radius: 8px;
  padding: 2px 10px;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--green-glow);
}
```

### Dividers

```css
.divider {
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    var(--green-muted),
    transparent
  );
  margin: 16px 0;
}
```

---

## 7. Page-by-Page Design Specs

### 7.1 Landing (`Landing.jsx`)

**Layout:** Centered hero, full viewport height

**Elements:**

* Large `Syne 800` headline: `"Understand Any Codebase."` — `var(--text-primary)`
* Subtitle in `Inter 300`: `"Ingest. Analyze. Chat."` — `var(--text-secondary)`
* Animated circuit/node SVG background — subtle, sage-toned, low opacity
* Two CTA buttons: **"Explore a Repo"** (primary) + **"Upload Code"** (secondary)
* 3 stat pills below CTAs: raised neumorphic chips showing e.g. `12k repos analyzed`, `99ms avg response`, `GPT-4o powered`
* Green glowing dot (pulse animation) next to "Service Online" badge in bottom-left

### 7.2 Repo (`Repo.jsx`)

**Layout:** Two-column split (40/60)

**Left panel (raised card):**

* Repo metadata: name, language badge, star count, last updated
* File tree explorer — neumorphic inset panel, collapsible nodes
* `DM Mono` for file names/paths

**Right panel (raised card):**

* Chat interface for querying codebase insights
* Inset message bubbles: user messages right-aligned (green accent), AI responses left-aligned (sage surface)
* Inset textarea input at bottom + send button

### 7.3 Ingest (`Ingest.jsx`)

**Layout:** Single centered card, max-width 640px

**Elements:**

* Drag-and-drop zone: large inset neumorphic rectangle with dashed green border on hover
* File type badges: `.js`, `.py`, `.go`, `.ts` etc. in soft green pills
* Upload progress: a thin green progress bar inside an inset track
* Status messages in `DM Mono`

### 7.4 GetRepo (`GetRepo.jsx`)

**Layout:** Single centered card, max-width 560px

**Elements:**

* Inset input for GitHub URL (with `<Github />` lucide icon prefix)
* "Fetch Repository" primary button
* Animated loading state: spinning `<Loader2 />` icon in green
* Result preview card (raised) showing repo name, description, language

### 7.5 Orient (`Orient.jsx`)

**Layout:** Full-width with grid of info cards

**Elements:**

* Architecture overview diagram — SVG node graph, green lines, neumorphic node bubbles
* Key metrics row: 4 raised stat cards (files, functions, dependencies, lines of code)
* Entry points list — inset scrollable panel with `DM Mono` paths

### 7.6 Complexity (`Complexity.jsx`)

**Layout:** Dashboard — top metrics + chart + table

**Elements:**

* 3 top KPI cards (raised): Avg Complexity, Hotspots, Technical Debt Score
* Chart area: inset neumorphic panel containing bar/treemap chart (use recharts or similar)
* Color-coded complexity: green (low) → yellow → red (high)
* File complexity table below: alternating inset rows

### 7.7 DataModel (`DataModel.jsx`)

**Layout:** Full-width canvas + sidebar detail panel

**Elements:**

* Entity relationship diagram — SVG/canvas, neumorphic node cards with raised shadows
* Green connection lines between entities
* Clicking a node slides in a right detail panel (raised card)
* Schema fields in `DM Mono` with type badges

---

## 8. Motion & Micro-interactions

```css
/* Page enter transition (apply to main content wrapper) */
@keyframes pageEnter {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-enter {
  animation: pageEnter 0.35s cubic-bezier(0.4, 0, 0.2, 1) both;
}

/* Pulse for "online" indicator */
@keyframes pulse-green {
  0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5); }
  50%       { box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--green-primary);
  animation: pulse-green 2s ease infinite;
}

/* Sidebar nav icon glow on active */
@keyframes icon-glow {
  0%, 100% { filter: drop-shadow(0 0 4px var(--green-primary)); }
  50%       { filter: drop-shadow(0 0 10px var(--green-primary)); }
}

.nav-item.active .nav-icon {
  animation: icon-glow 2.5s ease infinite;
}

/* Loading shimmer for skeleton states */
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-deep) 25%,
    var(--bg-surface) 50%,
    var(--bg-deep) 75%
  );
  background-size: 800px 100%;
  animation: shimmer 1.4s ease infinite;
  border-radius: 8px;
}
```

**Rules:**

* All interactive elements: `transition: all 0.2s ease`
* Button press: subtle `translateY(1px)` + shadow inversion
* Card hover: `translateY(-2px)` + slight shadow expansion
* Sidebar expand: `cubic-bezier(0.4, 0, 0.2, 1)` easing
* No layout shifts — reserve space for loading states with skeletons

---

## 9. Iconography

All icons from **`lucide-react`**. Standard sizing:


| Context            | Size | Stroke width |
| ------------------ | ---- | ------------ |
| Sidebar nav        | 20px | 1.75         |
| Button icons       | 16px | 2            |
| Card headers       | 22px | 1.5          |
| Inline / body text | 14px | 2            |
| KPI / hero icons   | 32px | 1.5          |

Colors: `currentColor` (inherits from parent) — active state: `var(--green-primary)`.

---

## 10. Spacing & Sizing Scale

```css
:root {
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  --radius-sm:  8px;
  --radius-md:  14px;
  --radius-lg:  20px;
  --radius-xl:  28px;
  --radius-full: 9999px;
}
```

**Page content padding:**`32px` (desktop), `20px` (mobile) **Card gap grid:**`24px` gutters **Sidebar width collapsed:**`64px` | expanded: `220px`

---

## 11. Global CSS Setup (`index.css`)

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
}

body {
  background-color: var(--bg-base);
  color: var(--text-primary);
  font-family: var(--font-body);
  min-height: 100vh;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: var(--bg-deep);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb {
  background: var(--green-muted);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--green-primary);
}

/* Selection color */
::selection {
  background: var(--green-soft);
  color: var(--green-glow);
}
```

---

## 12. Layout Component Skeleton (`Layout.jsx`)

```jsx
import {
  Home, FolderGit2, Upload, GitBranch,
  Compass, BarChart3, Database,
  Settings, HelpCircle
} from 'lucide-react';

const navItems = [
  { icon: Home,       label: 'Home',        path: '/'           },
  { icon: FolderGit2, label: 'Repository',  path: '/repo'       },
  { icon: Upload,     label: 'Ingest',      path: '/ingest'     },
  { icon: GitBranch,  label: 'Get Repo',    path: '/get-repo'   },
  { icon: Compass,    label: 'Orient',      path: '/orient'     },
  { icon: BarChart3,  label: 'Complexity',  path: '/complexity' },
  { icon: Database,   label: 'Data Model',  path: '/data-model' },
];

// Sidebar: fixed left, full height, 64px collapsed → 220px on hover
// Main: margin-left matches sidebar width, padding 32px
// Wrap each page in <div className="page-enter"> for entrance animation
```

---

## 13. File Checklist for Implementation


| File                            | Action                                             |
| ------------------------------- | -------------------------------------------------- |
| `src/index.css`                 | Add CSS variables, global resets, scrollbar, fonts |
| `src/App.css`                   | Clear defaults; minimal layout helpers             |
| `src/components/Layout.jsx`     | Build sidebar with hover expand + nav items        |
| `src/pages/Landing.jsx`         | Hero layout, CTAs, stat pills, animated background |
| `src/pages/Repo.jsx`            | Two-column: file tree + chat interface             |
| `src/components/Ingest.jsx`     | Drag-drop upload card                              |
| `src/components/GetRepo.jsx`    | URL input + fetch card                             |
| `src/components/Orient.jsx`     | Architecture overview + metrics grid               |
| `src/components/Complexity.jsx` | Dashboard: KPIs + chart + table                    |
| `src/components/DataModel.jsx`  | Entity graph + detail panel                        |

---

*DESIGN.md — Codebase Explainer v1.0**Palette: Light Neumorphic Green Futurism | Fonts: Syne + Inter + DM Mono | Icons: lucide-react*
