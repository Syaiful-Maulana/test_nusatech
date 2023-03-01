const express = require('express');
const routes = express.Router();
const { profile, verify, updateEmail } = require('../controllers/profile/profilecontroller');
const { login, email } = require('../middlewares/auth');

routes.get('/', login, profile);
routes.put('/update-email', login, updateEmail);
routes.post('/verify-email', email, verify);

module.exports = routes;
