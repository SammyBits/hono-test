import { Hono } from "hono";
import { users } from "../services/users";
import { zValidator } from '@hono/zod-validator'
import { Prisma, type User } from "@prisma/client";
import { userSchema } from "../schemas/user";

const usersRoutes = new Hono();

/**
 * POST /api/v1/users
 * Create a new user
 * @param {User} user - The user object
 * @returns {User} The created user
 * @example
 * 
 */


usersRoutes.get("/", async (c) => {
    const dbUsers = await users.getUsers();
    if (!dbUsers || dbUsers.length === 0) {
        return c.json({ message: "No users found" }, 404);
    }

    return c.json(dbUsers);
});

usersRoutes.get("/:accountId", async (c) => {
    const accountId = c.req.param("accountId");
    const user = await users.getUserById(accountId);

    if (!user) {
        return c.json({ message: "User not found" }, 404);
    }

    return c.json(user);
});

usersRoutes.put("/:accountId", async (c) => {
    const accountId = c.req.param("accountId");
    const user = await c.req.json<Omit<User, "id">>();
    const dbUser = await users.updateUser(accountId, user);
    return c.json(dbUser);
});

usersRoutes.delete("/:accountId", async (c) => {
    const accountId = c.req.param("accountId");
    await users.desactiveUser(accountId);
    return c.json({ message: "User desactived" });
});


export default usersRoutes;