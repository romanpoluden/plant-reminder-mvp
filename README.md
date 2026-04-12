# Plant care reminder (MVP)

Local-only web app to track watering and fertilizing. Data stays in your browser (**LocalStorage**). No backend or sign-in.

## Stack

- React 19 + TypeScript + [Vite](https://vite.dev/)
- [`ics`](https://www.npmjs.com/package/ics) for calendar export

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173/`).

**Plant catalog (optional):** copy `.env.example` to `.env.local`, set `VITE_PERENUAL_API_KEY` from [Perenual](https://perenual.com/user/developer), then restart `npm run dev`. The key is embedded in the client bundle (fine for learning; use a proxy for production).

## Scripts

| Command       | Purpose              |
| ------------- | -------------------- |
| `npm run dev` | Dev server + HMR     |
| `npm run build` | Production build   |
| `npm run preview` | Preview production build |
| `npm run lint`  | ESLint               |

## Features

- Add / edit / delete plants (name, pot size, intervals, last watered / fertilized)
- Task lists: **overdue**, **due today**, **upcoming** (water + fertilize)
- Mark **watered** or **fertilized** (sets date to today)
- **Download calendar file (.ics)** — import into Apple/Google Calendar or Outlook (not push notifications)
- **Perenual catalog** — search and add plants with default intervals (optional API key in `.env.local`)

Constraints for this MVP: no routing library, no UI framework, no backend.
