const express = require('express');
const router = express.Router();
const Note = require('../model/note.model.js');

router.post('/', async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const note = new Note({
      ...req.body,
      user: req.user._id
    });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ message: 'Error creating note', error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notes' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);
  } catch (err) {
    res.status(400).json({ message: 'Error updating note' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting note' });
  }
});

module.exports = router;