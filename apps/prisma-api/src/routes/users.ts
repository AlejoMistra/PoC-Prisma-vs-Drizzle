import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

export const usersRouter = Router();

usersRouter.get('/', async (_req, res) => {
  const users = await prisma.user.findMany({
    include: { posts: true, comments: true }
  });
  res.json(users);
});

usersRouter.post('/', async (req, res) => {
  const { name, email } = req.body as { name?: string; email?: string };

  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' });
  }

  const user = await prisma.user.create({ data: { name, email } });
  return res.status(201).json(user);
});

usersRouter.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'invalid user id' });
  }

  const user = await prisma.user.findUnique({
    where: { id },
    include: { posts: true, comments: true }
  });

  if (!user) {
    return res.status(404).json({ error: 'user not found' });
  }

  return res.json(user);
});

usersRouter.post('/with-post', async (req, res) => {
  const body = req.body as {
    name?: string;
    email?: string;
    post?: { title?: string; content?: string };
  };

  if (!body.name || !body.email || !body.post?.title) {
    return res.status(400).json({ error: 'name, email and post.title are required' });
  }

  const result = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      posts: {
        create: {
          title: body.post.title,
          content: body.post.content
        }
      }
    },
    include: { posts: true }
  });

  return res.status(201).json(result);
});

usersRouter.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'invalid user id' });
  }

  try {
    await prisma.user.delete({
      where: { id }
    });

    return res.status(204).send();
  } catch (error: any) {
    // Prisma "record not found"
    if (error?.code === 'P2025') {
      return res.status(404).json({ error: 'user not found' });
    }

    // Posible FK constraint si no hay cascade
    if (error?.code === 'P2003') {
      return res.status(409).json({
        error: 'cannot delete user with related records'
      });
    }

    return res.status(500).json({ error: 'internal server error' });
  }
});