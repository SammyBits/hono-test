import { Context, Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import usersRoutes from "./routes/users";

const app = new Hono();
app.use(logger());
app.use(prettyJSON());

app.get("/api/v1/", (c) => {
	return c.text("Hello sHono!");
});

app.route("/api/v1/users", usersRoutes);

export default {
	port: 1234,
	fetch: app.fetch,
};
