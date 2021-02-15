const bcrypt = require('bcryptjs');

const generatePasswordHash = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 8); 

    return passwordHash;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { generatePasswordHash };