const bcrypt = require('bcryptjs');

const generatePasswordHash = async (password, salt) => {
  try {
    const passwordHash = await bcrypt.hash(password, salt); 

    return passwordHash;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { generatePasswordHash };