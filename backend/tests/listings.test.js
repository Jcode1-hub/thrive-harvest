const test = require('node:test');
const assert = require('node:assert');
const { createDatabase } = require('../src/db');
const { createListing, getAvailableListings, claimListing, ValidationError } = require('../src/listings');

function freshDb() {
  return createDatabase(':memory:');
}

const validListing = {
  business_name: 'Mama Ngozi Kitchen',
  food_description: 'Jollof rice, 20 plates',
  quantity: '20 plates',
  pickup_window_start: '2026-07-20T17:00:00Z',
  pickup_window_end: '2026-07-20T19:00:00Z',
  neighborhood: 'Wuse',
};

test('createListing inserts a valid listing and returns it', () => {
  const db = freshDb();
  const listing = createListing(db, validListing);
  assert.strictEqual(listing.business_name, 'Mama Ngozi Kitchen');
  assert.strictEqual(listing.status, 'available');
});

test('createListing rejects missing required fields', () => {
  const db = freshDb();
  const bad = { ...validListing, business_name: '' };
  assert.throws(() => createListing(db, bad), ValidationError);
});

test('createListing rejects pickup window where end is before start', () => {
  const db = freshDb();
  const bad = { ...validListing, pickup_window_start: '2026-07-20T19:00:00Z', pickup_window_end: '2026-07-20T17:00:00Z' };
  assert.throws(() => createListing(db, bad), ValidationError);
});

test('getAvailableListings only returns listings with status available', () => {
  const db = freshDb();
  const listing = createListing(db, validListing);
  claimListing(db, listing.id, { claimant_name: 'Grace', claimant_contact: '0801234567' });

  const available = getAvailableListings(db);
  assert.strictEqual(available.length, 0);
});

test('getAvailableListings filters by neighborhood', () => {
  const db = freshDb();
  createListing(db, { ...validListing, neighborhood: 'Wuse' });
  createListing(db, { ...validListing, neighborhood: 'Garki' });

  const wuseListings = getAvailableListings(db, { neighborhood: 'Wuse' });
  assert.strictEqual(wuseListings.length, 1);
  assert.strictEqual(wuseListings[0].neighborhood, 'Wuse');
});

test('claimListing marks a listing as claimed and records the claim', () => {
  const db = freshDb();
  const listing = createListing(db, validListing);
  const claimed = claimListing(db, listing.id, { claimant_name: 'Grace', claimant_contact: '0801234567' });

  assert.strictEqual(claimed.status, 'claimed');
});

test('claimListing rejects claiming an already-claimed listing', () => {
  const db = freshDb();
  const listing = createListing(db, validListing);
  claimListing(db, listing.id, { claimant_name: 'Grace', claimant_contact: '0801234567' });

  assert.throws(
    () => claimListing(db, listing.id, { claimant_name: 'Emeka', claimant_contact: '0809876543' }),
    ValidationError
  );
});

test('claimListing rejects a nonexistent listing id', () => {
  const db = freshDb();
  assert.throws(() => claimListing(db, 9999, { claimant_name: 'Grace', claimant_contact: '0801234567' }), ValidationError);
});
