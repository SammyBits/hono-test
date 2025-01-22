import { z } from "zod";

export const createPost = z.object({
    title: z.string().min(5),
    content: z.string().min(10),
    authorId: z.string(),
});

export const updatePost = z.object({
    title: z.string().min(5).optional(),
    content: z.string().min(10).optional(),
    authorId: z.string().optional(),
});

export const searchPostById = z.object({
    postId: z.string(),
});

export const searchPostByAuthorId = z.object({
    authorId: z.string(),
});

export const limitOffset = z.object({
    limit: z.string().min(1).max(100).optional(),
    offset: z.string().min(0).optional(),
});
