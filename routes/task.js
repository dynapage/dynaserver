const mongoose = require('mongoose');
const router = require('express').Router({ mergeParams: true })
const { param, body } = require('express-validator')
const tokenHandler = require('../handlers/tokenHandler')
const validation = require('../handlers/validation')
const taskController = require('../controllers/task')

const config = require('../config/config');


const url = config.mongoClient; 

function connectToDynamicMongoose(databaseName) {
  const dynamicConnection = mongoose.createConnection(`${url}${databaseName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  dynamicConnection.on('error', console.error.bind(console, `Dynamic database connection error (${databaseName}):`));
  dynamicConnection.once('open', () => {
    console.log(`Dynamic mongoose database connection (${databaseName}) established!`);
  });

  return dynamicConnection;
}



router.post(
  '/',
  param('boardId').custom(value => {
    if (!validation.isObjectId(value)) {
      return Promise.reject('invalid board id')
    } else return Promise.resolve()
  }),
  body('sectionId').custom(value => {
    if (!validation.isObjectId(value)) {
      return Promise.reject('invalid section id')
    } else return Promise.resolve()
  }),
  validation.validate,
  tokenHandler.verifyToken,
  taskController.create
)

router.put(
  '/update-position',
  param('boardId').custom(value => {
    if (!validation.isObjectId(value)) {
      return Promise.reject('invalid board id')
    } else return Promise.resolve()
  }),

 // taskController.updatePosition

  async (req, res) => {
    const { boardId, dbName } = req.params;
    try {
      console.log('    f i r 1   ', dbName)
      connection = connectToDynamicMongoose(dbName)
 console.log('    f i r 1   ', dbName)
      await taskController.updatePosition(req, res, connection);

      connection.close(); // Close the dynamic connection when done
    } catch (err) {
      res.status(500).json(err);
    }
  }

)




router.get(
  '/:boardId/:dbName',
  param('boardId').custom(value => {
    if (!validation.isObjectId(value)) {
      return Promise.reject('invalid id');
    } else return Promise.resolve();
  }),
 
  async (req, res) => {
    const { boardId, dbName } = req.params;
    try {
     
      connection = connectToDynamicMongoose(dbName)
      console.log('    f i r 1   ')
      await boardController.getOne(req, res, connection);

      connection.close(); // Close the dynamic connection when done
    } catch (err) {
      res.status(500).json(err);
    }
  }
);










router.delete(
  '/:taskId',
  param('boardId').custom(value => {
    if (!validation.isObjectId(value)) {
      return Promise.reject('invalid board id')
    } else return Promise.resolve()
  }),
  param('taskId').custom(value => {
    if (!validation.isObjectId(value)) {
      return Promise.reject('invalid task id')
    } else return Promise.resolve()
  }),
  validation.validate,
  tokenHandler.verifyToken,
  taskController.delete
)

router.put(
  '/:taskId',
  param('boardId').custom(value => {
    if (!validation.isObjectId(value)) {
      return Promise.reject('invalid board id')
    } else return Promise.resolve()
  }),
  param('taskId').custom(value => {
    if (!validation.isObjectId(value)) {
      return Promise.reject('invalid task id')
    } else return Promise.resolve()
  }),
  validation.validate,
  tokenHandler.verifyToken,
  taskController.update
)

module.exports = router