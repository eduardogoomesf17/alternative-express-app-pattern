const createUser = {
  name: "User for test",
	email: "user.test@hotmail.com ",
	age: 20,
	password: "qwerty"
}

const user = {
  ...createUser,
  id: 'a538612e-8d76-4ea1-93ed-92d4e0a42a71',
  createdAt: '2021-02-27'
}

const users = [ user, user ];

module.exports = { createUser, user, users };