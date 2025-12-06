import { pool } from '@/db/db';

export async function GET() {
  const [rows] = await pool.query('SELECT * FROM users');
  return Response.json(rows);
}
