const express = require('express');

const db = require('../data/database');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(302).redirect('/posts');
});

router.get('/posts', (req, res) => {
  res.render('posts-list');
});

router.get('/new-post', async (req, res) => {
  try {
    const [authors] = await db.query('SELECT * FROM authors');
    res.render('create-post', { authors: authors });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
