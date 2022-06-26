import { config } from "@app/common";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { CacheModule, MiddlewareConsumer, Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { join } from "path";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AttendanceModule } from "./attendance/attendance.module";
import { AuthModule } from "./auth/auth.module";
import { ClassModule } from "./class/class.module";
import { typeormDbOptions } from "./datasource";
import { FamilyModule } from "./family/family.module";
import { CurrentUserMiddleware } from "./middlewares/current-user.middleware";
// import { typeormConfig } from "./_ormconfig";
import { ProfileModule } from "./profile/profile.module";
import { StudentModule } from "./student/student.module";
import { SubjectsModule } from "./subject/subject.module";

const { NODE_ENV, DOCKER } = process.env;

console.log({ NODE_ENV, DOCKER });
@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    AuthModule,

    TypeOrmModule.forRoot(typeormDbOptions as TypeOrmModuleOptions),
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
