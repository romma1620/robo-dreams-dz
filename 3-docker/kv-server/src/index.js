import express from 'express';

const app = express();
app.use(express.json());

const REDIS_URL = process.env.REDIS_URL;
if (!REDIS_URL) {
  console.error('ERROR: process.env.REDIS_URL is not defined');
  process.exit(1);
}

app.get('/kv/:key', async (req, res) => {
  try {
    const key = encodeURIComponent(req.params.key);
    const resp = await fetch(`${REDIS_URL}/get?key=${key}`);
    const json = await resp.json();
    return res.json(json);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'upstream error' });
  }
});

app.post('/kv', async (req, res) => {
  const { key, value } = req.body;
  if (typeof key !== 'string') {
    return res.status(400).json({ error: '`key` must be a string' });
  }
  try {
    const resp = await fetch(`${REDIS_URL}/set`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    });
    const json = await resp.json();
    return res.json(json);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'upstream error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`kv-server listening on ${PORT}, REDIS_URL=${REDIS_URL}`);
});
