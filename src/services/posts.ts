import type { Post } from "@prisma/client";
import prisma from "../configs/prisma";
import { users } from "./users";

const getPostsByAccountId = (accountId: string, limit?: number, offset?: number) => {
	return prisma.post.findMany({
		where: {
			authorId: accountId,
		},
		orderBy: {
			createdAt: "desc",
		},
        take: limit ?? 10,
        skip: offset ?? 0,
        omit: {
            id: true,
            authorId: true,
            updatedAt: true,
        }
	});
};

const getPostById = (postId: string) =>
	prisma.post.findUnique({
		where: {
			postId,
		},
		include: {
			author: true,
		},
	});

const searchPostByAuthorId = (authorId: string) => {
	return prisma.post.findMany({
		where: {
			authorId,
		},
		orderBy: {
			createdAt: "desc",
		},
	});
};

const createPost = async (post: Omit<Post, "id" | "postId">) => {
	const { authorId, ...postData } = post;
	const author = await users.getUserById(authorId);

	if (!author) {
		throw new Error("Author not found");
	}

	return prisma.post.create({
		data: {
			...postData,
			authorId: author.accountId,
		},
	});
};

const updatePost = async (postId: string, post: Omit<Post, "id">) => {
	const { authorId, ...postData } = post;
	const existingPost = await getPostById(postId);

	if (!existingPost) {
		throw new Error("Post not found");
	}

	if (!authorId) {
		return prisma.post.update({
			where: { postId },
			data: postData,
		});
	}

	const isAuthorChanged = existingPost.authorId !== authorId;

	if (!isAuthorChanged) {
		return prisma.post.update({
			where: { postId },
			data: postData,
			include: {
				author: true,
			},
		});
	}

	const author = await users.getUserById(authorId);

	if (!author) {
		throw new Error("Author not found");
	}

	return prisma.post.update({
		where: { postId },
		data: {
			...postData,
			authorId: author.accountId,
		},
		include: {
			author: true,
		},
	});
};

export const posts = {
	getPostsByAccountId,
	createPost,
	updatePost,
	getPostById,
    searchPostByAuthorId
};
