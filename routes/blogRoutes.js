const express = require('express');

const db = require('../data/database');

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/posts');
});

router.get('/posts', async (req, res) => {
  const query = `
    SELECT posts.*, authors.name AS author_name FROM posts
    INNER JOIN authors ON posts.author_id = authors.id`;

  const [posts] = await db.query(query);

  res.render('posts-list', { posts });
});

router.get('/new-post', async (req, res) => {
  const [authors] = await db.query('SELECT * FROM authors');
  res.render('create-post', { authors: authors });
});

router.post('/posts', (req, res) => {
  const data = [
    req.body.title,
    req.body.summary,
    req.body.content,
    req.body.author,
  ];

  db.query('INSERT INTO posts (title, summary, body, author_id) VALUES (?)', [
    data,
  ]);

  res.redirect('/posts');
});

router.get('/posts/:id', async (req, res) => {
  const postId = req.params.id;

  const query = `
    SELECT posts.*, authors.name AS author_name, authors.email AS author_email
    FROM posts INNER JOIN authors ON posts.author_id = authors.id
    WHERE posts.id = ?`;

  const [posts] = await db.query(query, postId);

  // @ts-ignore
  if (!posts || posts.length === 0) {
    return res.status(404).render('404');
  }

  const postData = {
    ...posts[0],
    date: posts[0].date.toISOString(),
    humanDate: posts[0].date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  };

  res.render('post-detail', { post: postData });
});

router.get('/posts/:id/edit', async (req, res) => {
  const postId = req.params.id;

  const query = `SELECT posts.* FROM posts WHERE posts.id = ?`;

  const [posts] = await db.query(query, [postId]);

  // @ts-ignore
  if (!posts || posts.length === 0) {
    return res.status(404).render('404');
  }

  res.render('update-post', { post: posts[0] });
});

router.post('/posts/:id', async (req, res) => {
  const postId = req.params.id;

  const data = [req.body.title, req.body.summary, req.body.content, postId];

  const query = `
    UPDATE posts SET title = ?, summary = ?, body = ?
    WHERE posts.id = ?`;

  await db.query(query, data);

  res.redirect(`/posts/${postId}`);
});

module.exports = router;
