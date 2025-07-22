import { Pool } from 'pg';

export class Orm<T extends { id: number | string }> {
  constructor(
   private table: string,
   private pool: Pool
  ) {}

  async find(filters?: Partial<T>): Promise<T[]> {
    let text = `SELECT * FROM ${this.table}`;
    const values: any[] = [];

    if (filters && Object.keys(filters).length) {
      const clauses = Object.entries(filters).map(([key, val], i) => {
        values.push(val);
        return `"${key}" = $${i + 1}`;
      });
      text += ' WHERE ' + clauses.join(' AND ');
    }

    const res = await this.pool.query<T>(text, values);
    return res.rows;
  }

  async findOne(id: T['id']): Promise<T | null> {
    const text = `SELECT * FROM ${this.table} WHERE id = $1 LIMIT 1`;
    const res = await this.pool.query<T>(text, [id]);
    return res.rows[0] ?? null;
  }

  async save(entity: Omit<T, 'id'>): Promise<T> {
    const keys = Object.keys(entity);
    const cols = keys.map(k => `"${k}"`).join(', ');
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const values = keys.map(k => (entity as any)[k]);

    const text = `
      INSERT INTO ${this.table} (${cols})
      VALUES (${placeholders})
      RETURNING *
    `;
    const res = await this.pool.query<T>(text, values);
    return res.rows[0];
  }

  async update(id: T['id'], patch: Partial<T>): Promise<T> {
    const keys = Object.keys(patch);
    const setClauses = keys.map((k, i) => `"${k}" = $${i + 1}`);
    const values = keys.map(k => (patch as any)[k]);

    const text = `
      UPDATE ${this.table}
      SET ${setClauses.join(', ')}
      WHERE id = $${keys.length + 1}
      RETURNING *
    `;
    values.push(id);

    const res = await this.pool.query<T>(text, values);
    return res.rows[0];
  }

  async delete(id: T['id']): Promise<void> {
    const text = `DELETE FROM ${this.table} WHERE id = $1`;
    await this.pool.query(text, [id]);
  }
}
