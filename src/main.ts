import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
   .setTitle('Tea API')
   .setDescription('CRUD for tea')
   .setVersion('1.0')
   .addApiKey(
    { type: 'apiKey', name: 'x-api-key', in: 'header' },
    'x-api-key',
   )
   .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, doc);

  app.enableShutdownHooks();
  await app.listen(3000);
}
bootstrap();

process.on('SIGINT', () => {
  console.log('Bye tea-lovers 👋');
  process.exit();
});
