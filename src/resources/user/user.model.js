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

  async create (userBody) {
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

  async findByPk(primaryKeyValue) {
    try { 
      const user = users.find(user => user.id === primaryKeyValue);

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll() {
    try { 
      const userList = [ ...users ];

      return userList;  
    } catch (error) {
      throw new Error(error);
    }
  }

  async findByEmail(email) {
    try {
      const user = users.find(user => user.email === email);

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }


}

module.exports = User;