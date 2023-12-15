const Event = require('../Models/eventModel')

const EventService = {
  getAllEvents: (callback) => {
    Event.getAllEvents(callback)
  },
  getEventById: (id, callback) => {
    Event.getEventById(id, callback)
  },
  createEvent: (event, callback) => {
    Event.createEvent(event, callback)
  },
  updateEvent: (id, event, callback) => {
    Event.updateEvent(id, event, callback)
  },
  deleteEvent: (id, callback) => {
    Event.deleteEvent(id, callback)
  }
};

module.exports = EventService