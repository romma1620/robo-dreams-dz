import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function router(req, res) {
  try {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    const segments = pathname.split('/').filter(Boolean);
    let routeDir = path.join(__dirname, '../routes');
    const params = {};

    for (const segment of segments) {
      const staticPath = path.join(routeDir, segment);
      if (await exists(staticPath)) {
        routeDir = staticPath;
      } else {
        const entries = await fs.readdir(routeDir);
        const dynamicPath = entries.find(e => e.startsWith('[') && e.endsWith(']'));
        if (dynamicPath && await exists(path.join(routeDir, dynamicPath))) {
          const paramName = dynamicPath.slice(1, -1);
          params[paramName] = segment;
          routeDir = path.join(routeDir, dynamicPath);
        } else {
          return notFound(res);
        }
      }
    }

    const routeFile = path.join(routeDir, 'route.js');
    if (!await exists(routeFile)) {
      return notFound(res);
    }
    const fileUrl = pathToFileURL(routeFile).href + `?update=${Date.now()}`;
    const mod = await import(fileUrl);
    const handler = mod[req.method];
    if (!handler) {
      return methodNotAllowed(res);
    }

    await handler(req, res, params);
  } catch (err) {
    console.error(err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
}

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

function notFound(res) {
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
}

function methodNotAllowed(res) {
  res.writeHead(405, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Method Not Allowed' }));
}

export default router;
