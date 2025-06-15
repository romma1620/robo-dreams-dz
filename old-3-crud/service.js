const { parseBody, sendJSON } = require('./utils');

let items = [{id: 1, name: 'TEST_1'}];

async function getItems(req, res) {
  sendJSON(res, 200, items);
}

async function getItem(req, res, id) {
  const item = items.find(i => i.id === id);
  if (!item) return sendJSON(res, 404, { error: 'Not found' });
  sendJSON(res, 200, item);
}

async function createItem(req, res) {
  try {
    const { id, name } = await parseBody(req);
    if (!name) return sendJSON(res, 400, { error: 'Missing name' });
    if (!id) return sendJSON(res, 400, { error: 'Missing id' });
    if (items.some(item => item.id === id)) return sendJSON(res, 400, { error: 'Item already exists' });
    const newItem = { id, name };
    items.push(newItem);
    sendJSON(res, 201, newItem);
  } catch {
    sendJSON(res, 400, { error: 'Invalid JSON' });
  }
}

async function updateItem(req, res, id) {
  try {
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return sendJSON(res, 404, { error: 'Not found' });
    const {_id, name } = await parseBody(req);
    if (!name) return sendJSON(res, 400, { error: 'Missing name' });
    if (items.some(item => item.id === _id)) return sendJSON(res, 400, { error: 'Item already exists' });
    items[idx].name = name;
    items[idx].id = _id;
    sendJSON(res, 200, items[idx]);
  } catch {
    sendJSON(res, 400, { error: 'Invalid JSON' });
  }
}

async function deleteItem(req, res, id) {
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return sendJSON(res, 404, { error: 'Not found' });
  const [deleted] = items.splice(idx, 1);
  sendJSON(res, 200, deleted);
}

module.exports = { getItems, getItem, createItem, updateItem, deleteItem };
