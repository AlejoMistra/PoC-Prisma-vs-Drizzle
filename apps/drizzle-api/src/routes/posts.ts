import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db/client.js';
import { comments, posts, users } from '../db/schema.js';

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

  const [post] = await db.insert(posts).values({
    title,
    content,
    authorId
  }).returning();

  return res.status(201).json(post);
});

postsRouter.get('/with-relations-rq', async (_req, res) => {
  const result = await db.query.posts.findMany({
    with: {
      author: true,
      comments: {
        with: {
          author: true
        }
      }
    }
  });

  return res.json(result);
});

postsRouter.get('/with-relations-join', async (_req, res) => {
  const rows = await db.select({
    postId: posts.id,
    postTitle: posts.title,
    postContent: posts.content,
    postCreatedAt: posts.createdAt,
    authorId: users.id,
    authorName: users.name,
    authorEmail: users.email,
    commentId: comments.id,
    commentContent: comments.content,
    commentCreatedAt: comments.createdAt,
    commentAuthorId: comments.authorId
  })
  .from(posts)
  .leftJoin(users, eq(posts.authorId, users.id))
  .leftJoin(comments, eq(comments.postId, posts.id));

  const grouped = new Map<number, {
    id: number;
    title: string;
    content: string | null;
    createdAt: Date;
    author: {
      id: number | null;
      name: string | null;
      email: string | null;
    };
    comments: Array<{
      id: number;
      content: string;
      createdAt: Date;
      authorId: number;
    }>;
  }>();

  for (const row of rows) {
    const existing = grouped.get(row.postId);
    if (!existing) {
      grouped.set(row.postId, {
        id: row.postId,
        title: row.postTitle,
        content: row.postContent,
        createdAt: row.postCreatedAt,
        author: {
          id: row.authorId,
          name: row.authorName,
          email: row.authorEmail
        },
        comments: row.commentId ? [{
          id: row.commentId,
          content: row.commentContent!,
          createdAt: row.commentCreatedAt!,
          authorId: row.commentAuthorId!
        }] : []
      });
      continue;
    }

    if (row.commentId) {
      existing.comments.push({
        id: row.commentId,
        content: row.commentContent!,
        createdAt: row.commentCreatedAt!,
        authorId: row.commentAuthorId!
      });
    }
  }

  return res.json(Array.from(grouped.values()));
});

postsRouter.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'invalid post id' });
  }

  const post = await db.query.posts.findFirst({
    where: (posts, { eq }) => eq(posts.id, id),
    with: {
      author: true,
      comments: {
        with: {
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

  const deleted = await db
    .delete(posts)
    .where(eq(posts.id, id))
    .returning({ id: posts.id });

  if (deleted.length === 0) {
    return res.status(404).json({ error: 'post not found' });
  }

  // comments se borran solas por ON DELETE CASCADE
  return res.status(204).send();
});