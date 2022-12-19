import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { jwtMiddleware } from "@modules/jwt/jwt.middleware";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(jwtMiddleware);

  await app.listen(3000);
}

bootstrap();
