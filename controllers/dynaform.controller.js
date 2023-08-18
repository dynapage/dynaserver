const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { dynaFormService } = require('../services');

const getForms = catchAsync(async (req, res) => {
  const results = await dynaFormService.getDynaForms(req.params.id);
  if (!results) {
    throw new ApiError(httpStatus.NOT_FOUND, 'results not found');
  }
  res.send(results);
});

const getFormsByTableId = catchAsync(async (req, res) => {
  const results = await dynaFormService.getDynaForms(req.params.appid, req.params.tableid);
  if (!results) {
    throw new ApiError(httpStatus.NOT_FOUND, 'results not found');
  }
  res.send(results);
});

const getFormSections = catchAsync(async (req, res) => {
  const results = await dynaFormService.getDynaFormsSections(req.params.appid, req.params.formid);
  if (!results) {
    throw new ApiError(httpStatus.NOT_FOUND, 'results not found');
  }
  res.send(results);
});

// getDynaGrids

const getGrids = catchAsync(async (req, res) => {
  const results = await dynaFormService.getDynaGrids(req.params.appid);
  if (!results) {
    throw new ApiError(httpStatus.NOT_FOUND, 'results not found');
  }
  res.send(results);
});

const getFormByID = catchAsync(async (req, res) => {
  const results = await dynaFormService.getDynaFormById(req.params.appid, req.params.formid);
  if (!results) {
    throw new ApiError(httpStatus.NOT_FOUND, 'results not found');
  }
  res.send(results);
});

const getFormByTableID = catchAsync(async (req, res) => {
  const results = await dynaFormService.getDynaFormByTableId(req.params);
  if (!results) {
    throw new ApiError(httpStatus.NOT_FOUND, 'results not found');
  }
  res.send(results);
});

const updateDynaForm = catchAsync(async (req, res) => {
  const results = await dynaFormService.updateDynaFormById(req.params.appid, req.params.formid, req.body);
  res.status(httpStatus.CREATED).send(results);
});

const updateDynaSection = catchAsync(async (req, res) => {
  const results = await dynaFormService.updateDynaSections(req.params.id, req.params.formid, req.body);
  res.send(results);
});

const createDynaForm = catchAsync(async (req, res) => {
  const results = await dynaFormService.createDynaForm(req.params.appid, req.params.tableid, req.body);
  res.status(httpStatus.CREATED).send(results);
});

const deleteDynaForm = catchAsync(async (req, res) => {
  const results = await dynaFormService.deleteDynaForm(req.params.appid, req.params.formid);
  res.status(httpStatus.CREATED).send(results);
});

module.exports = {
  getForms,
  getFormByID,
  getFormByTableID,
  updateDynaForm,
  createDynaForm,
  deleteDynaForm,
  getFormSections,
  getGrids,
  updateDynaSection,
  getFormsByTableId,
};
