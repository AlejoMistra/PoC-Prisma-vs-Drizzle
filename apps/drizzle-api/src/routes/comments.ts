import { Router } from 'express';
import { db } from '../db/client.js';
import { comments, users, posts } from '../db/schema.js';
import { eq } from 'drizzle-orm';
export const commentsRouter = Router();

commentsRouter.post('/', async (req, res) => {
  const { content, postId, authorId } = req.body as {
    content?: string;
    postId?: number;
    authorId?: number;
  };

  if (!content || !postId || !authorId) {
    return res
      .status(400)
      .json({ error: 'content, postId and authorId are required' });
  }

  const [comment] = await db
    .insert(comments)
    .values({
      content,
      postId,
      authorId,
    })
    .returning();

  return res.status(201).json(comment);
});

commentsRouter.get('/with-relations-rq', async (req, res) => {
  const result = await db.query.comments.findMany({
    with: {
      author: true,
      post: true,
    },
  });
  return res.json(result);
});

commentsRouter.get('/with-relations-join', async (req, res) => {
  const rows = await db
    .select({
      commentId: comments.id,
      commentContent: comments.content,
      commentCreatedAt: comments.createdAt,
      authorId: users.id,
      authorName: users.name,
      authorEmail: users.email,
      postId: posts.id,
      postTitle: posts.title,
    })
    .from(comments)
    .leftJoin(users, eq(comments.authorId, users.id))
    .leftJoin(posts, eq(comments.postId, posts.id));

  const formatted = rows.map((row) => ({
    id: row.commentId,
    content: row.commentContent,
    createdAt: row.commentCreatedAt,
    author: {
      id: row.authorId,
      name: row.authorName,
      email: row.authorEmail,
    },
    post: {
      id: row.postId,
      title: row.postTitle,
    },
  }));
  return res.json(rows);
});
