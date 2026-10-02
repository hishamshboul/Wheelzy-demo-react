# WheelzyDemo React

React frontend for a car selling case management system, built as a full-stack learning project.

[Live demo](https://tabiai-002-site10.etempurl.com/)

## Features

- Create vehicle cases with year, make, model, submodel, and ZIP code.
- Filter cases by creation date, current status, and active state.
- Compare buyer quotes and select the current quote.
- Update case status and review dated status history.
- Responsive project homepage with a short overview of the concepts practiced.
- Loading, validation, error feedback, and protection against stale case-list responses.

## Technology

React 19, JavaScript, Vite, React Router, Axios, Bootstrap 5, and Oxlint.
The separate backend uses ASP.NET Core 8, Entity Framework Core, and SQL Server.

## Run locally

1. Install Node.js 20.19+ or 22.12+ (the installed Vite version's requirement).
2. Clone this repository and open its directory:

   ```sh
   git clone https://github.com/hishamshboul/Wheelzy-demo-react.git
   cd Wheelzy-demo-react
   npm ci
   ```

3. Copy `.env.example` to `.env.local` and set the URL of your backend, including `/api`:

   ```dotenv
   VITE_API_BASE_URL=https://localhost:44309/api
   ```

4. Start the ASP.NET Core API. Its development CORS configuration must allow the frontend origin, normally `http://localhost:5173`. Complete your normal local HTTPS certificate setup if needed.
5. Run `npm run dev` and open the local URL printed by Vite. Restart Vite after changing environment settings.

The backend must supply vehicle/ZIP/status lookup data for the forms. The frontend does not contain or seed a database. Values prefixed with `VITE_` are visible in the browser; do not put passwords or private keys in them.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run lint` | Check source code with Oxlint |
| `npm run build` | Build production files into `dist` |
| `npm run preview` | Preview the production build locally |

## Production

The committed `.env.production` uses `VITE_API_BASE_URL=/api` for hosting the frontend and API on the same origin. Build with `npm run build`, then deploy the contents of `dist` into the ASP.NET Core application's `wwwroot`.

The host must serve static files and fall back to `index.html` for React routes such as `/car-cases/2`, while preserving API routes. `npm run preview` serves only the frontend: provide an API at `/api` or build with an appropriate API URL to test data loading there.

## Project structure

```text
public/             Static assets
src/api/            Axios client and API modules
src/components/     Shared UI, forms, tables, and cards
src/pages/          Home, case list, create, details, and 404 pages
src/utils/          Date formatting and filter parameter conversion
src/App.jsx         Routes
src/main.jsx        React entry point
```

## Concepts practiced

Reusable components, props, hooks, controlled forms, dependent selects, routing, asynchronous API requests, stale-response guards, UTC date conversion, and query parameters.

This repository contains the frontend source only. Backend source, database credentials, hosting publish profiles, local environment files, dependencies, and generated build output are excluded.
