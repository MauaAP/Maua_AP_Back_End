const EventService = require('../Services/eventService')

const EventController = {
  getAllEvents: (req, res) => {
    EventService.getAllEvents((err, events) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      res.status(200).json(events)
    })
  },
  getEventById: (req, res) => {
    const id = req.params.id
    EventService.getEventById(id, (err, event) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      if (!event) {
        res.status(404).json({ message: 'Evento nao encontrado' })
        return
      }
      res.status(200).json(event)
    })
  },
  createEvent: (req, res) => {
    const newEvent = req.body
    EventService.createEvent(newEvent, (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message })
        console.log(err)
        return
      }
      res.status(201).json({ message: 'Evento criado', id: result.insertId })
    })
  },
  updateEvent: (req, res) => {
    const id = req.params.id
    const updatedEvent = req.body
    EventService.updateEvent(id, updatedEvent, (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ message: 'Evento nao encontrado' })
        return
      }
      res.status(200).json({ message: 'Evento atualizado' })
    })
  },
  deleteEvent: (req, res) => {
    const id = req.params.id
    EventService.deleteEvent(id, (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ message: 'Evento nao encontrado' })
        return
      }
      res.status(200).json({ message: 'Evento deletado' })
    })
  }
}

module.exports = EventController