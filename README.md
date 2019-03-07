# egometer-frontend

## A customizable habit tracker

<p>
    <img src="/screenshots/daily-dashboard.png?raw=true" />
    <img src="/screenshots/monthly-matrix.png?raw=true" />
</p>

egometer is a habit tracker that lets you track your habits via so-called meters.

A meter is a data definition based on a JSON schema which is stored on the backend.
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

## Meter format

A meter basically describes what data format is used (via a reference to a schema, see the `schemaId` proeprty) and how it should be displayed (via the `visualization` and `color` properties).
Meters are displayed on the client via what is called a 'widget'. A widget is linked to a meter instance via its `schemaId` and `name` properties. These properties must match the `schemaId` and `visualization` properties of the meter.

## Widget format

A widget is capable of displaying the data of a meter. It's linked to a meter via its `schemaId` and `name` properties.
The following is a list of all available properites of a widget:

- `schemaId`: the ID of the JSON schema this meters maps to
- `day`: the visualization component for the daily dashboard
- `month`: the visualization component for the monthly dashboard; typically used for displaying the data in an aggregated view
- `cell`: the visualization component that is used per cell within the calendar view of a month
- `isApplicable`: determines whether the widget can display a given schema (currently unused)
- `h`: configures the height of the widget on the daily dashboard
- `name`: the name of the widget
- `label`: the label that is used to display the widget within the `AddMeterDialog`
- `icon`: a React element that displays an icon for the widget within the `AddMeterDialog`
- `category`: the category this widget belongs to, e.g. 'health' or 'work'. This is used within the `AddMeterDialog` to categorize meters

All available meters for the entire app are configured within `widgets/index.js`.

## Development

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

### Getting started

- Clone [egometer-backend](https://github.com/edgarmueller/egometer-backend)
  and follow instructions to setup the backend
- Install dependencies via `yarn install`
- Run `yarn run start` to start dev mode
- Run `yarn test` to execute all tests
