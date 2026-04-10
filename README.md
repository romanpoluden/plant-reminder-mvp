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
- **Export .ics** with the next water and fertilize date per plant

Constraints for this MVP: no routing library, no UI framework, no external APIs.
