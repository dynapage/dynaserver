const express = require('express');

const router = express.Router();
const dynaAppController = require('../controllers/dynaapp.controller');
const dynaFormController = require('../controllers/dynaform.controller');
const dynaTableController = require('../controllers/dynatable.controller');
const dynaColumnController = require('../controllers/dynacolumn.controller');
const dynaCollectionController = require('../controllers/dynacollection.controller');

// router.post('/register', validate(authValidation.register), authController.register);
router.route('/applications/:id').get(dynaAppController.getAppByID);
router.route('/applicationteams/:id').get(dynaAppController.getAppTeams);
router.route('/applicationteams/:id').put(dynaAppController.updateAppTeams);
router.route('/applications_by_user/:designerid').get(dynaAppController.getAppByUserEmail);
router.route('/applications_signin/:siteid/:userid/:pwd').get(dynaAppController.getDynaAppBySignIn);

////siteid, userid, pwd
router.route('/applications_by_count/:id').get(dynaAppController.getAppByCount);
router.route('/application_save_changes/:id').put(dynaAppController.updateDynaApp);
router.route('/application/:id/:dbname/:userid').delete(dynaAppController.deleteDynaApp);
router.route('/applications/:designerid').post(dynaAppController.createDynaApp);
router.route('/create_application_template/:userid').post(dynaAppController.createDynaTemplate);

router.route('/appuser/:id/:teamid').post(dynaAppController.createDynaUser);
router.route('/appuser/:id/:teamid/:userid').put(dynaAppController.updateDynaUser);
router.route('/appuser/:id/:teamid/:userid').delete(dynaAppController.deleteDynaUser);

//createDynaTemplate
router.route('/appforms/:id').get(dynaFormController.getForms);
router.route('/appform/:appid/:formid').get(dynaFormController.getFormByID);
router.route('/appforms_by_table/:id/:tableid').get(dynaFormController.getFormByTableID);
router.route('/appforms/:appid/:formid').put(dynaFormController.updateDynaForm);
router.route('/appforms/:appid/:tableid').post(dynaFormController.createDynaForm);
router.route('/appforms/:appid/:formid').delete(dynaFormController.deleteDynaForm);
router.route('/appformsbytableid/:appid/:tableid').get(dynaFormController.getFormByTableID);

router.route('/updatesections/:id/:formid').put(dynaFormController.updateDynaSection);

router.route('/updateshape/:appid/:formId/:sectionId/:columnId/:shapeId').put(dynaFormController.updateDynaShape);

router.route('/grids/:appid').get(dynaFormController.getGrids);
router.route('/getsections/:appid/:formid').get(dynaFormController.getFormSections);

//router.route('/columnsbyform/:appid/:formid').get(dynaColumnController.getColumns);
router.route('/columns/:appid/:id').get(dynaColumnController.getColumns);
router.route('/column/:appid/:tableid/:columnid').put(dynaColumnController.updateColumn);
router.route('/tabledetailsbycolumn/:appid/:id').get(dynaColumnController.getTableByColumn);

router.route('/column/:id/:tableid/:appName/:tabeName').post(dynaColumnController.createColumn);
router.route('/column/:appid/:tableid/:id').delete(dynaColumnController.deleteColumn);

router.route('/checkcolumn/:appid/:columnname').get(dynaColumnController.checkColumnName);

router.route('/apptables/:id').get(dynaTableController.getTables);
router.route('/apptable/:appid/:tableid').get(dynaTableController.getTableById);
router.route('/apptables/:appid/:tableid').put(dynaTableController.updateDynaTable);
router.route('/apptables/:appid/:dbname').post(dynaTableController.createDynaTable);
router.route('/apptables/:appid/:columnid/:dbname/:tablename').delete(dynaTableController.deleteDynaTable);

router.route('/updateDynaTabeData/:dbname/:tablename/:id').put(dynaCollectionController.updateCollection);
router.route('/newDynaTableData/:dbname/:tablename').post(dynaCollectionController.insertCollectionRecord);
router.route('/deleteDynaTabeRecord/:dbname/:tablename/:id').delete(dynaCollectionController.deleteCollectionRecord);
router
  .route('/dynaTabeData/:dbname/:tablename/:userid/:teamid/:fetchteam/:fetchuser')
  .post(dynaCollectionController.getRecordsWithParams);
router
  .route('/dynaTabeData/:dbname/:tablename/:userid/:teamid/:fetchteam/:fetchuser')
  .get(dynaCollectionController.getRecords);
router.route('/dynaFindTabeData/:dbname/:tablename/:id').get(dynaCollectionController.getRecord);
router
  .route('/dynaFindTabeDataByColName/:dbname/:tablename/:id/:columnname/:userid/:teamid/:fetchteam/:fetchuser')
  .get(dynaCollectionController.getRecordByColumnName);

router.get('/', (req, res) => {
  res.status(200).json({ test: 1 });
});
// router.route('/getteams/:appid').get(dynaTableController.getTableById);
// router.route('/updateteam/:appid/:teamid').put(dynaTableController.updateDynaTable);

// router.route('/teamuser/:appid/:teamid/:userid').get(dynaTableController.deleteDynaTable);
// router.route('/teamuser/:appid/:teamid/:userid').put(dynaTableController.deleteDynaTable);
// router.route('/teamuser/:appid/:teamid/:userid').post(dynaTableController.deleteDynaTable);
// router.route('/teamuser/:appid/:teamid/:userid').delete(dynaTableController.deleteDynaTable);

// router.route('/teamtable/:appid/:teamid/:tableid').put(dynaTableController.deleteDynaTable);

module.exports = router;
