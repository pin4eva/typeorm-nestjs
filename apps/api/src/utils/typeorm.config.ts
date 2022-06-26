import { config } from "@app/common";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  getPort() {
    return this.getValue("PORT", true);
  }

  isProduction() {
    const mode = this.getValue("MODE", false);
    return mode != API_ModeEnum.DEV;
  }

  getTypeOrmConfig(): TypeOrmModuleOptions & {
    cli: { migrationsDir: string };
  } {
    return {
      type: "postgres",
      username: config.POSTGRES_USER,
      host: config.POSTGRES_HOST,
      password: config.POSTGRES_PASSWORD,
      database: config.POSTGRES_DB,
      entities: ["**/*.entity{.ts,.ts}"],
      logging: ["error", "query"],
      migrationsTableName: "migration",
      migrations: ["src/migration/*.ts"],
      cli: {
        migrationsDir: "src/migration",
      },
    };
  }
}

const typeOrmConfig_PROD = {
  type: "postgres",
  username: config.POSTGRES_USER,
  host: config.POSTGRES_HOST,
  password: config.POSTGRES_PASSWORD,
  database: config.POSTGRES_DB,
  autoLoadEntities: true,
  entities: ["**/*.entity.js"],
  logging: ["error", "query"],
  migrationsTableName: "migration",
  migrations: [__dirname + "/migrations/**/*{.ts,.js}"],
  migrationsRun: true,
  cli: {
    migrationsDir: "src/migrations",
  },
};

const configService = new ConfigService(process.env).ensureValues([
  "POSTGRES_HOST",
  "POSTGRES_USER",
  "POSTGRES_PASSWORD",
  "POSTGRES_DB",
]);
enum API_ModeEnum {
  PROD = "production",
  DEV = "developement",
  STAGE = "stage",
}

export { configService, API_ModeEnum, typeOrmConfig_PROD };

// {
//       type: "postgres",
//       // synchronize: process.env.NODE_ENV !== "production",
//       // autoLoadEntities: true,
//       database: POSTGRES_DB,
//       password: POSTGRES_PASSWORD,
//       logging: ["error", "query"],
//       username: POSTGRES_USER,
//       host: POSTGRES_HOST,
//       migrations: ["src/migrations/*{.ts,.js}"],
//       cli: {
//         migrationsDir: "src/migration",
//       },
//     }
