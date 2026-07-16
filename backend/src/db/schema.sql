-- ThriveHarvest schema
-- Written to be portable to PostgreSQL later (see ARCHITECTURE.md for why SQLite first)

CREATE TABLE IF NOT EXISTS listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    business_name TEXT NOT NULL,
    food_description TEXT NOT NULL,
    quantity TEXT NOT NULL,              -- kept as text intentionally: "20 plates", "5kg rice" etc, not a single unit
    pickup_window_start DATETIME NOT NULL,
    pickup_window_end DATETIME NOT NULL,
    neighborhood TEXT NOT NULL,          -- free text for now; will map to neighborhood_id once boundaries are finalized (see ARCHITECTURE.md open questions)
    latitude REAL,
    longitude REAL,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'claimed', 'completed', 'expired')),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS claims (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id INTEGER NOT NULL REFERENCES listings(id),
    claimant_name TEXT NOT NULL,
    claimant_contact TEXT NOT NULL,
    claimed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_neighborhood ON listings(neighborhood);
