import path from "path";
import type { LeadPayload } from "@/types/travel";

// Lazy-load better-sqlite3 so the module is only imported server-side.
// The DB file lives at <project-root>/data/leads.db and is created
// automatically on first run.

function getDb() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Database = require("better-sqlite3");
  const dbPath = path.join(process.cwd(), "data", "leads.db");
  const db = new Database(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      tour_id     TEXT    NOT NULL,
      name        TEXT    NOT NULL,
      phone       TEXT    NOT NULL,
      email       TEXT    NOT NULL,
      locale      TEXT    NOT NULL,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );
  `);

  return db;
}

export function saveLead(payload: LeadPayload): { id: number } {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO leads (tour_id, name, phone, email, locale)
    VALUES (@tourId, @name, @phone, @email, @locale)
  `);
  const result = stmt.run(payload) as { lastInsertRowid: number };
  return { id: result.lastInsertRowid };
}

export interface LeadRow {
  id: number;
  tour_id: string;
  name: string;
  phone: string;
  email: string;
  locale: string;
  created_at: string;
}

export function getLeads(limit = 100): LeadRow[] {
  const db = getDb();
  return db
    .prepare("SELECT * FROM leads ORDER BY created_at DESC LIMIT ?")
    .all(limit) as LeadRow[];
}

export function getLeadsCount(): number {
  const db = getDb();
  const row = db.prepare("SELECT COUNT(*) AS cnt FROM leads").get() as { cnt: number };
  return row.cnt;
}
