import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createPost, limitOffset, searchPostByAuthorId } from "../schemas/posts";
import type { Post } from "@prisma/client";
import { posts } from "../services/posts";
import { z } from "zod";

const postsRoutes = new Hono();

postsRoutes.post("/", zValidator('json', createPost), async (c) => {
   try {
    const post = await c.req.json<Omit<Post, "id" | "postId">>();
    const dbPost = await posts.createPost(post);
    if (!dbPost) {
        return c.json({ message: "Post not created" }, 404);
    }
    return c.json({ message: "Post created" }, 201);
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

postsRoutes.get(
    "/:authorId",
    zValidator("param", searchPostByAuthorId),
    zValidator("query", limitOffset),
    async (c) => {
      const accountId = c.req.param("authorId");
  
      // Parse the limit and offset query parameters
      const limit = Number.parseInt(c.req.query("limit") || "10", 10);
      const offset = Number.parseInt(c.req.query("offset") || "0", 10);
  
      // Validate that `limit` and `offset` are valid numbers
      if (Number.isNaN(limit) || Number.isNaN(offset)) {
        return c.json({ message: "Invalid query parameters" }, 400);
      }
  
      // Obtain posts by authorId
      const dbPosts = await posts.getPostsByAccountId(accountId, limit, offset);
      if (!dbPosts || dbPosts.length === 0) {
        return c.json({ message: "No posts found" }, 404);
      }
  
      return c.json({ message: "Posts found", posts: dbPosts }, 200);
    }
  );
  


postsRoutes.get("/:postId", zValidator("param", searchPostByAuthorId), async (c) => {
    const postId = c.req.param("postId");
    const dbPost = await posts.getPostById(postId);
    if (!dbPost) {
        return c.json({ message: "Post not found" }, 404);
    }
    return c.json({ message: "Post found", post: dbPost }, 200);
});

postsRoutes.put("/:postId", zValidator("param", searchPostByAuthorId), async (c) => {
    const postId = c.req.param("postId");
    const post = await c.req.json<Omit<Post, "id">>();
    const dbPost = await posts.updatePost(postId, post);
    if (!dbPost) {
        return c.json({ message: "Post not updated" }, 404);
    }
    return c.json({ message: "Post updated", post: dbPost }, 200);
}); 


export default postsRoutes;