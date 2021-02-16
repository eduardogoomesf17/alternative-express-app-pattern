const formatUserData = (userData) => {
  return {
    id: userData.id,
    name: userData.name,
    email: userData.email
  }
};

const formatUsersData = (users) => {
  const formattedUsers = users.map(user => {

    return {
			id: user.id,
			name: user.name,
			email: user.email,
		};

  })

  return formattedUsers;
};

module.exports = { formatUserData, formatUsersData };