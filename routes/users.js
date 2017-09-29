'use strict';
const knex = require('../knex')
const humps = require('humps')
const express = require('express');
const bcrypt = require('bcrypt')
// let insertNewUser = humps.camelizeKeys('insertNewUser')

// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/users', function(req, res, next) {
  bcrypt.hash(req.body.password, 10)
    .then((result) => {
      return knex('users')
        .insert({
            // id: 2,
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            email: req.body.email,
            hashed_password: result
        }, '*')
        .then((insertNewUser) => {
          const newUser = {
            id: insertNewUser[0].id,
            firstName: insertNewUser[0].first_name,
            lastName: insertNewUser[0].last_name,
            email: insertNewUser[0].email,
            // password: insertNewUser[0].password,
          }
          res.send(newUser)
        })
        .catch((err) => next(err))
    })
});

module.exports = router;
