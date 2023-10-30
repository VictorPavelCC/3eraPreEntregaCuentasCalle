const bcrypt = require('bcrypt');

//Hash
const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const isValidatePassword = (user, password) => bcrypt.compareSync(password, user.password);

module.exports = {
    createHash,
    isValidatePassword
}