const db = require('../Utils/database')

const Event = {
  getAllEvents: (callback) => {
    db.query('SELECT * FROM events', callback)
  },
  getEventById: (id, callback) => {
    db.query('SELECT * FROM events WHERE id = ?', [id], callback)
  },
  createEvent: (event, callback) => {
    db.query('INSERT INTO events SET ?', event, callback)
  },
  updateEvent: (id, event, callback) => {
    db.query('UPDATE events SET ? WHERE id = ?', [event, id], callback)
  },
  deleteEvent: (id, callback) => {
    db.query('DELETE FROM events WHERE id = ?', [id], callback)
  }
}

module.exports = Event