const db = require('../Utils/database')

const User = {
  getAllUsers: (callback) => {
    db.query('SELECT * FROM users', callback)
  },
  getUserById: (id, callback) => {
    db.query('SELECT * FROM users WHERE id = ?', [id], callback)
  },
  createUser: (user, callback) => {
    db.query('INSERT INTO users SET ?', user, callback)
  },
  updateUser: (id, user, callback) => {
    db.query('UPDATE users SET ? WHERE id = ?', [user, id], callback)
  },
  deleteUser: (id, callback) => {
    db.query('DELETE FROM users WHERE id = ?', [id], callback)
  }
}

module.exports = User