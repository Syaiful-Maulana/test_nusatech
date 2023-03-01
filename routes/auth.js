const express = require('express');
const routes = express.Router();
const { register, login, verify } = require('../controllers/auth/authcontroller');
const { otp } = require('../middlewares/auth');

routes.post('/register', register); //register
routes.post('/login', login); // login
routes.post('/verify', otp, verify);

module.exports = routes;
