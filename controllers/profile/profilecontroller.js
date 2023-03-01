const { User, Wallet, sequelize } = require('../../models');
const helper = require('../../helpers');
const validator = require('fastest-validator');
const v = new validator();
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY, SERVER_ROOT_URI, SERVER_LOGIN_ENDPOINT, OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET } = process.env;

module.exports = {
  profile: async (req, res) => {
    try {
      const myProfile = req.user;

      const findMyProfile = await User.findOne({ where: { id: myProfile.id } });

      const balence = await Wallet.findAll({
        attributes: ['id_user', [sequelize.fn('sum', sequelize.col('amount')), 'total']],
        group: ['Wallet.id_user'],
        raw: true,
        order: sequelize.literal('total DESC'),
        where: { id_user: findMyProfile.id },
      });

      return res.respondGet({ findMyProfile, balence }, 'success get my profile');
    } catch (err) {
      return res.respondServerError(err.message);
    }
  },
  updateEmail: async (req, res) => {
    try {
      const userId = req.user;

      const user = await User.findOne({ where: { id: userId.id } });

      const { email } = req.body;

      const schema = {
        email: 'email|required',
      };

      const validate = v.validate(req.body, schema);
      if (validate.length) return res.respondBadRequest(validate);

      const dataTemp = {
        id: user.id,
        email: email,
      };

      const token = jwt.sign(dataTemp, JWT_SECRET_KEY, {
        expiresIn: '30m',
      });

      const link = `${req.protocol}://${req.get('host')}/api/v1/profile/verify-email?token=${token}`;

      const html = `
      <p>Email Anda Telah Di Perbarui.</p>
      <p>link : ${link}</p>
      `;

      helper.sendEmail(email, 'Reset Your Password', html);

      return res.respondUpdated('Silahkan Cek Email Anda Untuk Verifikasi Perubahan');
    } catch (err) {
      return res.respondServerError(err.message);
    }
  },
  verify: async (req, res) => {
    try {
      const user = req.user;

      if (!user) return res.respondBadRequest('data not found');

      //   get user
      const newUser = await User.findOne({ where: { id: user.id } });

      let query = {
        where: {
          id: newUser.id,
        },
      };

      // update user
      const statusUser = await User.update(
        {
          email: user.email,
        },
        query
      );

      return res.respondUpdated('Selamat Email Anda Berhasil Di Ganti');
    } catch (err) {
      return res.respondServerError(err.message);
    }
  },
};
