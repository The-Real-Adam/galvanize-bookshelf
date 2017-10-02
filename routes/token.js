'use strict'

const bcrypt = require('bcrypt');
const boom = require('boom');
const express = require('express');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const {camelizeKeys} = require('humps');

const JWT_KEY = process.env.JWT_KEY
const router = express.Router()
require('dotenv').config

router.get('/token', (req, res, next) => {
  jwt.verify(req.cookies.token, JWT_KEY, (err, payload) => {
    if (err) {
      res.send(false)
    } else {
      res.send(true)
  }
  })
})

router.post('/token', (req, res, next) => {
  const {email,password} = req.body

  if (!email || !email.trim()) {
    return next(boom.create(400, 'Email must not be blank'))
  }

  if (!password || !password.trim()) {
    return next(boom.create(400, 'Password must not be blank'))
  }

  knex('users')
    .where('email', req.body.email)
    .first()
    .returning('*')
    .then((user) => {
      if (!user) {
        throw boom.create(400, 'Bad email or password')
      } else {
        return bcrypt.compare(req.body.password, user.hashed_password, (err, match) => {
          if (match) {
            const token = jwt.sign({userId: user.id}, JWT_KEY)

            let newObj = {
              id:user.id,
              email:user.email,
              firstName: user.first_name,
              lastName:user.last_name
            }

            res.cookie('token',token, {httpOnly:true})
            res.status(200)
            res.setHeader('Content-Type', 'application/json')
            res.send(newObj)
          } else {
            res.setHeader('Content-Type', 'text/plain')
            res.status(400)
            res.send('Bad email or password')
          }
        })
        }
      // }
    })
    .catch((err) => next(err))
})
//
router.delete('/token', (req, res, next) => {
  res.clearCookie('token')
  res.sendStatus(200)
})



module.exports = router
