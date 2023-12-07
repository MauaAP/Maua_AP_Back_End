const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const userController = require('./Controllers/userController')

const app = express()

app.use(bodyParser.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

// Rotas
app.get('/users', userController.getAllUsers)
app.get('/users/:id', userController.getUserById)
app.post('/users', userController.createUser)
app.put('/users/:id', userController.updateUser)
app.delete('/users/:id', userController.deleteUser)

const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`App rodando em http://localhost:${port}`)
})