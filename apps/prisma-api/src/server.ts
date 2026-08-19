import express from 'express';
import { usersRouter } from './routes/users.js';
import { postsRouter } from './routes/posts.js';
import { commentsRouter } from './routes/comments.js';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, orm: 'prisma' });
});

app.get('/', (_req, res) => {
  res.json({ message: 'Welcome to the Prisma API!' });
});

app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);

app.listen(process.env.PORT, () => {
  console.log(`Prisma API listening on http://localhost:${process.env.PORT}`);
});
