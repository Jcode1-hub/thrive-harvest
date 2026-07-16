/**
 * Core listing logic. Kept separate from routes/HTTP so it can be unit
 * tested without spinning up a server (see backend/tests/listings.test.js).
 */

class ValidationError extends Error {}

function validateNewListing(input) {
  const required = ['business_name', 'food_description', 'quantity', 'pickup_window_start', 'pickup_window_end', 'neighborhood'];
  for (const field of required) {
    if (!input[field] || typeof input[field] !== 'string' || input[field].trim() === '') {
      throw new ValidationError(`Missing or invalid field: ${field}`);
    }
  }

  const start = new Date(input.pickup_window_start);
  const end = new Date(input.pickup_window_end);
  if (isNaN(start) || isNaN(end)) {
    throw new ValidationError('pickup_window_start and pickup_window_end must be valid dates');
  }
  if (end <= start) {
    throw new ValidationError('pickup_window_end must be after pickup_window_start');
  }
}

function createListing(db, input) {
  validateNewListing(input);

  const stmt = db.prepare(`
    INSERT INTO listings (business_name, food_description, quantity, pickup_window_start, pickup_window_end, neighborhood, latitude, longitude)
    VALUES (@business_name, @food_description, @quantity, @pickup_window_start, @pickup_window_end, @neighborhood, @latitude, @longitude)
  `);

  const result = stmt.run({
    business_name: input.business_name,
    food_description: input.food_description,
    quantity: input.quantity,
    pickup_window_start: input.pickup_window_start,
    pickup_window_end: input.pickup_window_end,
    neighborhood: input.neighborhood,
    latitude: input.latitude ?? null,
    longitude: input.longitude ?? null,
  });

  return getListingById(db, result.lastInsertRowid);
}

function getListingById(db, id) {
  return db.prepare('SELECT * FROM listings WHERE id = ?').get(id);
}

function getAvailableListings(db, { neighborhood } = {}) {
  if (neighborhood) {
    return db.prepare("SELECT * FROM listings WHERE status = 'available' AND neighborhood = ? ORDER BY pickup_window_start ASC").all(neighborhood);
  }
  return db.prepare("SELECT * FROM listings WHERE status = 'available' ORDER BY pickup_window_start ASC").all();
}

function claimListing(db, listingId, claimant) {
  const listing = getListingById(db, listingId);
  if (!listing) {
    throw new ValidationError(`Listing ${listingId} does not exist`);
  }
  if (listing.status !== 'available') {
    throw new ValidationError(`Listing ${listingId} is not available (status: ${listing.status})`);
  }
  if (!claimant.claimant_name || !claimant.claimant_contact) {
    throw new ValidationError('claimant_name and claimant_contact are required');
  }

  const transaction = db.transaction(() => {
    db.prepare("UPDATE listings SET status = 'claimed' WHERE id = ?").run(listingId);
    db.prepare('INSERT INTO claims (listing_id, claimant_name, claimant_contact) VALUES (?, ?, ?)')
      .run(listingId, claimant.claimant_name, claimant.claimant_contact);
  });
  transaction();

  return getListingById(db, listingId);
}

module.exports = {
  ValidationError,
  createListing,
  getListingById,
  getAvailableListings,
  claimListing,
};
