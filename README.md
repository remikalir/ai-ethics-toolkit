# 🛠️ AI Ethics Learning Toolkit

An interactive, choose-your-own-adventure learning environment for exploring AI ethics. Co-created by [Duke University Libraries](https://library.duke.edu/) and [CARADITE](https://lile.duke.edu/caradite/).

**Live site:** [duke.is/aiethicstoolkit](https://duke.is/aiethicstoolkit)

---

## Features

- **Role-based pathways** — Students and instructors see different activities, prompts, and tools tailored to their needs
- **11 AI ethics topics** — Each with custom illustrations, expert quotes, curated resources, and discipline-specific extensions
- **Progress tracker** — Mark topics as explored; visual progress ring and bar persist across sessions
- **Reflection journal** — Write and tag personal reflections by topic; entries persist in browser storage
- **Syllabus builder** (instructors) — Drag topics into weekly blocks, add notes, reorder; auto-saves
- **Searchable glossary** — Key AI ethics terms with definitions

## Quick start

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/ai-ethics-toolkit.git
cd ai-ethics-toolkit

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project structure

```
ai-ethics-toolkit/
├── index.html              # Entry point
├── vite.config.js          # Build configuration
├── package.json
├── src/
│   ├── main.jsx            # React mount point
│   ├── index.css           # Global styles, fonts, CSS variables
│   ├── App.jsx             # Main application (all components)
│   ├── storage.js          # localStorage persistence layer
│   └── data/
│       └── topics.js       # ← EDIT THIS to update content
└── .github/
    └── workflows/
        └── deploy.yml      # Auto-deploy on push to main
```

## Updating content

All topic content lives in **`src/data/topics.js`**. This is the file your team will edit most often.

Each topic object contains:
- `id` — unique identifier (used internally and in storage)
- `emoji`, `title`, `subtitle` — display info
- `color`, `accent` — theme colors for the topic
- `quote`, `quoteAuthor`, `quoteRole` — featured expert quote
- `description` — overview paragraph
- `studentActivities` / `instructorActivities` — role-specific content
- `resources` — curated readings with type, access level, and URL
- `relatedTopics` — array of other topic `id` values for cross-linking
- `disciplinary` — discipline-specific extension ideas

To add a new topic, copy an existing object, change the `id`, update all fields, and add SVG illustration in `App.jsx`'s `TopicIllustration` component.

## Deploying to GitHub Pages

This project includes a GitHub Actions workflow that builds and deploys automatically when you push to `main`.

### First-time setup

1. Push this repo to GitHub
2. Go to **Settings → Pages** in your GitHub repo
3. Under "Build and deployment", select **GitHub Actions** as the source
4. Push any change to `main` — the site deploys automatically

### Custom domain (optional)

To use a domain like `aiethics.duke.edu`:

1. In your repo's **Settings → Pages**, add your custom domain
2. Create a `CNAME` file in the `public/` folder with your domain
3. Update `base` in `vite.config.js` to `'/'`
4. Configure DNS with your domain registrar (CNAME to `YOUR_USERNAME.github.io`)

### Alternative: Vercel

1. Import the repo at [vercel.com/new](https://vercel.com/new)
2. Vercel auto-detects Vite and deploys — no configuration needed
3. Set `base: '/'` in `vite.config.js`

## Persistent storage

User data (progress, journal entries, syllabus) is stored in **browser localStorage**. This means:

- ✅ Data persists across page refreshes and browser restarts
- ✅ No backend or database required
- ✅ Works offline after first load
- ⚠️ Data is device-specific (won't sync across laptops)
- ⚠️ Clearing browser data erases entries

For a production deployment with cross-device sync, swap `localStorage` calls in `src/storage.js` with a backend service (Firebase, Supabase, etc.). The rest of the app doesn't need to change.

## Technology

- [React 18](https://react.dev/) — UI framework
- [Vite](https://vitejs.dev/) — Build tool
- [DM Sans](https://fonts.google.com/specimen/DM+Sans) + [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) — Typography
- No component libraries — everything is hand-crafted for this project

## License

Content is offered under [CC BY-NC-SA 4.0](http://creativecommons.org/licenses/by-nc-sa/4.0). Code is MIT licensed.

## Contact

- **Hannah Rozear** — [Duke profile](https://directory.library.duke.edu/staff/hannah.rozear)
- **Remi Kalir** — [remi.kalir@duke.edu](mailto:remi.kalir@duke.edu)
- [aiethicstoolkit@duke.edu](mailto:aiethicstoolkit@duke.edu)
