import session from "express-session";
import { RedisStore } from "connect-redis";
import  redis  from "./redis.js";



const store = new RedisStore({
  client: redis
});


const sessionConfig = session({
  store,
  secret: process.env.redis_sec,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
});

export default sessionConfig;