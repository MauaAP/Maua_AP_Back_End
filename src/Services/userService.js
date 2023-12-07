const User = require('../Models/userModel')

const UserService = {
  getAllUsers: (callback) => {
    User.getAllUsers(callback)
  },
  getUserById: (id, callback) => {
    User.getUserById(id, callback)
  },
  createUser: (user, callback) => {
    User.createUser(user, callback)
  },
  updateUser: (id, user, callback) => {
    User.updateUser(id, user, callback)
  },
  deleteUser: (id, callback) => {
    User.deleteUser(id, callback)
  }
};

module.exports = UserService