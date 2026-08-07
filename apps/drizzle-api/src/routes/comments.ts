import { Router } from 'express';
import { db } from '../db/client.js';
import { comments } from '../db/schema.js';

export const commentsRouter = Router();

commentsRouter.post('/', async (req, res) => {
  const { content, postId, authorId } = req.body as {
    content?: string;
    postId?: number;
    authorId?: number;
  };

  if (!content || !postId || !authorId) {
    return res.status(400).json({ error: 'content, postId and authorId are required' });
  }

  const [comment] = await db.insert(comments).values({
    content,
    postId,
    authorId
  }).returning();

  return res.status(201).json(comment);
});
