const bcrypt = require('bcryptjs');

const generatePasswordHash = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 8); 

    return passwordHash;
  } catch (error) {
    throw new Error(error);
  }
};

const comparePassword = async (password, passwordHash) => {
  try {
    const isPasswordValid = await bcrypt.compare(password, passwordHash);

    return isPasswordValid;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { generatePasswordHash, comparePassword };