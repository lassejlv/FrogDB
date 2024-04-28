import { Hono } from "hono";
import { env } from "./util/env";
import { basicAuth } from "hono/basic-auth";
import { logger } from "hono/logger";
import SchemaRouter from "./routes/schema";
import fs from "fs";
import { prettyJSON } from "hono/pretty-json";

const app = new Hono();

app.use(prettyJSON());
app.use(logger());
app.use(
  "/*",
  basicAuth({
    username: env.USERNAME,
    password: env.PASSWORD,
  })
);

app.route("/schema", SchemaRouter);

app.get("/ping", (c) => {
  return c.json({ message: "pong" });
});

// Check data path
if (!fs.existsSync(env.DATA_PATH)) {
  fs.mkdirSync(env.DATA_PATH);
}

export default {
  port: env.PORT,
  fetch: app.fetch,
};
