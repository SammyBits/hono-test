import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import usersRoutes from "./routes/users";
import postsRoutes from "./routes/posts";

const app = new Hono({ strict: false });
app.use(logger());
app.use(prettyJSON());

app.get("/api/v1/", (c) => {
	return c.text("Hello sHono!");
});

app.route("/api/v1/users", usersRoutes);
app.route("/api/v1/posts", postsRoutes);


export default {
	port: 1234,
	fetch: app.fetch,
};
