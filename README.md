# CVForge

A front-end only, privacy-first CV builder that helps you tailor resumes for specific job descriptions. All data stays in your browser — no backend, no account required.

## Features

- **Multi-CV management** — Create and manage multiple tailored CVs from a single knowledge base
- **Knowledge base** — Store your profile, skills, experiences, education, and introduction variants once, reuse across CVs
- **Cherry-pick content** — Select which skills, job titles, bullet points, and education entries to include per CV
- **A4 preview** — Real-time paginated A4 preview with proper page breaks, or use long-scroll mode
- **PDF export** — Clean PDF generation via `@react-pdf/renderer` (no browser chrome, no headers/footers)
- **Demo data** — One-click demo seed to explore the app instantly
- **Local storage** — All data persisted in `localStorage` with Zod schema validation
- **Import / Export** — Full data portability via JSON export/import

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Routing | TanStack Router (file-based) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| PDF | @react-pdf/renderer |
| Forms | React Hook Form + Zod |
| Linting | Biome |
| Testing | Vitest + Testing Library |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Click **Load Demo Data** on the home page to populate the app with sample data.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests |
| `npm run lint` | Lint with Biome |
| `npm run format` | Format with Biome |
| `npm run check` | Lint + format check |

## Project Structure

```
src/
  components/
    builder/         # CV builder page (preview, panels, selectors)
    cv-list/         # Home page with CV cards
    ui/              # shadcn/ui primitives
  hooks/             # localStorage hooks, resolved CV, saved CVs
  lib/
    schemas/         # Zod schemas (profile, skills, experience, etc.)
    data-io.ts       # Import/export utilities
    demo-seed.json   # Sample data for demo
  routes/            # TanStack file-based routes
  styles.css         # Tailwind v4 theme
```

## Roadmap

- [ ] Job description match scoring (Jobscan-style analysis)
- [ ] AI-powered CV optimization suggestions
- [ ] Multiple PDF templates (modern, classic, ATS)
- [ ] Multi-profession support

## License

Private project.
