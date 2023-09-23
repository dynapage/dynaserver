const httpStatus = require('http-status');
const mongoose = require('mongoose');

const mongodb = require('mongodb');
const { DynaApp } = require('../models');
const { addCollection, dropCollection } = require('./dbCollection.service');
const { getDynaGrids } = require('./dynaform.service');

const ApiError = require('../utils/ApiError');

const { ObjectId } = mongoose.Schema;

const DynaTableSchema = {
  _id: '$apptables._id',
  name: '$apptables.name',
  active: '$apptables.active',
  type: '$apptables.type',
  accessid: '$apptables.accessid',
  columns: '$apptables.columns',
};

/**
 * Get DynaApp by id
 * @param {ObjectId} id
 * @returns {Promise<DynaApp>}
 */

const getDynaTables = async (id) => {
  try {
    const dynaApp = await DynaApp.findById(id).select([
      '-appforms',
      '-designers',
      '-teams',
      '-apptables.columns',
      '-referenceObjects',
      '-_id',
      '-position',
      '-dbname',
      '-name',
      '-active',
      '-startupFormid',
    ]);
    if (!dynaApp) {
      throw new ApiError(httpStatus.NOT_FOUND, 'dynaTable not found');
    }
    return dynaApp;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getDynaColumns = async (appid, tableid) => {
  const aggInput = [
    { $unwind: '$apptables' },
    { $unwind: '$apptables.columns' },
    { $match: { _id: mongoose.Types.ObjectId(appid) } },
    { $match: { 'apptables._id': mongoose.Types.ObjectId(tableid) } },
    {
      $project: {
        _id: '$apptables.columns._id',
        type: '$apptables.columns.type',
        shapevalue: '$apptables.columns.shapevalue',
        checked: '$apptables.columns.checked',
        texttype: '$apptables.columns.texttype',
        multiline: '$apptables.columns.multiline',
        required: '$apptables.columns.required',
        validation: '$apptables.columns.validation',
        label: '$apptables.columns.label',
        dataref: '$apptables.columns.dataref',
        datarefid: '$apptables.columns.datarefid',
        valuefield: '$apptables.columns.valuefield',
        dataOrderID: '$apptables.columns.dataOrderID',
        datafield: '$apptables.columns.datafield',
        tablecolumn: '$apptables.columns.tablecolumn',
        defaultvalue: '$apptables.columns.defaultvalue',
        relatedrefcolumn: '$apptables.columns.relatedrefcolumn',
        tablerefobject: '$apptables.columns.tablerefobject',
        formattype: '$apptables.columns.formattype',
        redirectto: '$apptables.columns.redirectto',
      },
    },
    { $limit: 100 },
  ];

  const dynaAppTables = await DynaApp.aggregate(aggInput).exec();
  return dynaAppTables;
};

const getDynaTableById = async (appid, tableid) => {
  // return DynaApp.findById(id).select().exec();
  const dynaAppTables = await DynaApp.aggregate([
    { $unwind: '$apptables' },
    { $match: { _id: mongoose.Types.ObjectId(appid) } },
    { $match: { 'apptables._id': mongoose.Types.ObjectId(tableid) } },
    {
      $project: {
        _id: '$apptables._id',
        name: '$apptables.name',
        type: '$apptables.type',
        accessid: '$apptables.accessid',
        active: '$apptables.active',
        columns: '$apptables.columns',
        childTables: '$apptables.childTables',
      },
    },
  ]);

  return dynaAppTables[0];
};
/**
 * Update DynaApp by id
 * @param {Object} updateBody
 */
const updateDynaTableById = async (appid, tableid, updateBody) => {
  try {
    const dynaApp = await DynaApp.findById(appid).exec();
    if (!dynaApp) {
      throw new ApiError(httpStatus.NOT_FOUND, 'dynaApp not found');
    }

    let updatedDynaTable = await dynaApp.apptables.find((tbl) => tbl._id == tableid);
    if (!updatedDynaTable) {
      throw new ApiError(httpStatus.NOT_FOUND, 'updatedDynaTable not found');
    }
    console.log('--childTables:', updateBody)
    console.log('--updatedDynaTable:', updatedDynaTable)

    Object.assign(updatedDynaTable, updateBody);

   // updatedDynaTable = updateBody;
    await dynaApp.save();

    return dynaApp.apptables;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const createDynaTable = async (appid, dbname, updateBody) => {
//console.log('----updateBody------', updateBody)

  try {
    const dynaApp = await DynaApp.findById(appid).exec();
    if (!dynaApp) {
      throw new ApiError(httpStatus.NOT_FOUND, 'dynaTable not found');
    }
    const updatedDynaTable = dynaApp.apptables;
    if (!updatedDynaTable) {
      throw new ApiError(httpStatus.NOT_FOUND, 'updatedDDynaTable not found');
    }

    // const collectionStatus = await addCollection(updateBody.name, dbname);

    // if (collectionStatus == 'b') {
     
    // }
    updatedDynaTable.push(updateBody);
    dynaApp.save();
    return dynaApp;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

// router.route('/apptables/:appid/:columnid/:dbname/:tablename').delete(dynaTableController.deleteDynaTable)
const deleteDynaTable = async (params) => {
  try {
    const dynaApp = await DynaApp.findById(params.appid).exec();
    if (!dynaApp) {
      throw new ApiError(httpStatus.NOT_FOUND, 'dynaTable not found');
    }

    const checkTableLevelExists = dynaApp.appforms.find((frm) => frm.formSchemaRef == params.columnid);

    const getAllGrids = await getDynaGrids(params.appid);

    const checkGridLevelExists = getAllGrids.filter((gridControl) => gridControl.datarefid === params.columnid);
 
    if (checkTableLevelExists || checkGridLevelExists > 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Table has dependencies (Form(s) or Data grid(s) exists');
    }

    const collectionStatus = await dropCollection(params.dbname, params.tablename);
   //console.log(checkTableLevelExists, '-------------=============--', collectionStatus);
    //if (collectionStatus == true) {
      const updatedDynaTable = await dynaApp.apptables.find((tbl) => tbl._id == params.columnid);
      updatedDynaTable.remove();
      dynaApp.save();
      if (!updatedDynaTable) {
        throw new ApiError(httpStatus.NOT_FOUND, 'updatedDDynaTable not found');
      }
    //}

    return dynaApp;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

module.exports = {
  getDynaTables,
  getDynaTableById,
  updateDynaTableById,
  createDynaTable,
  getDynaColumns,
  deleteDynaTable,
};
