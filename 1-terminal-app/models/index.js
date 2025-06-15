import { join, dirname } from 'node:path';
import * as fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'database.json');

function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  } catch {
    return [];
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function findAll() {
  return readDB();
}

export function create({name, freq}) {
  const db = readDB();
  const nextId = db.reduce((max, h) => Math.max(max, h.id), 0) + 1;
  db.push({id: nextId, name, freq, records: []});
  writeDB(db);
}

export function addRecord(id) {
  const db = readDB();
  const habit = db.find(h => h.id === id);
  if (!habit) {
    console.log('Habit not found')
    return;
  }
  const offset = Number(process.env.DATE_OFFSET || 0);
  const d = new Date();
  d.setDate(d.getDate() + offset);
  console.log(offset);
  const str = d.toISOString().split('T')[0];
  if (!habit.records.includes(str)) {
    habit.records.push(str);
    writeDB(db);
  }
}

export function remove(id) {
  let db = readDB();
  db = db.filter(h => h.id !== id);
  writeDB(db);
}

export function update(id, {name, freq}) {
  const db = readDB();
  const habit = db.find(h => h.id === id);
  if (!habit) return;
  if (name) habit.name = name;
  if (freq) habit.freq = freq;
  writeDB(db);
}
