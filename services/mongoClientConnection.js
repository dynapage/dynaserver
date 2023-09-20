const { MongoClient } = require('mongodb');
const config = require('../config/config');

async function connectToDynamicDatabase(databaseName) {
  const url = config.mongoClient; // Replace with your MongoDB server address
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const db = client.db(databaseName);
    return db;
  } catch (err) {
    console.error(`Dynamic database connection error (${databaseName}):`, err);
    throw err;
  }
}


module.exports = connectToDynamicDatabase;


