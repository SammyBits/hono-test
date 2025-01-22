import { z } from "zod";

export const userSchema = z.object({
	email: z.string().email(),
	name: z.string().min(2).optional(),
	password: z.string().min(8),
});
