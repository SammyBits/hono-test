import type { User } from "@prisma/client";
import prisma from "../configs/prisma";
import { hashPasswordAsync } from "../utils/crypto";

const omitParams = {
	password: true,
	isActive: true,
  };

const getUsers = () => prisma.user.findMany({omit: omitParams});

const getUserById = (accountId: string) =>
	prisma.user.findUnique({
		where: {
			accountId,
			isActive: true,
		},
		include: {
			posts: true,
		},
		omit: omitParams,
	});
	
/**
 * Create a new user in the database
 * @param user  The user object to create
 * @returns     The created user
 */
const createUser = async (user: Omit<User, "id" | "accountId">) => {
	const { password, name, ...userData } = user;

	const hashPassword = await hashPasswordAsync(user.password);
	const username = user.name ?? user.email.split("@")[0];
	
	return prisma.user.create({
		data: {
			...userData,
			password: hashPassword,
			name: name ?? username,
		},
		omit: omitParams,
	});
};

const updateUser = async (accountId: string,user: Omit<User, "id">) => {
	const { password, ...userData } = user;
	const existingUser = await getUserById(accountId);

	if (!existingUser) {
		throw new Error("User not found");
	}

	// If the password is not provided, only update the name and email
	if(!password){
		return prisma.user.update({
			where: { accountId },
			data: userData,
			omit: omitParams
		  });
	}

	const isPasswordChanged = existingUser.password !== password;
	
	if (!isPasswordChanged){
		return prisma.user.update({
			where: { accountId },
			data: userData,
			omit: omitParams
		})
	}

	return prisma.user.update({
		where: { accountId },
		data: {
			...userData,
			password: await hashPasswordAsync(password),
		},
		omit: omitParams,
	});
};

const desactiveUser = async (accountId: string) => {
	const user = await getUserById(accountId);

	if (!user) {
		throw new Error("User not found");
	}

	if (user.isActive) {
		return prisma.user.update({
			where: { accountId },
			data: { isActive: false },
			omit: omitParams,
		});
	}

	throw new Error("User is already desactive");
};

export const users = {
	getUsers,
	getUserById,
	createUser,
	updateUser,
	desactiveUser,
  };
