const mysql = require('mysql')

// Conexão de configuração MySQL 
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password123',
    database: 'crud'
})

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco:', err)
        return;
    }
    console.log('Conectado ao MySQL database')
})

module.exports = connection