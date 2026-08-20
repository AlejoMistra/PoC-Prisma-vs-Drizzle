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
    data: { title, content, authorId },
  });

  return res.status(201).json(post);
});

// poner rutas estáticas antes de "/:id"
postsRouter.get('/with-relations', async (_req, res) => {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      comments: {
        include: {
          author: true,
        },
      },
    },
  });

  return res.json(posts);
});

postsRouter.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'invalid post id' });
  }

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
      comments: {
        include: {
          author: true
        }
      }
    }
  });

  if (!post) {
    return res.status(404).json({ error: 'post not found' });
  }

  return res.json(post);
});

postsRouter.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'invalid post id' });
  }

  try {
    await prisma.post.delete({
      where: { id }
    });

    // Por cascade, comments del post se eliminan solos
    return res.status(204).send();
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return res.status(404).json({ error: 'post not found' });
    }

    return res.status(500).json({ error: 'internal server error' });
  }
});