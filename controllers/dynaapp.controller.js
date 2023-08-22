const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { dynaAppService } = require('../services');

const getAppByID = catchAsync(async (req, res) => {
  const dynaApplication = await dynaAppService.getDynaAppById(req.params.id);
  if (!dynaApplication) {
    throw new ApiError(httpStatus.NOT_FOUND, 'dynaApplication not found');
  }
  res.send(dynaApplication);
});

const getAppTeams = catchAsync(async (req, res) => {
  const dynaApplication = await dynaAppService.getDynaAppTeams(req.params.id);
  if (!dynaApplication) {
    throw new ApiError(httpStatus.NOT_FOUND, 'dynaApplication not found');
  }
  res.send(dynaApplication);
});

const updateAppTeams = catchAsync(async (req, res) => {
  const dynaApplication = await dynaAppService.updateAppTeams(req.params.id, req.body);
  res.send(dynaApplication);
});

const getAppByUserEmail = catchAsync(async (req, res) => {
  const dynaApplication = await dynaAppService.getDynaAppByEmail(req.params.designerid);
  if (!dynaApplication) {
    throw new ApiError(httpStatus.NOT_FOUND, 'dynaApplication not found');
  }
  res.send(dynaApplication);
});

const getDynaAppBySignIn = catchAsync(async (req, res) => {
  const dynaApplication = await dynaAppService.getDynaAppBySignIn(req.params.siteid, req.params.userid, req.params.pwd);
  if (!dynaApplication) {
    throw new ApiError(httpStatus.NOT_FOUND, 'getDynaAppBySignIn not found');
  }
  res.send(dynaApplication);
});

const getAppByCount = catchAsync(async (req, res) => {
  const dynaApplication = await dynaAppService.getDynaAppCount(req.params.id);
  if (!dynaApplication) {
    throw new ApiError(httpStatus.NOT_FOUND, 'dynaApplication not found');
  }
  res.send(dynaApplication);
});

//getAppByCount

const updateDynaApp = catchAsync(async (req, res) => {
  const dynaApplication = await dynaAppService.updateDynaAppById(req.params.id, req.body);
  res.send(dynaApplication);
});

const createDynaApp = catchAsync(async (req, res) => {
  const newdb = await dynaAppService.createDynaApp(req.params.designerid, req.body);
  if (newdb) {
    res.status(httpStatus.CREATED).send(newdb);
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'APP not created, check log');
  }
});

const createDynaUser = catchAsync(async (req, res) => {
  const newdb = await dynaAppService.createDynaUser(req.params.id, req.params.teamid, req.body);
  if (newdb) {
    res.status(httpStatus.CREATED).send(newdb);
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'APP not created, check log');
  }
});

const updateDynaUser = catchAsync(async (req, res) => {
  const dynaApplication = await dynaAppService.updateDynaUser(req.params.id, req.params.teamid, req.params.userid, req.body);
  res.send(dynaApplication);
});

const deleteDynaUser = catchAsync(async (req, res) => {
  const dynaApplication = await dynaAppService.deleteDynaUser(req.params.id, req.params.teamid, req.params.userid);
  res.send(dynaApplication);
});

const createDynaTemplate = catchAsync(async (req, res) => {
  const newdb = await dynaAppService.createDynaTemplate(req.params.userid, req.body);
  if (newdb) {
    res.status(httpStatus.CREATED).send(newdb);
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'APP not created, check log');
  }
});

//createDynaTemplate

const deleteDynaApp = catchAsync(async (req, res) => {
  const results = await dynaAppService.deleteDynaAppById(req);
  res.status(httpStatus.CREATED).send(results);
});

module.exports = {
  getAppTeams,
  updateAppTeams,
  getAppByID,
  getAppByUserEmail,
  getDynaAppBySignIn,
  getAppByCount,
  updateDynaApp,
  createDynaApp,
  createDynaUser,
  createDynaTemplate,
  updateDynaUser,
  deleteDynaUser,
  deleteDynaApp,
};
