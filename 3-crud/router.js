const url = require('url');
const {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem
} = require('./service');

function router(req, res) {
  const { method, url: reqUrl } = req;
  const { pathname } = url.parse(reqUrl);
  const parts = pathname.split('/').filter(Boolean);

  // /items
  if (parts[0] === 'items' && parts.length === 1) {
    if (method === 'GET') return getItems(req, res);
    if (method === 'POST') return createItem(req, res);
  }

  // /items/:id
  if (parts[0] === 'items' && parts.length === 2) {
    const id = Number(parts[1]);
    if (method === 'GET') return getItem(req, res, id);
    if (method === 'PUT') return updateItem(req, res, id);
    if (method === 'DELETE') return deleteItem(req, res, id);
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Route not found' }));
}

module.exports = router;
