import * as SQLite from 'expo-sqlite';
import type { MedicalProfile } from '../models/Profile';

const db = SQLite.openDatabaseSync('vitl.db');

export function initDB() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS profile (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      last_updated TEXT NOT NULL
    );
  `);
}

export function saveProfile(profile: MedicalProfile) {
  db.runSync(
    `INSERT INTO profile (id, data, last_updated)
     VALUES (?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       data = excluded.data,
       last_updated = excluded.last_updated`,
    [profile.id, JSON.stringify(profile), new Date().toISOString()]
  );
}

export function loadProfile(): MedicalProfile | null {
  const row = db.getFirstSync<{ data: string }>(
    'SELECT data FROM profile LIMIT 1'
  );
  return row ? JSON.parse(row.data) : null;
}

export function clearProfile() {
  db.execSync('DELETE FROM profile');
}