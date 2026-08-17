import './config/env.js';
import express from 'express';
import { env } from './config/env.js';
import { usersRouter } from './routes/users.js';
import { postsRouter } from './routes/posts.js';
import { commentsRouter } from './routes/comments.js';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, orm: 'drizzle' });
});

app.get('/', (_req, res) => {
  res.json({ message: 'Welcome to the Drizzle API!' });
});

app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);

app.listen(env.port, () => {
  console.log(`Drizzle API listening on http://localhost:${env.port}`);
});
