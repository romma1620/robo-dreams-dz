import { promises as fs } from 'fs';
import path from 'path';

const dbPath = path.resolve('database.json');

async function readDB() {
  const data = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(data);
}

async function writeDB(db) {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}

export async function getAllUsers() {
  const db = await readDB();
  return db.users;
}

export async function createUser(user) {
  const db = await readDB();
  const id = Date.now().toString();
  const newUser = { id, ...user };
  db.users.push(newUser);
  await writeDB(db);
  return newUser;
}

export async function getUserById(id) {
  const db = await readDB();
  return db.users.find(u => u.id === id);
}

export async function updateUser(id, data) {
  const db = await readDB();
  const idx = db.users.findIndex(u => u.id === id);
  if (idx < 0) return null;
  db.users[idx] = { ...db.users[idx], ...data };
  await writeDB(db);
  return db.users[idx];
}

export async function deleteUser(id) {
  const db = await readDB();
  const idx = db.users.findIndex(u => u.id === id);
  if (idx < 0) return false;
  db.users.splice(idx, 1);
  await writeDB(db);
  return true;
}
