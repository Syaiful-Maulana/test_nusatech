const otpGenerator = require('otp-generator');

module.exports = {
  generateOTP: () => {
    const otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, digits: true, lowerCaseAlphabets: false });

    return otp;
  },
};
