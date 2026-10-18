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

egometer can be used in two different ways, either via the daily dashboard, or, alternatively via the monthly dashboard.
While the daily dashboard display all meters via their `day` visualization component and therefore allows easier editing,
the monthly dashboard is meant to give you an overview of the current month, although it also allows entering data via the `cell`
component property of a widget.

Widgets on the daily dashboard can be dragged around. The layout will be saved on the client via local storage.

The monthly dashboard actually consists of two components, one is a calendar-like cell-based view for each meter per day while the other one consists of aggregated data views.

## Meter types

Every meter has one of the types the API defines: `mood`, `quantity`, `boolean`, `number`, `text` or
`activities` (see the API's README). The type decides which values its entries accept and which widget
displays it; `src/common/meterTypes.js` maps each type to its widget and describes its values as a JSON
schema, which is what the widgets render (e.g. the options of an activities meter).

## Widget format

A widget displays the data of a meter. The following is a list of all available properties of a widget:

- `meterType`: the meter type the widget creates when it's picked in the "Add meter" drawer
- `day`: the visualization component for the daily dashboard
- `week` / `month`: the visualization components for the weekly and monthly dashboards; typically used for displaying the data in an aggregated view
- `cell`: the visualization component that is used per cell within the calendar view of a month
- `name`: the name of the widget, see `src/common/meterTypes.js`
- `label`: the label that is used to display the widget within the "Add meter" drawer
- `icon`: a React element that displays an icon for the widget within the "Add meter" drawer
- `category`: the category this widget belongs to, e.g. 'General'. Used while adding a meter to categorize meters

All available widgets for the entire app are configured within `widgets/index.js`.

## Development

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

### Getting started

- Clone [egometer-api](https://github.com/edgarmueller/egometer-api)
  and follow its instructions to set up the backend
- Use Node.js 12 or 14 (see `.nvmrc`), e.g. via `nvm use`
- Install dependencies via `npm install`
- Run `npm start` to start dev mode, then open `http://localhost:3001` and create an account.
  The defaults in `.env.development` point to the API on `http://localhost:3000`;
  put overrides in `.env.local` (see `.env.example`)
- Run `npm test` to execute all tests

### Authentication

Users sign up and log in with email and password against the egometer API.
The returned token is kept in local storage and sent with every API request;
when it expires or the API rejects it, the user is logged out.
