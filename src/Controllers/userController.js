const UserService = require('../Services/userService')

const UserController = {
  getAllUsers: (req, res) => {
    UserService.getAllUsers((err, users) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      res.status(200).json(users)
    })
  },
  getUserById: (req, res) => {
    const id = req.params.id
    UserService.getUserById(id, (err, user) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      if (!user) {
        res.status(404).json({ message: 'Usuario nao encontrado' })
        return
      }
      res.status(200).json(user)
    })
  },
  createUser: (req, res) => {
    const newUser = req.body
    UserService.createUser(newUser, (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      res.status(201).json({ message: 'Usuario criado', id: result.insertId })
    })
  },
  updateUser: (req, res) => {
    const id = req.params.id
    const updatedUser = req.body
    UserService.updateUser(id, updatedUser, (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ message: 'Usuario nao encontrado' })
        return
      }
      res.status(200).json({ message: 'Usuario atualizado' })
    })
  },
  deleteUser: (req, res) => {
    const id = req.params.id
    UserService.deleteUser(id, (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ message: 'Usuario nao encontrado' })
        return
      }
      res.status(200).json({ message: 'Usuario deletado' })
    })
  }
}

module.exports = UserController