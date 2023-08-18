const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const config = require('../config/config');
const connectToDynamicDatabase = require('./mongoClientConnection');

//const client = new MongoClient(config.mongoClient, { useNewUrlParser: true, useUnifiedTopology: true });

// const checkConnection = async () => {
//   if (!client.isConnected()) {
//     try {
//       await client.connect();
//       //  console.log('Connected to MongoDB');
//     } catch (error) {
//       // console.error('Error connecting to MongoDB:', error);
//       return false;
//     }
//   }
//   return true;
// };


const getRecords = async (params) => {
  const { dbname, tablename, userid, teamid, fetchteam, fetchuser } = params;

  const db = await connectToDynamicDatabase(dbname);
  // const dynamicCollection = db.collection('DynamicCollection');

  //console.log('//------------------k2-----------', fetchteam, fetchuser);
  // if needs data by user level

  if (fetchuser == 'true') {
    result = await db.collection(tablename).find({ createdbyuser: userid }).toArray();
    //console.log('//--------------createdbyuser----------', fetchuser);
    return result;
  }

  // if needs data by user level
  if (fetchteam == 'true') {
    result = await db.collection(tablename).find({ createdbyteam: teamid }).toArray();
    //console.log('//--------------fetchteam----------', fetchteam);
    return result;
  }

  result = await db.collection(tablename).find().toArray();
  //console.log('//------------------k3-----------', dbname, result);
  return result;
};


const getRecordsWithParams = async (params, query) => {
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
    Object.assign(queryObj, { createdbyuser: userid })

  }

  // if needs data by user level
  if (fetchteam == 'true') {
    Object.assign(queryObj, { createdbyteam: teamid })

  }



  const db = await connectToDynamicDatabase(dbname);
  let result = [];


  if (fld1 != undefined) {
    console.log('--result--==--', tablename, queryObj)
    result = await db.collection(tablename).find(queryObj).toArray();
  } else {
    console.log('-- re ss s--==--')
    result = await db.collection(tablename).find().toArray();
  }


  return result;
};

const getRecord = async (params) => {

  const { dbname, tablename, id } = params;
  const db = await connectToDynamicDatabase(dbname);
  const result = await db
    .collection(tablename)
    .find({ _id: mongoose.Types.ObjectId(id) })
    .toArray();
  //console.log(dbname, '--', result);
  return result;
};

const getRecordByColumnName = async (params) => {

  const { dbname, tablename, columnname, id, userid, teamid, fetchteam, fetchuser } = params;
  const db = await connectToDynamicDatabase(dbname);

  if (fetchuser == 'true') {
    result = await db.collection(tablename).find({ [columnname]: id, createdbyuser: userid }).toArray();
    //console.log('//--------------createdbyuser----------', fetchuser);
    return result;
  }

  // if needs data by user level
  if (fetchteam == 'true') {
    result = await db.collection(tablename).find({ [columnname]: id, createdbyteam: teamid }).toArray();
    //console.log('//--------------fetchteam----------', fetchteam);
    return result;
  }

  result = await db.collection(tablename).find({ [columnname]: id }).toArray();
  //console.log(dbname, '--', result);
  return result;
};

const updateRecord = async (params, body) => {
  const { dbname, tablename, id } = params;
  const db = await connectToDynamicDatabase(dbname);
  const queryId = { _id: id };
  const newvalues = { $set: body };
  await db.collection(tablename).updateOne(queryId, newvalues);
  const result = await db.collection(tablename).find({}).toArray();
  return result;
};

const updateCollection = async (params, body) => {

  console.log('-------params--------', params);
  console.log('-------body--------', body);
  const { dbname, tablename, id } = params;
  const query = { _id: mongoose.Types.ObjectId(id) };
  const bsonRes = await reFormJSON(body)
  const update = { $set: bsonRes };

  try {
    const db = await connectToDynamicDatabase(dbname);
    await db.collection(tablename).updateOne(query, update);
    const result = db.collection(tablename).find().toArray();
   
    return result;
  } catch (err) {
    console.error(err);
  }
};

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
}

const addRecord = async (params, body, query) => {
  const { dbname, tablename, id } = params;
  // const db = await connectToDynamicDatabase(dbname);
  // const collection = db(dbname).collection(tablename);
  const db = await connectToDynamicDatabase(dbname);
  const collection = db.collection(tablename);
  const { refid } = query;
  const { colname } = query;
  const bsonRes = await reFormJSON(body)
  // const result = await db.collection(tablename).find({ [columnname]: id }).toArray();
  try {
    const result = await collection.insertOne(bsonRes);
    //console.log('-------case undefined--------', result.ops);
    return result.ops;
  } catch (error) {
    console.error(error);
    // res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteRecord = async (params) => {
  try {

    const { dbname, tablename, id } = params;
    const db = await connectToDynamicDatabase(dbname);
    const record_id = mongoose.Types.ObjectId(id);

    const result = await db.collection(tablename).deleteOne({ _id: record_id });
    return result;
  } catch (error) {
    console.log(error);
    //  res.status(500).json(error);
  }
};

async function addCollection(tableName, databaseName) {
  try {
    const db = await connectToDynamicDatabase(databaseName);
    const collections = await db.listCollections().toArray();

    const isSafeToCreate = !collections.some((collection) => collection.name === tableName);
    if (!isSafeToCreate) {
      return Promise.resolve('a');
    }

    const newCollection = await db.createCollection(tableName);
    await newCollection.insertOne({});

    // client.close();

    return Promise.resolve('b');
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

async function dropCollection(databaseName, tableName) {
  try {
    const db = await connectToDynamicDatabase(databaseName);
    const collections = await db.listCollections(null, { nameOnly: true }).toArray();
    // console.log(databaseName, 'tableName', tableName);
    const collectionExists = collections.some((collection) => collection.name === tableName);
    if (!collectionExists) {
      return Promise.resolve('a');
    }

    const result = await db.dropCollection(tableName);
    return Promise.resolve(result);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

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
