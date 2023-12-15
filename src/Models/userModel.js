const db = require('../Utils/database')

const User = {
  getAllUsers: (callback) => {
    db.query('SELECT * FROM tb_usuario', callback)
  },
  getUserById: (id, callback) => {
    db.query('SELECT * FROM tb_usuario WHERE cpf = ?', [id], callback)
  },
  createUser: (user, callback) => {
    db.query('INSERT INTO tb_usuario SET ?', user, callback)
  },
  updateUser: (id, user, callback) => {
    db.query('UPDATE tb_usuario SET ? WHERE cpf = ?', [user, id], callback)
  },
  deleteUser: (id, callback) => {
    db.query('DELETE FROM tb_usuario WHERE cpf = ?', [id], callback)
  }
}

module.exports = User