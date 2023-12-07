const mysql = require('mysql')

// Conexão de configuração MySQL 
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'mysql_username',
    password: 'mysql_password',
    database: 'database_name'
})

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco:', err)
        return;
    }
    console.log('Conectado ao MySQL database')
})

module.exports = connection