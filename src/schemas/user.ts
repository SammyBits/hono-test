import { z } from "zod";

export const createUser = z.object({
	email: z.string().email(),
	name: z.string().min(2).optional(),
	password: z.string().min(8),
});

export const searchUserByAccountId = z.object({
	accountId: z.string(),
});
