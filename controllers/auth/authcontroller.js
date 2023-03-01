const { User, Pin, Verifikasi } = require('../../models');
const helper = require('../../helpers');
const helperPass = require('../../helpers/password');
const validator = require('fastest-validator');
const v = new validator();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');
const { generateOTP } = require('../../helpers/otp');
const { dateOtp, dateNow } = require('../../helpers/time');
const { JWT_SECRET_KEY, SERVER_ROOT_URI, SERVER_LOGIN_ENDPOINT, OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET } = process.env;

const oauth2Client = new google.auth.OAuth2(OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, `${SERVER_ROOT_URI}/${SERVER_LOGIN_ENDPOINT}`);
function wait10sec(waitTime) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, waitTime);
  });
}

module.exports = {
  register: async (req, res) => {
    try {
      const schema = {
        email: 'email|required',
        password: 'string|required',
      };
      const isExist = await User.findOne({ where: { email: req.body.email } });
      if (isExist) return res.respondAlreadyExist('Email already registered!');

      const validate = v.validate(req.body, schema);
      if (validate.length) return res.respondBadRequest(validate);
      const { password } = req.body;

      const isPassOk = helperPass.validatePassword(password);
      if (!isPassOk.success) return res.respondBadRequest(isPassOk.message);

      const encryptedPassword = await bcrypt.hash(password, 10);

      //   create user
      const newUser = await User.create({
        ...req.body,
        password: encryptedPassword,
        status: 'pending',
      });
      const otp = generateOTP();

      //   create verifi
      const verifi = await Verifikasi.create({
        time: dateOtp(),
      });

      //   create pin
      const savePin = await Pin.create({
        id_user: newUser.id,
        id_verifikasi: verifi.id,
        email: newUser.email,
        pin: otp,
        status: 'pending',
      });

      await wait10sec(10000);

      let query = {
        where: {
          id: newUser.id,
        },
      };
      let queryPin = {
        where: {
          id: savePin.id,
        },
      };
      const dataTemp = {
        id: newUser.id,
        email: newUser.email,
      };
      const token = jwt.sign(dataTemp, JWT_SECRET_KEY, {
        expiresIn: '30m',
      });

      const link = `${req.protocol}://${req.get('host')}/api/v1/auth/verify?token=${token}`;

      const html = `
      <p>OTP anda adalah ${otp}.</p>
      <p>link : ${link}</p>
      `;

      helper.sendEmail(newUser.email, 'Reset Your Password', html);

      let updatePin = await Pin.update(
        {
          status: 'registered',
        },
        queryPin
      );

      let updated = await User.update(
        {
          status: 'registered',
        },
        query
      );

      return res.respondCreated(newUser, 'Success Register Data');
    } catch (err) {
      return res.respondServerError(err.message);
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) return res.respondBadRequest('User not found!');

      const isCorrect = await bcrypt.compare(password, user.password);
      if (!isCorrect) return res.respondBadRequest('Wrong password!');

      if (user.status != 'verified') return res.respondBadRequest('account not verified');

      const dataJwt = {
        id: user.id,
      };
      const data = {
        id: user.id,
        nama: user.name,
        email: user.email,
        status: user.status,
      };
      const token = jwt.sign(dataJwt, JWT_SECRET_KEY, { expiresIn: '3h' });
      return res.respondCreated({ ...data, token }, 'login success!');
    } catch (err) {
      return res.respondServerError(err.message);
    }
  },

  verify: async (req, res) => {
    try {
      const user = req.user;

      const { otp } = req.body;

      if (!user) return res.respondBadRequest('data not found');

      //   get pin
      const getPin = await Pin.findOne({ where: { id_user: user.id } });

      //   get user
      const newUser = await User.findOne({ where: { id: user.id } });

      //   get verifi
      const verifi = await Verifikasi.findOne({ where: { id: getPin.id_verifikasi } });
      if (getPin.pin !== otp) return res.respondBadRequest('OTP Tidak Valid', null);

      if (verifi.time <= dateNow()) return res.respondBadRequest('OTP Expired', null);

      let query = {
        where: {
          id: newUser.id,
        },
      };
      let queryPin = {
        where: {
          id: getPin.id,
        },
      };

      // update user
      const statusUser = await User.update(
        {
          status: 'verified',
        },
        query
      );

      // update pin
      const statusPin = await Pin.update(
        {
          status: 'verified',
        },
        queryPin
      );

      return res.respondUpdated('Account berhasil di aktivasi, Login');
    } catch (err) {
      return res.respondServerError(err.message);
    }
  },
};
