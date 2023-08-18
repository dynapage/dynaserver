const httpStatus = require('http-status');
const mongoose = require('mongoose');

const mongodb = require('mongodb');
const { DynaApp } = require('../models');

const ApiError = require('../utils/ApiError');

const { ObjectId } = mongoose.Schema;
/**
 * Get DynaApp by id
 * @param {ObjectId} id
 * @returns {Promise<DynaApp>}
 */


const DynaColumnSchema = {
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
  relatedreflookup: '$apptables.columns.relatedreflookup',
  relatedrefcolumn: '$apptables.columns.relatedrefcolumn',
  dataOrderID: '$apptables.columns.dataOrderID',
  datafield: '$apptables.columns.datafield',
  tablecolumn: '$apptables.columns.tablecolumn',
  defaultvalue: '$apptables.columns.defaultvalue',
  tablerefobject: '$apptables.columns.tablerefobject',
  formattype: '$apptables.columns.formattype',
  redirectto: '$apptables.columns.redirectto',
};

const getDynaColumns = async (appid, tableid) => {
  const aggInput = [
    { $unwind: '$apptables' },
    { $unwind: '$apptables.columns' },
    { $match: { _id: mongoose.Types.ObjectId(appid) } },
    { $match: { 'apptables._id': mongoose.Types.ObjectId(tableid) } },
    {
      $project: DynaColumnSchema,
    },
    { $limit: 35 },
  ];
  const dynaAppTables = await DynaApp.aggregate(aggInput).exec();
  return dynaAppTables;
};

const checkColumnName = async (appid, columnname) => {
  const aggInput = [
    { $unwind: '$appforms' },
    { $unwind: '$appforms.sections' },
    { $unwind: '$appforms.sections.columns' },
    { $unwind: '$appforms.sections.columns.shapes' },
    { $unwind: '$appforms.sections.columns.shapes.gridcols' },
    { $match: { _id: mongoose.Types.ObjectId(appid) } },
    { $match: { 'appforms.sections.columns.shapes.gridcols.shapevalue': columnname } },
  ];
  
  try {
    const dynaAppTables = await DynaApp.aggregate(aggInput).exec();
    //console.log('dynaAppTables', dynaAppTables, '--', appid, columnname);
    if (dynaAppTables.length > 0) {
      return { status: true };
    }

    return { status: false };
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getDynaTableByColumnId = async (appid, columnid) => {
  //console.log(appid, columnid);
  try {
    const result = await DynaApp.aggregate([
      { $unwind: '$apptables' },
      { $unwind: '$apptables.columns' },
      { $match: { _id: mongoose.Types.ObjectId(appid) } },
      { $match: { 'apptables.columns._id': mongoose.Types.ObjectId(columnid) } },
      { $project: { datarefid: '$apptables.columns.datarefid' } },
    ]);

    //console.log('-result--', result)

    const FinalTableResult = await DynaApp.aggregate([
      { $unwind: '$apptables' },
      { $match: { _id: mongoose.Types.ObjectId(appid) } },
      { $match: { 'apptables._id': mongoose.Types.ObjectId(result[0].datarefid) } },
      { $project: { _id: '$apptables._id', name: '$apptables.name' } },
    ]);

    return FinalTableResult;
  } catch (err) {
    return err;
  }
};

/**
 * Update DynaApp by id
 * @param {Object} updateBody
 */

const updateDynaColumnById = async (appid, tableid, columnid, updateBody) => {
  try {
    const dynaApp = await DynaApp.findById(appid).exec();
    if (!dynaApp) {
      throw new ApiError(httpStatus.NOT_FOUND, 'dynaApp not found');
    }

    const getDynaTable = dynaApp.apptables.find((tbl) => tbl._id == tableid);
    if (!getDynaTable) {
      throw new ApiError(httpStatus.NOT_FOUND, 'getDynaTable not found');
    }

    const getDynaColumn = getDynaTable.columns.find((col) => col._id == columnid);
    if (!getDynaColumn) {
      throw new ApiError(httpStatus.NOT_FOUND, 'getDynaColumn not found');
    }

    Object.assign(getDynaColumn, updateBody);
    await dynaApp.save();

    return getDynaTable.columns;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const createDynaColumn = async (appid, tableid, updateBody) => {
  try {
    const dynaApp = await DynaApp.findById(appid).exec();
    if (!dynaApp) {
      throw new ApiError(httpStatus.NOT_FOUND, 'dynaTable not found');
    }
    const updatedDynaColumns = dynaApp.apptables.find(({ _id }) => _id == tableid);
    if (!updatedDynaColumns) {
      throw new ApiError(httpStatus.NOT_FOUND, 'updatedDynaColumns not found');
    }
    updatedDynaColumns.columns.push(updateBody);
    dynaApp.save();
    return updatedDynaColumns.columns;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const deleteDynaColumn = async (appid, tableid, columnid) => {
  try {
    const dynaApp = await DynaApp.findById(appid).exec();
    if (!dynaApp) {
      throw new ApiError(httpStatus.NOT_FOUND, 'dynaTable not found');
    }
    const getDynaTable = dynaApp.apptables.find(({ _id }) => _id == tableid);
    if (!getDynaTable) {
      throw new ApiError(httpStatus.NOT_FOUND, 'getDynaTable not found');
    }

    const getDynaColumn = getDynaTable.columns.find(({ _id }) => _id == columnid);
    if (!getDynaColumn) {
      throw new ApiError(httpStatus.NOT_FOUND, 'getDynaColumn not found');
    }

    getDynaColumn.remove();
    dynaApp.save();
    return getDynaTable.columns;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

module.exports = {
  getDynaColumns,
  getDynaTableByColumnId,
  updateDynaColumnById,
  createDynaColumn,
  deleteDynaColumn,
  checkColumnName,
};
