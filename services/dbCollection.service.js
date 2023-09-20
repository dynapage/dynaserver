const mongoose = require('mongoose');
const { MongoClient, ObjectId } = require('mongodb');
const config = require('../config/config');
const connectToDynamicDatabase = require('./mongoClientConnection');


async function getRecords(params) {
  let client;
  try {
    // Create a MongoDB client and connect
    const url = config.mongoClient; // Replace with your MongoDB server address
    client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    const { dbname, tablename, userid, teamid, fetchteam, fetchuser } = params;
    const db = client.db(dbname);

    let result;

    if (fetchuser == 'true') {
      result = await db.collection(tablename).find({ createdbyuser: userid }).toArray();
    } else if (fetchteam == 'true') {
      result = await db.collection(tablename).find({ createdbyteam: teamid }).toArray();
    } else {
      result = await db.collection(tablename).find().toArray();
    }

    return result;
  } catch (error) {
    console.error(error);
    return [];
  } finally {
    if (client) {
      await client.close(); // Close the MongoDB connection in the finally block
    }
  }
}



async function getRecordsWithParams(params, query) {
  let client;
  try {
    // Create a MongoDB client and connect
    const url = config.mongoClient; // Replace with your MongoDB server address
    client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    const { dbname, tablename, columnname, id, userid, teamid, fetchteam, fetchuser } = params;
    const { fld1 } = query;
    const { opr } = query;
    const { cons } = query;
    const q = `^${cons}`;

    const queryObj = {};
    switch (opr) {
      case 1:
        queryObj[fld1] = { $regex: `^${cons}`, $options: 'i' };
        break;
      case 10:
        queryObj[fld1] = cons;
        break;
      case 2:
        queryObj[fld1] = { $gt: cons };
        break;
      case 6:
        queryObj[fld1] = { $ne: cons };
        break;
      case 7:
        queryObj[fld1] = { $regex: `^${cons}`, $options: 'i' };
        break;
      default:
        queryObj[fld1] = { $regex: `^${cons}`, $options: 'i' };
    }

    if (fetchuser == 'true') {
      Object.assign(queryObj, { createdbyuser: userid });
    }

    if (fetchteam == 'true') {
      Object.assign(queryObj, { createdbyteam: teamid });
    }

    const db = client.db(dbname);
    let result = [];

    if (fld1 != undefined) {
      result = await db.collection(tablename).find(queryObj).toArray();
    } else {
      result = await db.collection(tablename).find().toArray();
    }

    return result;
  } catch (error) {
    console.error(error);
    return [];
  } finally {
    if (client) {
      await client.close(); // Close the MongoDB connection in the finally block
    }
  }
}


async function getRecord(params) {
  let client;
  try {
    // Create a MongoDB client and connect
    const url = config.mongoClient; // Replace with your MongoDB server address
    client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    const { dbname, tablename, id } = params;
    const db = client.db(dbname);
    const result = await db
      .collection(tablename)
      .find({ _id: new ObjectId(id) }) // Convert id to ObjectId
      .toArray();

    return result;
  } catch (error) {
    console.error(error);
    return [];
  } finally {
    if (client) {
      await client.close(); // Close the MongoDB connection in the finally block
    }
  }
}

async function getRecordByColumnName(params) {
  let client;
  try {
    const { dbname, tablename, columnname, id, userid, teamid, fetchteam, fetchuser } = params;
    // Create a MongoDB client and connect
    const url = config.mongoClient; // Replace with your MongoDB server address
    client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    const db = client.db(dbname);
    let result = [];

    if (fetchuser == 'true') {
      result = await db.collection(tablename).find({ [columnname]: id, createdbyuser: userid }).toArray();
    } else if (fetchteam == 'true') {
      result = await db.collection(tablename).find({ [columnname]: id, createdbyteam: teamid }).toArray();
    } else {
      result = await db.collection(tablename).find({ [columnname]: id }).toArray();
    }

    return result;
  } catch (error) {
    console.error(error);
    return [];
  } finally {
    if (client) {
      await client.close(); // Close the MongoDB connection in the finally block
    }
  }
}

async function updateCollection(params, body) {
  let client;
  try {
    const { dbname, tablename, id } = params;
    const query = { _id: new ObjectId(id) }; // Convert id to ObjectId
    const bsonRes = await reFormJSON(body);

    // Create a MongoDB client and connect
    const url = config.mongoClient; // Replace with your MongoDB server address
    client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    const db = client.db(dbname);
    await db.collection(tablename).updateOne(query, { $set: bsonRes });
    const result = await db.collection(tablename).find().toArray();

    return result;
  } catch (error) {
    console.error(error);
    return [];
  } finally {
    if (client) {
      await client.close(); // Close the MongoDB connection in the finally block
    }
  }
}



const reFormJSON = async (body) => {

  let newJ = {};
  for (var i in body) {
    console.log('------JSON  item-------', i, '-- ', body[i]);
    let result = i.includes("_xxuid");
    if (result) {
      let f = i.replace("_xxuid", "");
      newJ[f] = mongoose.Types.ObjectId(body[i])

    }
    else {
      newJ[i] = body[i]
    }
  }
  return newJ;
};


async function addRecord(params, body, query) {
  let client;
  try {
    const { dbname, tablename } = params;
    const url = config.mongoClient; // Replace with your MongoDB server address
    client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    const db = client.db(dbname);
    const collection = db.collection(tablename);
    const { refid } = query;
    const { colname } = query;
    const bsonRes = await reFormJSON(body);
    const result = await collection.insertOne(bsonRes);
    return result.ops;
  } catch (error) {
    console.error('--------ADDRECORD', error);
    return [];
  } finally {
    if (client) {
      await client.close(); // Close the MongoDB connection in the finally block
    }
  }
};


async function deleteRecord(params) {
  let client;
  try {
    const { dbname, tablename, id } = params;

    console.log('-deleteRecord  ---- ',  dbname, tablename, id)
    const url = config.mongoClient; // Replace with your MongoDB server address
    client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    const db = client.db(dbname);
    const record_id = new ObjectId(id);
    const result = await db.collection(tablename).deleteOne({ _id: record_id });
    return result;
  } catch (error) {
    console.error(error);
    return [];
  } finally {
    if (client) {
      await client.close(); // Close the MongoDB connection in the finally block
    }
  }
}

async function addCollection(tableName, databaseName) {
  let client;
  try {
    const url = config.mongoClient; // Replace with your MongoDB server address
    client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    const db = client.db(databaseName);
    const collections = await db.listCollections().toArray();
    const isSafeToCreate = !collections.some((collection) => collection.name === tableName);
    if (!isSafeToCreate) {
      return 'a';
    }
    const newCollection = await db.createCollection(tableName);
    await newCollection.insertOne({});
    return 'b';
  } catch (error) {
    console.error(error);
    return 'a';
  } finally {
    if (client) {
      await client.close(); // Close the MongoDB connection in the finally block
    }
  }
};

async function dropCollection(databaseName, tableName) {
  let client;
  try {
    const url = config.mongoClient; // Replace with your MongoDB server address
    client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    const db = client.db(databaseName);
    const collections = await db.listCollections(null, { nameOnly: true }).toArray();
    const collectionExists = collections.some((collection) => collection.name === tableName);
    if (!collectionExists) {
      return 'a';
    }
    const result = await db.dropCollection(tableName);
    return result;
  } catch (error) {
    console.error(error);
    return 'a';
  } finally {
    if (client) {
      await client.close(); // Close the MongoDB connection in the finally block
    }
  }
};



module.exports = {
  addCollection,
  addRecord,
  getRecords,
  getRecordsWithParams,
  getRecord,
  deleteRecord,
  dropCollection,
  updateCollection,
  getRecordByColumnName,
};
