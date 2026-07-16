const express = require('express');
const { createDatabase } = require('./db');
const { createListing, getAvailableListings, claimListing, ValidationError } = require('./listings');

const app = express();
app.use(express.json());

const db = createDatabase();

app.get('/api/listings', (req, res) => {
  const { neighborhood } = req.query;
  res.json(getAvailableListings(db, { neighborhood }));
});

app.post('/api/listings', (req, res) => {
  try {
    const listing = createListing(db, req.body);
    res.status(201).json(listing);
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/listings/:id/claim', (req, res) => {
  try {
    const listing = claimListing(db, Number(req.params.id), req.body);
    res.json(listing);
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`ThriveHarvest backend running on port ${PORT}`));
}

module.exports = app;
