import { getUserById, updateUser, deleteUser } from '../../../services/users.service.js';
import { getRequestBody } from '../../../utils/index.js';

export async function GET(req, res, { id }) {
  const user = await getUserById(id);
  if (!user) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Not Found' }));
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(user));
}

export async function PUT(req, res, { id }) {
  try {
    const body = await getRequestBody(req);
    const updated = await updateUser(id, body);
    if (!updated) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Not Found' }));
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(updated));
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid request' }));
  }
}

export async function DELETE(req, res, { id }) {
  const success = await deleteUser(id);
  if (!success) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Not Found' }));
  }
  res.writeHead(204);
  res.end();
}
