import { injectable } from 'inversify';

export class BrewsService {
  constructor() {
    this.brews = [];
    this.nextId = 1;
  }

  getAll({ method, ratingMin } = {}) {
    return this.brews.filter(brew => {
      if (method && brew.method !== method) return false;
      return !(ratingMin != null && (brew.rating == null || brew.rating < ratingMin));

    });
  }

  getById(id) {
    return this.brews.find(b => b.id === id) || null;
  }

  create({ beans, method, rating, notes, brewedAt }) {
    const newBrew = {
      id: String(this.nextId++),
      beans,
      method,
      rating,
      notes,
      brewedAt: brewedAt || new Date().toISOString(),
    };
    this.brews.push(newBrew);
    return newBrew;
  }

  update(id, data) {
    const brew = this.brews.find(b => b.id === id);
    if (!brew) return null;
    Object.assign(brew, data);
    return brew;
  }

  delete(id) {
    const idx = this.brews.findIndex(b => b.id === id);
    if (idx === -1) return false;
    this.brews.splice(idx, 1);
    return true;
  }
}
