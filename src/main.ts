import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
    // logger: ["debug", "error", "warn", "verbose"],
  });
  const PORT = process.env.PORT || 8000;
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.setGlobalPrefix(process.env.API_PATH || "api/v1");
  app.useGlobalPipes(new ValidationPipe({ enableDebugMessages: true }));
  await app.listen(PORT, () => {
    Logger.log(`Server started on port ${PORT}`);
  });
}
bootstrap();
