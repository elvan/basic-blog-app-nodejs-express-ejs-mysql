const express = require('express');

const db = require('../data/database');

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/posts');
});

router.get('/posts', async (req, res) => {
  const [posts] = await db.query(`
    SELECT posts.*, authors.name AS author_name FROM posts
    INNER JOIN authors ON posts.author_id = authors.id`);

  res.render('posts-list', { posts });
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

router.get('/new-post', async (req, res) => {
  const [authors] = await db.query('SELECT * FROM authors');
  res.render('create-post', { authors: authors });
});

module.exports = router;
