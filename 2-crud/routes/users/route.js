import { getAllUsers, createUser } from '../../services/users.service.js';
import { getRequestBody } from '../../utils/index.js';

export async function GET(req, res) {
  const users = await getAllUsers();
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(users));
}

export async function POST(req, res) {
  try {
    const body = await getRequestBody(req);
    const newUser = await createUser(body);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(newUser));
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid request' }));
  }
}
