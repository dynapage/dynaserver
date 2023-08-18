const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { dynaColumnService } = require('../services');

const getColumns = catchAsync(async (req, res) => {
  const dynaColumns = await dynaColumnService.getDynaColumns(req.params.appid, req.params.id);
  if (!dynaColumns) {
    throw new ApiError(httpStatus.NOT_FOUND, 'dyna Columns not found');
  }
  res.send(dynaColumns);
});

const getTableByColumn = catchAsync(async (req, res) => {
  const dynaColumn = await dynaColumnService.getDynaTableByColumnId(req.params.appid, req.params.id);
  if (!dynaColumn) {
    res.send(dynaColumn);
    return
  }
  res.send(dynaColumn[0]);
});

const checkColumnName = catchAsync(async (req, res) => {
  const dynaColumnName = await dynaColumnService.checkColumnName(req.params.appid, req.params.columnname);
  if (!dynaColumnName) {
    throw new ApiError(httpStatus.NOT_FOUND, 'dynaColumnName not found');
  }
  res.send(dynaColumnName);
});

const updateColumn = catchAsync(async (req, res) => {
  const dynaColumn = await dynaColumnService.updateDynaColumnById(
    req.params.appid,
    req.params.tableid,
    req.params.columnid,
    req.body
  );
  res.send(dynaColumn);
});

const createColumn = catchAsync(async (req, res) => {
  const dynaColumn = await dynaColumnService.createDynaColumn(req.params.id, req.params.tableid, req.body);
  res.status(httpStatus.CREATED).send(dynaColumn);
});

const deleteColumn = catchAsync(async (req, res) => {
  const dynaColumn = await dynaColumnService.deleteDynaColumn(req.params.appid, req.params.tableid, req.params.id);
  res.status(httpStatus.CREATED).send(dynaColumn);
});

module.exports = {
  getColumns,
  getTableByColumn,
  updateColumn,
  createColumn,
  deleteColumn,
  checkColumnName,
};
