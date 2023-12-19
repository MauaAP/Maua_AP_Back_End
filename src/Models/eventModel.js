const db = require('../Utils/database')

const Event = {
  getAllEvents: (callback) => {
    db.query('SELECT * FROM tb_evento', callback)
  },
  getEventById: (id, callback) => {
    db.query('SELECT * FROM tb_evento WHERE id = ?', [id], callback)
  },
  createEvent: (event, callback) => {
    db.query('INSERT INTO tb_evento SET ?', event, callback)
  },
  updateEvent: (id, event, callback) => {
    db.query('UPDATE tb_evento SET ? WHERE id = ?', [event, id], callback)
  },
  deleteEvent: (id, callback) => {
    db.query('DELETE FROM tb_evento WHERE id = ?', [id], callback)
  }
}

module.exports = Event