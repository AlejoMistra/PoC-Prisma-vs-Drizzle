import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

export const postsRouter = Router();

postsRouter.post('/', async (req, res) => {
  const { title, content, authorId } = req.body as {
    title?: string;
    content?: string;
    authorId?: number;
  };

  if (!title || !authorId) {
    return res.status(400).json({ error: 'title and authorId are required' });
  }

  const post = await prisma.post.create({
    data: { title, content, authorId }
  });

  return res.status(201).json(post);
});

postsRouter.get('/with-relations', async (_req, res) => {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      comments: {
        include: {
          author: true
        }
      }
    }
  });

  res.json(posts);
});
