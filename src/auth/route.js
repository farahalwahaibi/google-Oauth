'use strict';

const express = require('express');
const authRouter = express.Router();

const User = require('../models/users.js');
const basicAuth = require('./middleware/basic.js');
const bearerAuth = require('./middleware/bearer.js');
const permissions = require('./middleware/acl.js');
const oauth = require('../oauth.js')

authRouter.post('/signup', async (req, res, next) => {
  try {
    let user = new User(req.body);
    const userRecord = await user.save();
    const output = {
      user: userRecord,
      token: userRecord.token
    };
    console.log(output);
    res.status(201).json(output);
  } catch (e) {
    next(e.message)
  }
});

authRouter.post('/signin', basicAuth, (req, res, next) => {
  const user = {
    user: req.user,
    token: req.user.token
  };
  console.log(user);
  res.status(200).json(user);
});

authRouter.get('/oauth/google', oauth, (req, res) => {
  console.log({ token: req.token, user: req.user });
  res.json({ token: req.token, user: req.user })
});

authRouter.get('/users', bearerAuth, permissions('delete'), async (req, res, next) => {
  console.log('farah');
  const users = await User.find({});
  const list = users.map(user => user.username);
  console.log(list);
  res.status(200).json(list);
});

authRouter.get('/secret', bearerAuth, async (req, res, next) => {
  res.status(200).send('Welcome to the secret area')
});

module.exports = authRouter;