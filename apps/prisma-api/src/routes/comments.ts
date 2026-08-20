import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

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

  const comment = await prisma.comment.create({
    data: { content, postId, authorId },
  });

  return res.status(201).json(comment);
});

commentsRouter.get('/', async (_req, res) => {
  const comments = await prisma.comment.findMany({
    include: {
      author: true,
      post: true,
    },
  });

  return res.json(comments);
});
//obtener comentarios con sus relaciones
commentsRouter.get('/with-relations', async (req, res) => {
  const comments = await prisma.comment.findMany({
    include: {
      author: true,
      post: true,
    },
  });
  res.json(comments);
});
