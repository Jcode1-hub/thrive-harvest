# ThriveHarvest Backend

## Setup

```bash
cd backend
npm install
npm run dev
```

Server runs on `http://localhost:3000` by default.

## Running Tests

```bash
npm test
```

Uses Node's built-in test runner (`node:test`) — no extra test framework dependency needed for a project this size.

## API Endpoints (MVP)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/listings` | List all available food listings. Optional `?neighborhood=` filter. |
| POST | `/api/listings` | Create a new food listing. |
| POST | `/api/listings/:id/claim` | Claim a listing (marks it unavailable). |

## Project Structure

```
backend/
├── src/
│   ├── server.js       # Express app + routes
│   ├── listings.js     # Core business logic (validation, creation, claiming)
│   └── db/
│       ├── index.js    # DB connection setup
│       └── schema.sql  # Database schema
├── tests/
│   └── listings.test.js
└── package.json
```

Business logic in `listings.js` is deliberately separated from `server.js` (the HTTP layer) so it can be tested directly without spinning up a server — see `tests/listings.test.js`.
