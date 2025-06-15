import * as service from '../services/habit.service.js';

const parser = (args) => {
  const res = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace(/^--/, '');
    res[key] = args[i+1];
  }
  return res;
};

export function add(args) {
  const { name, freq } = parser(args);
  service.addHabit(name, freq);
}

export function list() {
  service.listHabits();
}

export function done(args) {
  const { id } = parser(args);
  service.markDone(Number(id));
}

export function stats() {
  service.showStats();
}

export function remove(args) {
  const { id } = parser(args);
  service.deleteHabit(Number(id));
}

export function update(args) {
  const { id, name, freq } = parser(args);
  service.updateHabit(Number(id), { name, freq });
}
