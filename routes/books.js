'use strict';
const express = require('express')
const router = express.Router()
const knex = require('../knex')
const humps = require('humps')

// L in CRUDL
router.get('/books', function(req, res, next) {
  knex('books')
    // .select('id', 'title', 'author', 'genre', 'description', 'cover_url', 'created_at', 'updated_at')
    .orderBy('title')
    .then((books) => {
      let camelNew = humps.camelizeKeys(books)
      // res.setHeader('Content-Type', 'application/json')
      res.send(camelNew)
    })
    .catch((err) => next(err))
});

// R in CRUDL
router.get('/books/:id', function(req, res, next) {
  const id = req.params.id

  knex('books')
    .select('id', 'title', 'author', 'genre', 'description', 'cover_url', 'created_at', 'updated_at')
    .orderBy('title')
    .where('id', id)
    .then((books) => {
      let camelNew = humps.camelizeKeys(books)
      if (books.length < 1) {
        return res.sendStatus(404)
      }

      res.setHeader('Content-Type', 'application/json')
      res.send(JSON.stringify(camelNew[0]))
    })
    .catch((err) => next(err))
});

// C in CRUDL
router.post('/books', function(req, res, next) {
  knex('books')
    .insert({
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      description: req.body.description,
      cover_url: req.body.coverUrl
    }, '*')
    .then((insertNewBook) => {
      const newBook = {
        id: insertNewBook[0].id,
        title: insertNewBook[0].title,
        author: insertNewBook[0].author,
        genre: insertNewBook[0].genre,
        description: insertNewBook[0].description,
        coverUrl: insertNewBook[0].cover_url
      }
      res.send(newBook)
    })
    .catch((err) => next(err))
});

// U in CRUDL
router.patch('/books/:id', (req, res, next) => {
  knex('books')
    .where('id', req.params.id)
    .first()
    .then((books) => {
      if (!books) {
        return next();
      }

      return knex('books')
        .update({
          title: req.body.title,
          author: req.body.author,
          genre: req.body.genre,
          description: req.body.description,
          cover_url: req.body.coverUrl
         }, '*')
        .where('id', req.params.id);
    })
    .then((books) => {
      let camelNew = humps.camelizeKeys(books[0])
      res.send(camelNew);
    })
.catch((err) => next(err))
});


// D in CRUDL
router.delete('/books/:id', (req, res, next) => {
  let books;

  knex('books')
    .where('id', req.params.id)
    .first()
    .then((row) => {
      if (!row) {
        return next();
      }

      books = row;

      return knex('books')
        .del()
        .where('id', req.params.id);
    })
    .then(() => {
      let camelNew = humps.camelizeKeys(books)
      delete camelNew.id;
      res.send(camelNew);
    })
    .catch((err) => {
      next(boom.create(400, 'Something went wrong!'));
    });
});

module.exports = router;
