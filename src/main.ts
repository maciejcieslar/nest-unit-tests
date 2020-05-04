import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

async function startServer(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const { PORT: port, HOST: host } = process.env;

  await app.listen(port, host, () => {
    console.log(`Listening on ${port}.`);
  });
}

startServer();
