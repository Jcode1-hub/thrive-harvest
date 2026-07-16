# Data Sources

## In Use / Planned

| Source | What it provides | Status |
|---|---|---|
| [National Bureau of Statistics (NBS) Nigeria](https://nigerianstat.gov.ng/) | Demographic/population data by state and LGA | Not yet pulled |
| [Humanitarian Data Exchange (HDX)](https://data.humdata.org/) | Nigeria-specific food security data (WFP), population datasets | Not yet pulled |
| [OpenStreetMap via Overpass API](https://overpass-turbo.eu/) | Parks, green space, points of interest in Abuja/FCT | Not yet pulled |
| FCTA (Federal Capital Territory Administration) | Official ward boundaries, if published | Needs research — may not be publicly available |

## Known Gap

There is no existing food-desert or food-access dataset for Abuja equivalent to the USDA Food Access Research Atlas. This project will need to either:
1. Approximate food access using proxies (distance to markets/grocery stores via OSM data), or
2. Collect limited manual/survey data from specific neighborhoods as a pilot

This gap is documented here rather than hidden, since it's a genuine constraint on what the MVP can show accurately.

## Data Processing Notes

Raw data goes in `data/raw/` (untouched, as downloaded). Cleaned/joined data used by the app goes in `data/processed/`. Any cleaning scripts live in `backend/src/data-processing/` with comments explaining transformations.
