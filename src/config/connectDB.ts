import { DataSource } from "typeorm";
import path from "path";
import { User } from "../entities/User";
import { Post } from "../entities/Post";
import { Like } from "../entities/Like";
import { Retweet } from "../entities/Retweet";
import { Profile } from "entities/Profile";

export const source = new DataSource({
  type: "postgres",
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  logging: true,
  synchronize: true,
  migrations: [path.join(__dirname, "./migrations/*")],
  migrationsTableName: "twitter_migrations_tabel",
  // entities: [User, Post, Like, Retweet, Profile],
  entities: ["src/entities/*.ts"],
});

export const connectDB = () => {
  source
    .initialize()
    .then(async () => {
      console.log("Database connected!");
      // await source.getRepository(Post).delete({});
      // await source.getRepository(User).delete({});
      source.runMigrations();
    })
    .catch((err) => {
      console.log("Something went wrong in connecting to DB!");
      console.error(err);
    });
};
