import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setSwagger } from './function/swagger.function';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setSwagger(app);
  await app.listen(3000, process.env.APP_HOSTNAME, () =>
    console.log(`App started on ${process.env.APP_HOSTNAME}:3000/docs`),
  );
}

bootstrap();
