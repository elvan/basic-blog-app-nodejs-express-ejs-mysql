const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(302).redirect('/posts');
});

router.get('/posts', (req, res) => {
  res.render('posts-list');
});

router.get('/new-post', (req, res) => {
  res.render('create-post');
});

module.exports = router;
