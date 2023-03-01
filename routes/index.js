const express = require('express');
const routes = express.Router();

const auth = require('./auth');
const profile = require('./profile');

// welcome
routes.get('/', (req, res) => {
  res.respondGet(null, 'welcome to  New App!');
});
routes.get('/dokumentasi', (req, res) => {
  res.redirect('https://documenter.getpostman.com/view/13146980/2s93CSoB8N');
});
routes.use('/auth', auth);
routes.use('/profile', profile);

module.exports = routes;
