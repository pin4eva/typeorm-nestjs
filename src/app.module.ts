import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { CacheModule, MiddlewareConsumer, Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { ClassModule } from "./class/class.module";
import { CurrentUserMiddleware } from "./middlewares/current-user.middleware";
import { ProfileSubscriber } from "./profile/entities/profile.entity";
import { ProfileModule } from "./profile/profile.module";
import { config } from "./utils";

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      synchronize: true,
      autoLoadEntities: true,
      database: "bdmis",
      password: "peter",
      subscribers: [ProfileSubscriber],
      logging: ["error"],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      sortSchema: true,
      path: `${config.API_PATH}/graphql`,
      cors: false,
      buildSchemaOptions: {
        dateScalarMode: "timestamp",
      },
    }),
    CacheModule.register({ isGlobal: true }),

    ProfileModule,
    ClassModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes("*");
  }
}
