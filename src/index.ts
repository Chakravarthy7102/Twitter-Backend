import "dotenv/config";
import "reflect-metadata";

//library imports
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";

// native imports
import { connectDB } from "./config/connectDB";
import { origins } from "./consts/cors.origins";
import { __prod__ } from "./consts/common";
import routes from "./routes/index";

export const app = express();
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan("combined"));

const RedisStore = connectRedis(session);
const redis = new Redis(process.env.REDIS_URL);

app.set("trust proxy", 1);

app.use(
  cors({
    origin: origins,
    credentials: true,
  })
);

app.use(
  session({
    name: "cid",
    store: new RedisStore({
      client: redis,
      disableTouch: true,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
      httpOnly: true,
      sameSite: "lax", // csrf
      secure: __prod__, // cookie only works in https
      //   domain: __prod__ ? "domain.com" : undefined,
    },
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    resave: false,
  })
);

app.use("/", routes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  connectDB();
  console.log("after");
});
