import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { MailModule } from "./mail.module";

const logger = new Logger("Mail");

async function bootstrap() {
  const PORT = process.env.PORT || 8001;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MailModule,
    {
      transport: Transport.TCP,
      options: {
        port: +PORT,
      },
    },
  );
  await app
    .listen()
    .then(() => logger.log(`MAIL_CLIENT started on port ${PORT}`));
}
bootstrap();
