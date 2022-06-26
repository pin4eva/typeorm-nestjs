import * as dotenv from "dotenv";
dotenv.config();

const DOCKER_POSTGRES_DATABASE = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@bdmis_postgres/${process.env.POSTGRES_DB}`;

export const config = {
  // Database - Postgres
  POSTGRES_URI: process.env.DOCKER
    ? DOCKER_POSTGRES_DATABASE
    : process.env.POSTGRES_URI ||
      "postgres://postgres:peter@localhost:5432/bdmis",
  POSTGRES_USER: process.env.POSTGRES_USER || "postgres",
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || "peter",
  POSTGRES_DB: process.env.POSTGRES_DB || "bdmis",
  POSTGRES_HOST: process.env.DOCKER ? process.env.POSTGRES_HOST : "localhost",
  SECRET: process.env.SECRET || "kkfjfskfsks",
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
  CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET,
  REDIS_HOST: process.env.REDIS_HOST || "redis",
  REDIS_PORT: process.env.REDIS_PORT || 6378,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SENDGRID_API_KEY_ID: process.env.SENDGRID_API_KEY_ID,
  CLIENT_URL:
    process.env.CLIENT_URL || process.env.NODE_ENV === "production"
      ? "https://portal.bdmis.org"
      : "http://localhost:3000",
  REDIS_URL: process.env.REDIS_URL,
  MONGO_INITDB_ROOT_USERNAME:
    process.env.NODE_ENV === "production"
      ? process.env.MONGO_INITDB_ROOT_USERNAME
      : "",
  MONGO_INITDB_ROOT_PASSWORD:
    process.env.NODE_ENV === "production"
      ? process.env.MONGO_INITDB_ROOT_PASSWORD
      : "",
  MAIL_SENDER: {
    email: "info.bdmis@gmail.com",
    name: "Brighter Dawn Montessori School",
  },
  API_PATH: process.env.API_PATH || "api/v1",
};
