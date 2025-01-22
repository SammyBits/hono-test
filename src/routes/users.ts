import { Hono } from "hono";
import { users } from "../services/users";
import { zValidator } from '@hono/zod-validator'
import { Prisma, type User } from "@prisma/client";
import { createUser, searchUserByAccountId } from "../schemas/user";

const usersRoutes = new Hono();

/**
 * POST /api/v1/users
 * Create a new user
 * @param {User} user - The user object
 * @returns {User} The created user
 * @example
 * 
 */
usersRoutes.post("/",zValidator("json", createUser), async (c) => { 
  try { 
    const user = await c.req.json<Omit<User, "id" | "accountId">>();
    const dbUser = await users.createUser(user);
    return c.json({ message: "User created"}, 201);
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (error: any) {
        // If unique constraint error, return 400 Bad Request
        if (error.code === "P2002") {
            const field = error.meta?.target;
            return c.json({ message: `Field ${field} already exists` }, 400);
        }
        return c.json({ message: error.message, code: error.code }, 500);
    }   
});

usersRoutes.get("/", async (c) => {
    const dbUsers = await users.getUsers();
    if (!dbUsers || dbUsers.length === 0) {
        return c.json({ message: "No users found" }, 404);
    }

    return c.json(dbUsers);
});

usersRoutes.get("/:accountId", zValidator("param",searchUserByAccountId), async (c) => {
    const accountId = c.req.param("accountId");
    const user = await users.getUserById(accountId);

    if (!user) {
        return c.json({ message: "User not found" }, 404);
    }

    return c.json(user);
});

usersRoutes.put("/:accountId", zValidator("param",searchUserByAccountId), async (c) => {
    const accountId = c.req.param("accountId");
    const user = await c.req.json<Omit<User, "id">>();
    const dbUser = await users.updateUser(accountId, user);
    return c.json(dbUser);
});

usersRoutes.delete("/:accountId", zValidator("param",searchUserByAccountId),async (c) => {
    const accountId = c.req.param("accountId");
    await users.desactiveUser(accountId);
    return c.json({ message: "User desactived" });
});


export default usersRoutes;