import { DataSource } from "typeorm";

const DB_CONFIG = {
  POSTGRES_USER: process.env.POSTGRES_USER || "postgres",
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || "peter",
  POSTGRES_DB: process.env.POSTGRES_DB || "bdmis",
  POSTGRES_HOST: process.env.DOCKER ? process.env.POSTGRES_HOST : "localhost",
};

export const typeormDbOptions = {
  type: "postgres",
  username: DB_CONFIG.POSTGRES_USER,
  host: DB_CONFIG.POSTGRES_HOST,
  password: DB_CONFIG.POSTGRES_PASSWORD,
  database: DB_CONFIG.POSTGRES_DB,
  synchronize: false,
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

export const datasource = new DataSource(typeormDbOptions);
