import { Context, Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello sHono!");
});

app.get("/user/:id", (c) => {
  return c.json({ id: c.req.param("id") });
});

export default {
  port: 3003,
  fetch: app.fetch,
};
