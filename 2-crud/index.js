import http from 'http';
import router from './lib/router.js';

const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  router(req, res);
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
