const { connectToDynamicMongoose } = require('./mongooseConnection');

const connectToDB = (req, res, next) => {
  const dbname = req.params.dbname || req.body.dbname || req.query.dbname;

  if (!dbname) {
    return res.status(400).json({ error: 'dbname is required' });
  }

  try {
    const connection = connectToDynamicMongoose(dbname);

    if (!connection) {
      return res.status(500).json({ error: 'Failed to establish database connection' });
    }

    req.dbConnection = connection;
    next();
  } catch (error) {
    console.error(`Error connecting to ${dbname}:`, error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { connectToDB };
