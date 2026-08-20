import { Router } from 'express';
import { db } from '../db/client.js';
import { posts, users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const usersRouter = Router();

usersRouter.get('/', async (_req, res) => {
  const allUsers = await db.query.users.findMany({
    with: {
      posts: true,
      comments: true,
    },
  });

  res.json(allUsers);
});

usersRouter.post('/', async (req, res) => {
  const { name, email } = req.body as { name?: string; email?: string };

  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' });
  }

  const [user] = await db.insert(users).values({ name, email }).returning();
  return res.status(201).json(user);
});

usersRouter.post('/with-post', async (req, res) => {
  const body = req.body as {
    name?: string;
    email?: string;
    post?: { title?: string; content?: string };
  };

  if (!body.name || !body.email || !body.post?.title) {
    return res
      .status(400)
      .json({ error: 'name, email and post.title are required' });
  }

  const created = await db.transaction(async (tx) => {
    const [user] = await tx
      .insert(users)
      .values({
        name: body.name!,
        email: body.email!,
      })
      .returning();

    const [post] = await tx
      .insert(posts)
      .values({
        title: body.post!.title!,
        content: body.post!.content,
        authorId: user.id,
      })
      .returning();

    return { ...user, posts: [post] };
  });

  return res.status(201).json(created);
});

usersRouter.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid user id' });
  }
  try {
    const deletedUser = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ deletedId: users.id });
    if (deletedUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});
