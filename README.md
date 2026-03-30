# Airbnb Clone — Frontend

Angular 18 SPA for the Airbnb Clone project. Supports browsing, searching, and booking properties, as well as a landlord dashboard for managing listings and reservations.

---

## Tech Stack

| | |
|--|--|
| Framework | Angular 18 |
| Language | TypeScript 5.4 |
| UI Library | PrimeNG 17 + PrimeFlex 3 |
| Maps | Leaflet 1.9 + leaflet-geosearch |
| Icons | Font Awesome 6 |
| Date Utility | Day.js |
| Auth | Auth0 / Okta OAuth2 (session-based) |
| Build Tool | Angular CLI 18 |
| Container | Docker (nginx:alpine) |

---

## Features

- OAuth2 login with role-based route guards
- Browse listings by category
- Map-based property search (Leaflet)
- Date range picker for booking availability
- Multi-step listing creation wizard (for landlords)
- Property image upload
- Booking management (create, view, cancel)
- Landlord reservation overview
- CSRF protection with XSRF tokens

---

## Project Structure

```
src/
├── app/
│   ├── home/                    # Home / browse page
│   ├── landlord/
│   │   ├── properties/          # Landlord's property list
│   │   ├── properties-create/   # Multi-step create wizard
│   │   │   └── step/            # category, info, price, location, pictures, description
│   │   └── reservation/         # Incoming reservations
│   ├── tenant/
│   │   ├── display-listing/     # Property detail view
│   │   ├── booked-listing/      # Tenant's bookings
│   │   ├── search/              # Search with filters
│   │   └── booking-date/        # Date picker component
│   ├── layout/
│   │   └── navbar/              # Navbar + category filter
│   ├── shared/
│   │   └── card-listing/        # Reusable listing card
│   └── core/
│       ├── auth/                # AuthService, route guards, interceptors
│       └── model/               # Shared interfaces
├── environments/
│   ├── environment.ts           # Production config
│   └── environment.development.ts
└── styles.scss                  # Global styles
```

---

## Routes

| Path | Component | Access |
|------|-----------|--------|
| `/` | HomeComponent | Public |
| `/listing` | DisplayListingComponent | Public |
| `/booking` | BookedListingComponent | Authenticated |
| `/landlord/properties` | PropertiesComponent | ROLE_LANDLORD |
| `/landlord/reservation` | ReservationComponent | ROLE_LANDLORD |

---

## Running Locally

### Prerequisites
- Node.js 20
- Backend running on `http://localhost:8081`

```bash
npm install
npm start
```

App runs on **http://localhost:4200**

API calls to `/api/*`, `/oauth2/*`, and `/login/*` are proxied to the backend via `proxy.conf.mjs`.

---

## Build

```bash
# Production build
npm run build
# Output: dist/airbnb-clone-front/browser/

# Development build with watch
npm run watch

# Run tests
npm test
```

---

## Environment Configuration

| File | Used when |
|------|-----------|
| `environment.ts` | Production build (`ng build`) |
| `environment.development.ts` | Dev server (`ng serve`) |

```typescript
export const environment = {
  API_URL: '/api'
};
```

---

## Docker

The Dockerfile uses a two-stage build:

1. **Build stage** — Node 20 compiles the Angular app with `npm ci && ng build`
2. **Runtime stage** — nginx:alpine serves the static files with SPA routing support

```bash
docker build -t airbnb-frontend .
docker run -p 80:80 airbnb-frontend
```

nginx is configured with:
- `try_files $uri /index.html` for SPA client-side routing
- Long-term caching headers for static assets (JS, CSS, fonts)

---

## npm Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Dev server on :4200 with API proxy |
| `npm run build` | Production build |
| `npm run watch` | Dev build in watch mode |
| `npm test` | Run unit tests with Karma |
