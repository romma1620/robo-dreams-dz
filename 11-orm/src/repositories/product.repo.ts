import { Pool } from 'pg';
import { Orm } from '../orm/orm.ts';
import 'dotenv/config';

export interface Product {
  id: number;
  name: string;
  price: number;
  created_at: Date;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const productRepo = new Orm<Product>('products', pool);
