const httpStatus = require('http-status');
const mongoose = require('mongoose');

const mongodb = require('mongodb');
const { DynaApp, DynaTable } = require('../models');

const ApiError = require('../utils/ApiError');

const { ObjectId } = mongoose.Schema;

/**
 * Get DynaApp by id
 * @param {ObjectId} id
 * @returns {Promise<DynaApp>}
 */

const DynaFormSchema = {
  _id: '$appforms._id',
  name: '$appforms.name',
  label: '$appforms.label',
  formDataRef: '$appforms.formDataRef',
  formSchemaRef: '$appforms.formSchemaRef',
  formSchemaRefID: '$appforms.formSchemaRefID',
  showteamdata: '$appforms.showteamdata',
  showuserdata: '$appforms.showuserdata',
  formula: '$appforms.formula',
  formsteps: '$appforms.formsteps',
  t1: '$appforms.t1',
  t2: '$appforms.t2',
  t3: '$appforms.t3',
  t4: '$appforms.t4',
  t5: '$appforms.t5',
  homepagemenu: '$appforms.homepagemenu',
  sections: '$appforms.sections',
};

const getDynaFormById = async (appid, formid) => {
  const dynaAppTables = await DynaApp.aggregate([
    { $unwind: '$appforms' },
    { $match: { _id: mongoose.Types.ObjectId(appid) } },
    { $match: { 'appforms._id': mongoose.Types.ObjectId(formid) } },
    {
      $project: DynaFormSchema,
    },
  ]).exec();
  return dynaAppTables[0];
};

const getDynaForms = async (id) => {
  // return DynaApp.findById(id).select().exec();
  const dynaAppTables = await DynaApp.aggregate([
    { $unwind: '$appforms' },
    { $match: { _id: mongoose.Types.ObjectId(id) } },
    {
      $project: DynaFormSchema,
    },
  ]).sort({ label: 1 });
  return dynaAppTables;
};

const getDynaFormsSections = async (appid, formid) => {
  try {
    const dynaApp = await DynaApp.findById(appid).exec();
    if (!dynaApp) {
      throw new ApiError(httpStatus.NOT_FOUND, 'dyna App - FormSection not found');
    }
    const dynaFormSection = dynaApp.appforms.find((form) => form._id == formid);
    if (!dynaFormSection) {
      throw new ApiError(httpStatus.NOT_FOUND, 'dynaFormSection not found');
    }
    return dynaFormSection.sections;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getDynaFormByTableId = async (params) => {
  try {
    //console.log(params.appid, '----------app');
    const dynaApp = await DynaApp.findById(params.appid).exec();
    if (!dynaApp) {
      throw new ApiError(httpStatus.NOT_FOUND, 'dyna App - Formn not found');
    }

    //console.log('app');
    const dynaFormTable = dynaApp.appforms.filter(({ formSchemaRef }) => formSchemaRef == params.tableid);
    if (!dynaFormTable) {
      throw new ApiError(httpStatus.NOT_FOUND, 'dynaFormTable not found');
    }
    return dynaFormTable;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

/**
 * Update DynaApp by id
 * @param {Object} updateBody
 */
const updateDynaFormById = async (appid, formid, updateBody) => {
  try {
    const dynaApp = await DynaApp.findById(appid).exec();
    if (!dynaApp) {
      throw new ApiError(httpStatus.NOT_FOUND, 'dynaApp not found');
    }

    let updatedDynaForm = await dynaApp.appforms.find((form) => form._id == formid);
    if (!updatedDynaForm) {
      throw new ApiError(httpStatus.NOT_FOUND, 'updatedDynaForm not found');
    }
    //console.log('--updatedDynaForm:', appid, formid, updateBody.formula);
    updatedDynaForm.name = updateBody.name;
    updatedDynaForm.label = updateBody.label;
    updatedDynaForm.homepagemenu = updateBody.homepagemenu;

    updatedDynaForm.t1 = updateBody.t1;
    updatedDynaForm.t2 = updateBody.t2;
    updatedDynaForm.t3 = updateBody.t3;
    updatedDynaForm.t4 = updateBody.t4;
    updatedDynaForm.t5 = updateBody.t5;
    updatedDynaForm.formula = updateBody.formula;
    updatedDynaForm.formsteps = updateBody.formsteps;
    updatedDynaForm.showteamdata = updateBody.showteamdata;
    updatedDynaForm.showuserdata = updateBody.showuserdata;
    updatedDynaForm = updateBody;

    const res = await dynaApp.save();
    //  console.log('--formSchemaRef:', res.appforms.filter((form) => form.formSchemaRef == updateBody.formSchemaRef))
    return updatedDynaForm;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const updateDynaSections = async (appid, formid, updateBody) => {
  try {
    const dynaApp = await DynaApp.findById(appid).exec();
    if (!dynaApp) {
      throw new ApiError(httpStatus.NOT_FOUND, 'dynaApp not found');
    }

    const updatedDynaForm = dynaApp.appforms.find((form) => form._id == formid);
    if (!updatedDynaForm) {
      throw new ApiError(httpStatus.NOT_FOUND, 'updated DynaForm not found');
    }

    updatedDynaForm.sections = updateBody;

    //Object.assign(updatedDynaForm.sections, updateBody )

    await dynaApp.save();
    const results = await dynaApp.appforms.find((form) => form._id == formid);
    //console.log('------++++-------++----+++------++-------------------', updateBody);

    return updatedDynaForm.sections;

  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};


const updateShapeById = async (reqParams, body) => {

  try {
    const { appid, formId, sectionId, columnId, shapeId } = reqParams;
    const dynaApp = await DynaApp.findById(appid);
  
    if (!dynaApp) {
      return res.status(404).json({ message: 'DynaApp not found' });
    }

    // Find the column object by ID
    const form = dynaApp.appforms.id(formId);
    const section = form.sections.id(sectionId);
    const column = section.columns.id(columnId);

    if (!column) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Column shape DynaForm not found');
    
    }

    // Find and update the shape object by ID
    const shape = column.shapes.id(shapeId);

    if (!shape) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Shape shape DynaForm not found');
    }

    // Update the desired properties of the shape object
    Object.assign(shape, body);
  

    // Save the dynaApp document with the updated shape
    await dynaApp.save();

  
  } catch (error) {
    console.error(error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }


};

const createDynaForm = async (appid, tableid, updateBody) => {
  //console.log('============================');
  try {
    const dynaApp = await DynaApp.findById(appid).exec();
    if (!dynaApp) {
      throw new ApiError(httpStatus.NOT_FOUND, 'dynaForm not found');
    }

    const updatedDynaForm = dynaApp.appforms;
    if (!updatedDynaForm) {
      throw new ApiError(httpStatus.NOT_FOUND, 'updatedDynaForm not found');
    }
    updatedDynaForm.push(updateBody);
    await dynaApp.save();
    //const dynaFormTable = dynaApp.appforms.filter(({ formSchemaRef }) => formSchemaRef == tableid);
    return dynaApp;

  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getFormsByTableId = async (appid, tableid) => {
  //console.log('============================');
  try {
    const dynaApp = await DynaApp.findById(appid).exec();
    if (!dynaApp) {
      throw new ApiError(httpStatus.NOT_FOUND, 'dynaForm not found');
    }

    const dynaFormTable = dynaApp.appforms.filter(({ formSchemaRef }) => formSchemaRef == tableid);
    if (!dynaFormTable) {
      throw new ApiError(httpStatus.NOT_FOUND, 'dynaFormTable not found');
    }

    return dynaFormTable;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const deleteDynaForm = async (appid, formid) => {
  try {
    const dynaApp = await DynaApp.findById(appid).exec();
    if (!dynaApp) {
      throw new ApiError(httpStatus.NOT_FOUND, 'dynaForm not found');
    }

    const updatedDynaForm = await dynaApp.appforms.find((form) => form._id == formid);
    const formRefId = updatedDynaForm.formSchemaRef;
    if (!updatedDynaForm) {
      throw new ApiError(httpStatus.NOT_FOUND, 'deleteDynaForm not found');
    }
    updatedDynaForm.remove();
    dynaApp.save();
    //console.log('============================', formRefId);
    const dynaFormTable = await dynaApp.appforms.filter(({ formSchemaRef }) => formSchemaRef == formRefId);
    //console.log('============================', dynaFormTable);
    return dynaFormTable;

    //   return getDynaForms(appid);
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getDynaGrids = async (appid) => {
  const aggInput = [
    { $unwind: '$appforms' },
    { $unwind: '$appforms.sections' },
    { $unwind: '$appforms.sections.columns' },
    { $unwind: '$appforms.sections.columns.shapes' },
    { $match: { _id: mongoose.Types.ObjectId(appid) } },
    { $match: { 'appforms.sections.columns.shapes.type': 50 } },
    {
      $project: {
        _id: '$appforms.sections.columns.shapes._id',
        formid: '$appforms._id',
        type: '$appforms.sections.columns.shapes.type',
        label: '$appforms.sections.columns.shapes.label',
        gridcols: '$appforms.sections.columns.shapes.gridcols',
        fontcolor: '$appforms.sections.columns.shapes.fontcolor',
        texttype: '$appforms.sections.columns.shapes.texttype',
        valuefield: '$appforms.sections.columns.shapes.valuefield',
        dataref: '$appforms.sections.columns.shapes.dataref',
        datarefid: '$appforms.sections.columns.shapes.datarefid',
      },
    },
  ];

  const dynaAppGrids = await DynaApp.aggregate(aggInput).exec();
  return dynaAppGrids;
};

module.exports = {
  getDynaForms,
  getDynaFormById,
  getDynaFormByTableId,
  updateDynaFormById,
  updateShapeById,
  createDynaForm,
  deleteDynaForm,
  getDynaFormsSections,
  getDynaGrids,
  updateDynaSections,
  getFormsByTableId,
};
