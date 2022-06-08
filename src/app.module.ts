import { CacheModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileModule } from './profile/profile.module';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';
import { ProfileSubscriber } from './profile/entities/profile.entity';
import { ClassModule } from './class/class.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      synchronize: true,
      autoLoadEntities: true,
      database: 'bdmis',
      password: 'peter',
      subscribers: [ProfileSubscriber],
      // logging: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    CacheModule.register({ isGlobal: true }),
    ProfileModule,
    ClassModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
