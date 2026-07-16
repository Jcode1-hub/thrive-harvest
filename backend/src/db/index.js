const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Single shared connection. For an app this size, a connection pool would be
// overkill - SQLite handles this fine (see ARCHITECTURE.md).
function createDatabase(dbPath = path.join(__dirname, '../../thrive-harvest.sqlite')) {
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  db.exec(schema);

  return db;
}

module.exports = { createDatabase };
