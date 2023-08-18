const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { dynaTableService } = require('../services');

const getTables = catchAsync(async (req, res) => {
  const dyna_tables = await dynaTableService.getDynaTables(req.params.id);
  if (!dyna_tables) {
    throw new ApiError(httpStatus.NOT_FOUND, 'dyna_tables not found');
  }
  res.send(dyna_tables);
});

const getTableById = catchAsync(async (req, res) => {
  const dyna_table = await dynaTableService.getDynaTableById(req.params.appid, req.params.tableid);
  if (!dyna_table) {
    throw new ApiError(httpStatus.NOT_FOUND, 'dyna_table not found');
  }
  res.send(dyna_table);
});

const getColumns = catchAsync(async (req, res) => {
  const dyna_columns = await dynaTableService.getDynaColumns(req.params.appid, req.params.id);
  if (!dyna_columns) {
    throw new ApiError(httpStatus.NOT_FOUND, 'dyna_columns not found');
  }
  res.send(dyna_columns);
});

const updateDynaTable = catchAsync(async (req, res) => {
  const dyna_table = await dynaTableService.updateDynaTableById(req.params.appid, req.params.tableid, req.body);
  res.send(dyna_table);
});

const createDynaTable = catchAsync(async (req, res) => {
  const dyna_table = await dynaTableService.createDynaTable(req.params.appid, req.params.dbname, req.body);
  res.status(httpStatus.CREATED).send(dyna_table);
});

const deleteDynaTable = catchAsync(async (req, res) => {
  // console.log('==========================deleteDynaTable===============')
  const dyna_table = await dynaTableService.deleteDynaTable(req.params);
  res.send(dyna_table);
});

module.exports = {
  getTables,
  getTableById,
  updateDynaTable,
  getColumns,
  createDynaTable,
  deleteDynaTable,
};
