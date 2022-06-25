import { config } from "@app/common";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { CacheModule, MiddlewareConsumer, Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AttendanceModule } from "./attendance/attendance.module";
import { AuthModule } from "./auth/auth.module";
import { ClassModule } from "./class/class.module";
import { FamilyModule } from "./family/family.module";
import { CurrentUserMiddleware } from "./middlewares/current-user.middleware";
import { ProfileSubscriber } from "./profile/entities/profile.entity";
import { ProfileModule } from "./profile/profile.module";
import { StudentModule } from "./student/student.module";
import { SubjectsModule } from "./subject/subject.module";

const { POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_USER, POSTGRES_HOST } = config;

console.log({ POSTGRES_PASSWORD, POSTGRES_USER, POSTGRES_DB, POSTGRES_HOST });
@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    AuthModule,

    TypeOrmModule.forRoot({
      type: "postgres",
      synchronize: true,
      autoLoadEntities: true,
      database: config.POSTGRES_DB,
      password: config.POSTGRES_PASSWORD,
      subscribers: [ProfileSubscriber],
      logging: ["error", "query"],
      username: config.POSTGRES_USER,
      host: POSTGRES_HOST,
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
    StudentModule,
    FamilyModule,
    AttendanceModule,
    SubjectsModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes("*");
  }
}
