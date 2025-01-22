import { Context, Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello sHono!");
});



export default {
  port: 1234,
  fetch: app.fetch,
};
