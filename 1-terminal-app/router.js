import { add, list, done, update, stats, remove } from './controllers/habit.controller.js';

export function handle(args) {
  const [cmd, ...rest] = args;
  switch (cmd) {
    case 'add':
      return add(rest);
    case 'list':
      return list();
    case 'done':
      return done(rest);
    case 'stats':
      return stats();
    case 'delete':
      return remove(rest);
    case 'update':
      return update(rest);
    default:
      console.log('Wrong command: ', cmd);
  }
}
