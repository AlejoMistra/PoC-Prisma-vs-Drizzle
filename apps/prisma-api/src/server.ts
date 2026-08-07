import './config/env.js';
import express from 'express';
import { env } from './config/env.js';
import { usersRouter } from './routes/users.js';
import { postsRouter } from './routes/posts.js';
import { commentsRouter } from './routes/comments.js';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, orm: 'prisma' });
});

app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);

app.listen(env.port, () => {
  console.log(`Prisma API listening on http://localhost:${env.port}`);
});
