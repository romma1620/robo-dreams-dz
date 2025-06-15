import { create, update, remove, addRecord, findAll } from '../models/index.js'

export function addHabit(name, freq) {
  create({ name, freq });
  console.log('Habit has been created.');
}

export function listHabits() {
  const all = findAll();
  console.table(all.map(h => ({
    id: h.id,
    name: h.name,
    freq: h.freq,
    lastDone: h.records.slice(-1)[0] || '-'
  })));
}

export function markDone(id) {
  addRecord(id);
  console.log('Marked as done.');
}

export function showStats() {
  const habits = findAll();
  const now = new Date();
  const offset = Number(process.env.DATE_OFFSET || 0);
  now.setDate(now.getDate() + offset);
  const today = now.toISOString().split('T')[0];

  const stats = habits.map(h => {
    const recs = h.records;
    const countIn = (days) =>
        recs.filter(d => {
          const diff = (new Date(today) - new Date(d)) / 86400000;
          return diff >= 0 && diff < days;
        }).length;
    const p7 = (countIn(7) / 7 * 100).toFixed(2);
    const p30 = (countIn(30) / 30 * 100).toFixed(2);
    return { id: h.id, name: h.name, '7d %': p7, '30d %': p30 };
  });

  console.table(stats);
}

export function deleteHabit(id) {
  remove(id);
  console.log('Habit has been deleted.');
}

export function updateHabit(id, { name, freq }) {
  update(id, { name, freq });
  console.log('Habit has been updated.');
}
