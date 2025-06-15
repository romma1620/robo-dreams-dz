const http = require('http');
const router = require('./router');

const PORT = 3000;
http.createServer(router).listen(PORT, () => {
  console.log(`🚀  Server running at http://localhost:${PORT}/items`);
});
