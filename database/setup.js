// database/setup.js
require('dotenv').config();
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

// determine dev vs prod
const isProd = process.env.NODE_ENV === 'production';

const storagePath = isProd
  ? process.env.DB_STORAGE_PROD || path.join(__dirname, 'music_library_prod.db')
  : process.env.DB_STORAGE_DEV || path.join(__dirname, 'music_library.db');

// create Sequelize instance
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storagePath,
  logging: false, // keep console clean
});

// define Track model
const Track = sequelize.define(
  'Track',
  {
    trackId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    songTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    artistName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    albumName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER, // seconds
      allowNull: true,
    },
    releaseYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: 'tracks',
    timestamps: false,
  }
);

async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connection to music_library database established.');

    await sequelize.sync();
    console.log('Tracks table synced successfully.');
  } catch (err) {
    console.error('Database setup error:', err);
  } finally {
    await sequelize.close();
    console.log('Database connection closed after setup.');
  }
}

// run when called directly: node database/setup.js
if (require.main === module) {
  initDatabase();
}

// export for seed.js and server.js
module.exports = { sequelize, Track };
