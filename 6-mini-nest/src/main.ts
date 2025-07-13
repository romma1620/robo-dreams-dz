import 'reflect-metadata';
import { createApp } from './app.js';

async function bootstrap() {
  const app = createApp();

  const port = 3000;
  app.listen(port, () =>
    console.log(`Server running at http://localhost:${port}`)
  );
}

bootstrap();
