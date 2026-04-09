# MedPost

A responsive React app for generating Islamic social media posts and stories with Arabic verses, translations, palettes, layouts, and export options.

## Features

- Live preview for post and story formats
- Select Quran, Hadith, or random content
- Custom palette, pattern, layout, and font pairing
- Download generated cards as images
- Favorites and theme persistence
- PWA support with install prompt

## Tech Stack

- React 18
- Vite
- Tailwind CSS 4 (alpha)
- Framer Motion
- lucide-react icons
- html-to-image
- Vite PWA plugin

## Getting Started

### Install dependencies

```bash
npm install
```

### Run in development mode

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

Then open the displayed local URL in your browser.

## Project Structure

- `src/` — application source files
  - `App.jsx` — main application logic and layout
  - `components/PreviewCard.jsx` — post/story preview card component
  - `hooks/useContent.js` — content loading and randomization hook
- `public/` — static assets and manifest
- `package.json` — scripts and dependencies

## Notes

This repository uses Vite as the development server and bundler. The preview script serves the built output locally for final testing.
