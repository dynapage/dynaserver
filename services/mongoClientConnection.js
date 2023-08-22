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
    const database = client.db(databaseName);
    console.log(`Dynamic database connection (${databaseName}) established!`);
    return database;
  } catch (err) {
    console.error(`Dynamic database connection error (${databaseName}):`, err);
    throw err;
  }
}

module.exports = connectToDynamicDatabase;
