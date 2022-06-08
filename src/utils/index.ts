import * as dotenv from 'dotenv';
dotenv.config();

const dockerMongo = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@bdmis_mongo/${process.env.DB_NAME}?authSource=admin`;

export const config = {
  MONGO_URI: process.env.DOCKER
    ? dockerMongo
    : process.env.MONGO_URI || 'mongodb://localhost/bdmis',
  SECRET: process.env.SECRET || 'kkfjfskfsks',
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
  CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET,
  REDIS_HOST: process.env.REDIS_HOST || 'redis',
  REDIS_PORT: process.env.REDIS_PORT || 6378,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SENDGRID_API_KEY_ID: process.env.SENDGRID_API_KEY_ID,
  CLIENT_URL:
    process.env.CLIENT_URL || process.env.NODE_ENV === 'production'
      ? 'https://portal.bdmis.org'
      : 'http://localhost:3000',
  REDIS_URL: process.env.REDIS_URL,
  MONGO_INITDB_ROOT_USERNAME:
    process.env.NODE_ENV === 'production'
      ? process.env.MONGO_INITDB_ROOT_USERNAME
      : '',
  MONGO_INITDB_ROOT_PASSWORD:
    process.env.NODE_ENV === 'production'
      ? process.env.MONGO_INITDB_ROOT_PASSWORD
      : '',
  MAIL_SENDER: {
    email: 'info.bdmis@gmail.com',
    name: 'Brighter Dawn Montessori School',
  },
};
