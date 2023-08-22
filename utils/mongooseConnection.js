const mongoose = require('mongoose');
const config = require('../config/config');

const url = config.mongoClient;

function connectToDynamicMongoose(databaseName) {
  const dynamicConnection = mongoose.createConnection(`${url}${databaseName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  dynamicConnection.on('error', console.error.bind(console, `Dynamic database connection error (${databaseName}):`));
  dynamicConnection.once('open', () => {
    console.log(`Dynamic mongoose database connection (${databaseName}) established!`);
  });

  return dynamicConnection;
}

module.exports = { connectToDynamicMongoose };
