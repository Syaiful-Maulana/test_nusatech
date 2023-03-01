module.exports = {
  dateOtp: () => {
    var date = new Date();

    var hours = date.getHours() < 10 ? `0${date.getHours() + 1}` : `${date.getHours() + 1}`;
    var minute = date.getMinutes() < 10 ? `0${date.getMinutes() + 1}` : `${date.getMinutes() + 1}`;
    var second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();

    var value = `${hours}` + ':' + `${minute}` + ':' + `${second}`;

    return value;
  },
  dateNow: () => {
    var date = new Date();

    var hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    var minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`;
    var second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();

    var value = `${hours}` + ':' + `${minute}` + ':' + `${second}`;

    return value;
  },
};
