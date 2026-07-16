# Architecture & Design Decisions

This doc explains *why* things are built the way they are, not just what they do. Keeping this updated as decisions change is more valuable than getting it "right" on day one.

## System Overview

```
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│  Frontend    │─────▶│   Backend    │─────▶│  Database    │
│  (React)     │◀─────│  (Express)   │◀─────│  (SQLite)    │
└─────────────┘      └──────────────┘      └──────────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ External data:    │
                    │ NBS / HDX / OSM   │
                    └──────────────────┘
```

## Key Decisions

### Why SQLite before PostgreSQL?
SQLite requires no separate server to run, which matters early on when the priority is getting a working MVP rather than managing infrastructure. The schema is designed to be portable to PostgreSQL later (documented in `backend/src/db/schema.sql`) once there's a real need for concurrent writes at scale.

### Why Leaflet + OpenStreetMap instead of Google Maps/Mapbox?
Mapbox/Google Maps have free tiers, but OSM is fully free, has no API key friction, and — critically — has usable data for Abuja where commercial map providers often have weaker coverage of green space and local points of interest. The Overpass API lets us query OSM directly for parks, trees, and vacant lots.

### Why no food-access dataset exists for this to start from
Unlike the US (which has USDA's Food Access Research Atlas), Nigeria doesn't have a public, granular food-desert dataset. This project treats that as part of the problem to solve, not just an obstacle — see `data/SOURCES.md` for how this data is being built up (partly from public sources, partly from manual/community input).

## Open Questions / Tradeoffs Still Being Worked Through

- How to verify food listings are legitimate without adding too much friction for small businesses to participate
- Whether neighborhood boundaries should follow official FCT ward boundaries or informal community-recognized areas (the latter may be more accurate but harder to source data for)
- How to handle the cold-start problem — no listings, no users, chicken-and-egg

## Testing Strategy

Core matching/routing logic (matching a food listing to the nearest relevant recipient) is unit tested. UI is manually tested for now; automated frontend tests may come later if time allows.
