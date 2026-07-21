# egometer-frontend

## A customizable habit tracker

egometer is a habit tracker that lets you track your habits via so-called **meters**.
You define meters (e.g. "Meditation", "Mood", "Water intake"), then log daily
**entries** against them and review your history via daily, weekly, and monthly
dashboards.

It consists of a backend (see `egometer-api`) and this frontend, talking to it over a
plain REST + JWT API.

**NOTE**: This is a WIP side project, but feel free to leave any feedback, bug reports,
feature requests etc.

> The screenshots in `screenshots/` are from the previous (Create React App +
> Material UI) version of this app and no longer reflect the current UI — they're kept
> around for historical reference until updated.

## Meter types

Every meter has one of six fixed types, each with its own daily input, calendar-cell,
and chart rendering:

| Type         | Value shape                                     | Description                          |
| ------------ | ------------------------------------------------ | ------------------------------------- |
| `BOOLEAN`    | `boolean`                                         | Simple yes/no for whether you did something |
| `NUMBER`     | `number`                                          | A numeric value, e.g. glasses of water |
| `TEXT`       | `string`                                          | Free-form journal entry               |
| `MOOD`       | `'bad' \| 'down' \| 'okayish' \| 'good' \| 'dabomb'` | How you felt, five-point scale     |
| `QUANTITY`   | `'none' \| 'a_bit' \| 'a_lot'`                    | A rough amount                        |
| `ACTIVITIES` | `string[]` (subset of a fixed 19-tag vocabulary)  | Which activities you did, multi-select |

## Dashboards

- **Daily** (`/daily/:date`) — a fixed-order list of all your meters with their input
  widget for the selected day, e.g. a checkbox for booleans, a mood picker, tag chips
  for activities. Edits save immediately (optimistic).
- **Monthly** (`/monthly/:year/:month`) — a calendar grid per meter, each cell a
  compact rendering of that day's value, plus an aggregate chart for the month.
  Clicking a cell jumps to that day's daily dashboard for editing.
- **Weekly** (`/weekly/:year/:week`) — the same idea as monthly, over a single
  ISO week.
- **Meters** (`/meters`) — create, edit, and delete meters (name, type, color, icon,
  optional daily/weekly goals).

Meters render in a fixed order for now — no drag-and-drop reordering (a `sortOrder`
field exists on the backend for when that lands).

## Tech stack

- [Vite](https://vitejs.dev/) + React 18 + TypeScript
- [React Router](https://reactrouter.com/) for routing
- [TanStack Query](https://tanstack.com/query) for all server state (no Redux)
- [Tailwind CSS](https://tailwindcss.com/) + hand-written shadcn/ui-style primitives
  (`src/components/ui`)
- [react-hook-form](https://react-hook-form.com/) + [zod](https://zod.dev/) for forms
- [date-fns](https://date-fns.org/) for date math
- [recharts](https://recharts.org/) for charts

## Development

### Getting started

- Clone [egometer-api](https://github.com/edgarmueller/egometer-api) and follow its
  instructions to set up the backend.
- Copy `.env.example` to `.env` and point `VITE_API_URL` at your backend
  (defaults to `http://localhost:3000/api/v1`).
- Install dependencies: `npm install`
- Start the dev server: `npm run dev`
- Type-check + production build: `npm run build`
- Lint: `npm run lint`

### Project structure

```
src/
  main.tsx, App.tsx, routes.tsx
  lib/                  # api-client (JWT-aware fetch wrapper), query-client, utils
  features/
    auth/                # api, hooks, auth-context (JWT), login/register pages
    meters/               # api, hooks, meter types/icons, MeterForm/MeterList
    entries/
      api.ts, hooks.ts    # useEntries(range), useUpsertEntry, useDeleteEntry
      widgets/             # one module per meter type: { DayInput, Cell, Chart }
      widget-registry.ts   # MeterType -> Widget
  pages/                 # DailyDashboardPage, MonthlyDashboardPage,
                          # WeeklyDashboardPage, MetersSettingsPage
  components/
    ui/                  # hand-written shadcn-style primitives
    AppLayout.tsx, ProtectedRoute.tsx
```

### API contract

The frontend expects a backend exposing (base URL from `VITE_API_URL`):

- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
- `GET/POST /meters`, `PATCH/DELETE /meters/:id`
- `GET /entries?from=YYYY-MM-DD&to=YYYY-MM-DD`
- `PUT /entries/:meterId/:date` (upsert), `DELETE /entries/:id`

All authenticated requests send `Authorization: Bearer <token>`.
