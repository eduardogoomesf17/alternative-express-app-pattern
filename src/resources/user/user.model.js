const { v4: uuid }  = require('uuid');

const users = [];

const validateModelProperties = (modelProperties, propsObject) => {
  let errors = [];

  let customProps = Object.keys(propsObject);

  let existentProperties = modelProperties.map(property => property.name);

  customProps.map(property => {
    const propExists = existentProperties.find(existentProp => existentProp === property);

    if(!propExists) {
      errors.push(property);
    }
  });

  if(errors.length > 0) {
    throw new Error({
      error: 'invalid properties',
      notFoundProperties: errors
    });
  }
}

class User {
  
  properties = [
    { name: 'id', type: 'uuid' },
    { name: 'name', type: 'string' },
    { name: 'email', type: 'string' },
    { name: 'password', type: 'string' },
    { name: 'age', type: 'number' },
    { name: 'createdAt', type: 'date' }
  ];

  constructor() {}

  create (userBody) {
    try {
      const user = { 
        id: uuid(),       
        ...userBody,
        createdAt: Date.now()
      };
      
      validateModelProperties(this.properties, user);

      users.push(user);

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  findByPk(primaryKeyValue) {
    try { 
      const user = users.find(user => user.id === primaryKeyValue);

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  findAll() {
    try { 
      const userList = [ ...users ];

      return userList;  
    } catch (error) {
      throw new Error(error);
    }
  }

  findByEmail(email) {
    try {
      const user = users.find(user => user.email === email);

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }


  updateOne(userId, userData) {
    try { 
      validateModelProperties(this.properties, userData);

      const findUserIndex = users.findIndex(user => user.id === userId);

      if(findUserIndex === -1) {
        throw new Error('User does not exist');
      }

      let user = users[findUserIndex];

      user = {
        ...user,
        ...userData
      }

      users[findUserIndex] = user;

      return "User successfully updated"
    } catch (error) { 
      throw new Error(error);
    }
  }

  deleteOne(userId) {
    try {
      const findUserIndex = users.findIndex(user => user.id === userId);

      if(findUserIndex === -1) {
        throw new Error('User does not exist');
      }

      users.splice(findUserIndex, 1);

      return "User successfully removed";
    } catch (error) {
      throw new Error(error);
    }
  }

}

module.exports = User;