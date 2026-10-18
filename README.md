# egometer-frontend

## A customizable habit tracker

<p>
    <img src="/screenshots/daily-dashboard.png?raw=true" />
    <img src="/screenshots/monthly-matrix.png?raw=true" />
</p>

egometer is a habit tracker that lets you track your habits via so-called meters.

A meter tracks one thing per day, e.g. your mood, a number or activities, and is stored on the backend.
The frontend takes care of visualizing the stored data of the meters.

It consists of a backend (see egometer-backend) and a frontend part.
This repo represents the frontend part.

**NOTE**: This is a WIP side project of mine, but feel free to leave any feedback, bug reports,
feature requests etc.

## Dashboards

egometer shows your meters in three ways:

- **Today** (`/dashboard`): a card per meter to fill in a day, e.g. by picking a mood or toggling activities
- **Week** (`/weekly`): a table of all meters per day, and **Month** (`/matrix`): a calendar per meter. Days are
  shaded in the meter's color by how strong their value is (a better mood, more activities, a larger number), and
  clicking a day edits its entry. A chart of each meter follows below.
- **Insights** (`/insights`): what goes along with your mood (each activity tag and yes/no meter, comparing the
  average mood on days with and without it), your mood by weekday, and streaks, over 30 days, 90 days or a year

Each page can step to the previous or next day, week or month, or pick one from a calendar.
Meters are added, renamed, colored and deleted on the **Meters** page (`/meters`).

## Meter types

Every meter has one of the types the API defines: `mood`, `activities`, `quantity`, `boolean` (yes/no),
`number` or `text` (a journal), see the API's README. `src/common/meterTypes.jsx` describes how each type is
presented (its label, icon and the labels and icons of its values), `src/components/entries` has the input for
each type, used both on the Today page and when editing a day of the week or month, and
`src/components/charts` the chart of each type.

## UI

The UI is built with [MUI](https://mui.com) and its charts and date pickers. All components share the
theme in `src/theme.js`, so colors, typography and shapes are changed there rather than per component.

## Development

The frontend is built with [Vite](https://vite.dev) and tested with [Vitest](https://vitest.dev) and
[Testing Library](https://testing-library.com).

### Getting started

- Clone [egometer-api](https://github.com/edgarmueller/egometer-api)
  and follow its instructions to set up the backend
- Use Node.js 22 (see `.nvmrc`), e.g. via `nvm use`
- Install dependencies via `npm install`
- Run `npm start` to start dev mode, then open `http://localhost:3001` and create an account.
  The defaults in `.env.development` point to the API on `http://localhost:3000`;
  put overrides in `.env.local` (see `.env.example`)
- Run `npm test` to execute all tests (`npm run test:watch` to keep them running,
  `npm run test:cov` for coverage) and `npm run lint` to lint the code

### Building

`npm run build` writes a production build to `build/`, `npm run preview` serves it on port 3001.
Production builds don't read `.env.development`, so set `REACT_APP_BASE_URL` to the URL of the
deployed API, e.g. `REACT_APP_BASE_URL=https://api.example.com npm run build`.

### Authentication

Users sign up and log in with email and password against the egometer API.
The returned token is kept in local storage and sent with every API request;
when it expires or the API rejects it, the user is logged out.
