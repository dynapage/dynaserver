const httpStatus = require('http-status');
const mongodb = require('mongodb');
const { DynaApp } = require('../models');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');
const connectToDynamicDatabase = require('./mongoClientConnection');

/**
 * Get DynaApp by id
 * @param {ObjectId} id
 * @returns {Promise<DynaApp>}
 */
const getDynaAppByEmail = async (id) => {
  const apps = await DynaApp.aggregate()
    .match({
      'designers.userId': id.trim(),
    })
    .project({
      teams: 0,
      apptables: 0,
      appforms: 0,
      referenceObjects: 0,
    })
    .exec();
  return apps;
};

// const getDynaAppBySignIn = async (siteid, userid, pwd) => {

//   const aggInput = [
//     { $unwind: '$teams' },
//     { $match: { sitename: siteid } },
//     { $unwind: '$teams.users' },
//     {
//       $match: {
//         'teams.users.userId': userid,
//         'teams.users.userpwd': pwd
//       }
//     },
//     {
//       $project: {
//         _id: '$teams.users._id',
//         userId: '$teams.users.userId',
//         username: '$teams.users.username',
//         accessType: '$teams.accessType',
//         teamName: '$teams.teamName',
//         teamid: '$teams._id',
//         signedin: siteid,
//       }
//     }
//   ];
//   const dynaAppTables = await DynaApp.aggregate(aggInput).sort({ accessType: -1 }).exec();
//   return dynaAppTables;
// };

const getDynaAppBySignIn = async (siteid, userid, pwd) => {
  const regex = new RegExp(`^${userid}$`, 'i');
  const aggInput = [
    { $unwind: '$teams' },
    { $match: { sitename: siteid } },
    { $unwind: '$teams.users' },
    {
      $match: {
        'teams.users.userId': { $regex: regex },
        'teams.users.userpwd': pwd,
      },
    },
    {
      $project: {
        _id: '$teams.users._id',
        userId: '$teams.users.userId',
        username: '$teams.users.username',
        accessType: '$teams.accessType',
        teamName: '$teams.teamName',
        teamid: '$teams._id',
        appid: '$_id',
        signedin: siteid,
      },
    },
  ];

  console.log('--@@----', regex, ' = ', pwd, ' =  ', siteid);
  const dynaAppTables = await DynaApp.aggregate(aggInput).sort({ accessType: -1 }).exec();
  return dynaAppTables;
};

const getDynaAppCount = async (id) => {
  //const client = new mongodb.MongoClient(config.mongoose.url, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // await client.connect();
    // const db = client.db("dyna_db");

    const db = await connectToDynamicDatabase('dyna_db');

    const doccount = await db.collection('applications').countDocuments();
    //console.log('collection created:', 'DynapageTable', doccount);
    return { doCount: [doccount] };
  } catch (error) {
    console.error(error);
    return { doCount: 0 };
  }
};
//getDynaAppCount

const getDynaAppTeams = async (id) => {
  const results = await DynaApp.findById(id).select(['-appforms', '-referenceObjects', '-designers', '-apptables']).exec();
  return results.teams;
};

const getDynaAppById = async (id) => {
  return DynaApp.findById(id).select(['-referenceObjects']).exec();
};

/**
 * Update DynaApp by id
 * @param {Object} updateBody
 */
const updateDynaAppById = async (id, updateBody) => {
  const results = await DynaApp.findById(id).select(['-appforms', '-referenceObjects', '-apptables']).exec();

  if (!results) {
    throw new ApiError(httpStatus.NOT_FOUND, 'dyna_app not found');
  }

  Object.assign(results, updateBody);
  await results.save();
  return results;
};

/**
 * Update DynaApp by id
 * @param {Object} updateBody
 */
const updateAppTeams = async (id, updateBody) => {
  const results = await DynaApp.findById(id).select(['-appforms', '-referenceObjects', '-apptables']).exec();

  if (!results) {
    throw new ApiError(httpStatus.NOT_FOUND, 'dyna_app not found');
  }

  // console.log("----",   results.teams)
  results.teams = updateBody;

  await results.save();
  return results.teams;
};

const deleteDynaAppById = async (req) => {
  dropDatabase(req);
  const dyna_app = await getDynaAppById(req.params.id);
  if (!dyna_app) {
    throw new ApiError(httpStatus.NOT_FOUND, 'dyna_app not found');
  }
  await dyna_app.remove();
  const results = await getDynaAppByEmail(req.params.userid);

  //console.log(results)
  return results;
};

const createDynaApp = async (userid, AppBody) => {
  const createDbStatus = await createDatabase(AppBody);
  if (createDbStatus) {
    const results =  await DynaApp.create(AppBody);
    // console.log(userid);
   // const results = await getDynaAppByEmail(userid);
    // console.log('userid');
    return results;
  }

  return false;
};

const createDynaUser = async (id, teamid, AppBody) => {
  const dynaApp = await DynaApp.findById(id).select(['-appforms', '-referenceObjects', '-apptables']).exec();
  const dynTeam = dynaApp.teams.find((team) => team._id == teamid);
  dynTeam.users.push(AppBody);
  dynaApp.save();
  return dynaApp;
};

const updateDynaUser = async (id, teamid, userid, AppBody) => {
  const dynaApp = await DynaApp.findById(id).select(['-appforms', '-referenceObjects', '-apptables']).exec();
  const dynTeam = dynaApp.teams.find((team) => team._id == teamid);
  const dynUser = dynTeam.users.find((user) => user._id == userid);
  //console.log('--dynTeam --', dynTeam)
  Object.assign(dynUser, AppBody);
  dynaApp.save();
  return dynaApp;
};

const deleteDynaUser = async (id, teamid, userid) => {
  try {
    const dynaApp = await DynaApp.findById(id).select(['-appforms', '-referenceObjects', '-apptables']).exec();
    const dynTeam = dynaApp.teams.find((team) => team._id == teamid);
    const dynUser = await dynTeam.users.find((user) => user._id == userid);
   
    let username = dynUser.userId;
    let usersite = dynaApp.sitename;

    const res = await User.deleteOne({ username, usersite })
    //console.log('-----dynUser------------', dynUser, dynaApp.sitename)
    dynUser.remove();
    dynaApp.save();
    return dynaApp;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);

  }
};

const createDynaTemplate = async (userid, AppBody) => {
  // console.log(userid, AppBody);
  //const createDbStatus = await createDatabase(AppBody);
  //if (createDbStatus) {
  //console.log('-------teams--', userid)
  await DynaApp.create(AppBody);
  const results = await getDynaAppByEmail(userid);
  return results;
  // }

  return false;
};

async function createDatabase(AppBody) {
  //const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    // await client.connect();
    const newDB = await connectToDynamicDatabase(AppBody.dbname);
    //const newDB = await client.db(AppBody.dbname);
    await newDB.createCollection('DynapageTable');
    //console.log('collection created:', 'DynapageTable');
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function dropDatabase(req) {
  //console.log(req.params.dbname);
  const db = await connectToDynamicDatabase(req.params.dbname);

  db.dropDatabase();
}

module.exports = {
  getDynaAppTeams,
  updateAppTeams,
  getDynaAppCount,
  getDynaAppByEmail,
  getDynaAppBySignIn,
  getDynaAppById,
  updateDynaAppById,
  createDynaApp,
  createDynaUser,
  updateDynaUser,
  deleteDynaUser,
  createDynaTemplate,
  deleteDynaAppById,
};
