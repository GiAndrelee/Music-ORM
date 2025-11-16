// server.js
require('dotenv').config();
const express = require('express');
const { sequelize, Track } = require('./database/setup');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// basic health route
app.get('/', (req, res) => {
  res.json({ message: 'Music ORM API is running.' });
});

// GET /api/tracks - all tracks
app.get('/api/tracks', async (req, res) => {
  try {
    const tracks = await Track.findAll();
    res.json(tracks);
  } catch (err) {
    console.error('Error fetching tracks:', err);
    res.status(500).json({ error: 'Failed to fetch tracks.' });
  }
});

// GET /api/tracks/:id - by primary key
app.get('/api/tracks/:id', async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);

    if (!track) {
      return res.status(404).json({ error: 'Track not found.' });
    }

    res.json(track);
  } catch (err) {
    console.error('Error fetching track:', err);
    res.status(500).json({ error: 'Failed to fetch track.' });
  }
});

// POST /api/tracks - create new track
app.post('/api/tracks', async (req, res) => {
  try {
    const {
      songTitle,
      artistName,
      albumName,
      genre,
      duration,
      releaseYear,
    } = req.body;

    if (!songTitle || !artistName || !albumName || !genre) {
      return res.status(400).json({
        error: 'songTitle, artistName, albumName, and genre are required.',
      });
    }

    const newTrack = await Track.create({
      songTitle,
      artistName,
      albumName,
      genre,
      duration,
      releaseYear,
    });

    res.status(201).json(newTrack);
  } catch (err) {
    console.error('Error creating track:', err);
    res.status(500).json({ error: 'Failed to create track.' });
  }
});

// PUT /api/tracks/:id - update existing track
app.put('/api/tracks/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const [rowsUpdated] = await Track.update(req.body, {
      where: { trackId: id },
    });

    if (rowsUpdated === 0) {
      return res.status(404).json({ error: 'Track not found.' });
    }

    const updatedTrack = await Track.findByPk(id);
    res.json(updatedTrack);
  } catch (err) {
    console.error('Error updating track:', err);
    res.status(500).json({ error: 'Failed to update track.' });
  }
});

// DELETE /api/tracks/:id - delete a track
app.delete('/api/tracks/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const rowsDeleted = await Track.destroy({
      where: { trackId: id },
    });

    if (rowsDeleted === 0) {
      return res.status(404).json({ error: 'Track not found.' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('Error deleting track:', err);
    res.status(500).json({ error: 'Failed to delete track.' });
  }
});

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database from server.');
  } catch (err) {
    console.error('Unable to connect to database from server:', err);
  }

  console.log(`Music ORM API listening on port ${PORT}`);
});
