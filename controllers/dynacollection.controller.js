const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { dynaCollectionService } = require('../services');

const getRecordsWithParams = catchAsync(async (req, res) => {
  const dynaDataRecords = await dynaCollectionService.getRecordsWithParams(req.params, req.body);
   
  if (!dynaDataRecords) {
    throw new ApiError(httpStatus.NOT_FOUND, 'dynaDataRecords not found');
  }
  res.send(dynaDataRecords);
});


const getRecords = catchAsync(async (req, res) => {
 
  const dynaDataRecords = await dynaCollectionService.getRecords(req.params);
  if (!dynaDataRecords) {
    throw new ApiError(httpStatus.NOT_FOUND, 'dynaDataRecords not found');
  }
  res.send(dynaDataRecords);
});
//getRecords

const getRecord = catchAsync(async (req, res) => {
  const dynaDataRecord = await dynaCollectionService.getRecord(req.params);
  if (!dynaDataRecord) {
    throw new ApiError(httpStatus.NOT_FOUND, 'dynaDataRecord not found');
  }
  res.send(dynaDataRecord);
});

const getRecordByColumnName = catchAsync(async (req, res) => {
  const dynaDataRecord = await dynaCollectionService.getRecordByColumnName(req.params);
  if (!dynaDataRecord) {
    throw new ApiError(httpStatus.NOT_FOUND, 'dynaDataRecord not found');
  }
  res.send(dynaDataRecord);
});
// getRecordByColumnName

const updateCollection = catchAsync(async (req, res) => {
  const dynaTable = await dynaCollectionService.updateCollection(req.params, req.body);
  res.send(dynaTable);
});

const insertCollectionRecord = catchAsync(async (req, res) => {
  const dynaDataRecord = await dynaCollectionService.addRecord(req.params, req.body, req.query);
  res.status(httpStatus.CREATED).send(dynaDataRecord);
});

const deleteCollectionRecord = catchAsync(async (req, res) => {
  const dynaDataRecord = await dynaCollectionService.deleteRecord(req.params);
  res.status(httpStatus.CREATED).send(dynaDataRecord);
});

module.exports = {
  getRecords,
  getRecord,
  getRecordsWithParams,
  updateCollection,
  insertCollectionRecord,
  deleteCollectionRecord,
  getRecordByColumnName,
};
