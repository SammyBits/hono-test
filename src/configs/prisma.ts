import { PrismaClient } from "@prisma/client";

export default new PrismaClient({
	log: ["query"],
	errorFormat: "pretty",
	omit: {
		user: {
			id: true,
            createdAt: true,
            updatedAt: true,
		},
	},
});
