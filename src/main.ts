import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import * as express from "express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const PORT = process.env.PORT || 8000;
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.use(express.json({ limit: "50mb" }));
  app.setGlobalPrefix(process.env.API_PATH || "api/v1");
  app.useGlobalPipes(new ValidationPipe({ enableDebugMessages: true }));
  await app.listen(PORT, () => {
    Logger.log(`Server started on port ${PORT}`);
  });
}
bootstrap();
