const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    } catch (err) {
        console.log(err);
    }
};
module.exports = hashPassword;

const comparePassword = async (password, hashedPassword) =>
    bcrypt.compare(password, hashedPassword);
module.exports = comparePassword;
