const mongoose = require('mongoose');
const router = require('express').Router()
const { param } = require('express-validator')
const validation = require('../handlers/validation')
const tokenHandler = require('../handlers/tokenHandler')
const boardController = require('../controllers/board')
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
  tokenHandler.verifyToken,
  boardController.create
)

router.get(
  '/',
  tokenHandler.verifyToken,
  boardController.getAll
)

router.put(
  '/',
  tokenHandler.verifyToken,
  boardController.updatePosition
)

router.get(
  '/favourites',
  tokenHandler.verifyToken,
  boardController.getFavourites
)

router.put(
  '/favourites',
  tokenHandler.verifyToken,
  boardController.updateFavouritePosition
)

// router.get(
//   '/:boardId',
//   param('boardId').custom(value => {
//     if (!validation.isObjectId(value)) {
//       return Promise.reject('invalid id')
//     } else return Promise.resolve()
//   }),
//   validation.validate,
//   tokenHandler.verifyToken,
//   boardController.getOne
// )


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
      await boardController.getOne(req, res, connection);
      connection.close(); // Close the dynamic connection when done
    } catch (err) {
      res.status(500).json(err);
    }
  }
);



router.put(
  '/:boardId',
  param('boardId').custom(value => {
    if (!validation.isObjectId(value)) {
      return Promise.reject('invalid id')
    } else return Promise.resolve()
  }),
  validation.validate,
  tokenHandler.verifyToken,
  boardController.update
)

router.delete(
  '/:boardId',
  param('boardId').custom(value => {
    if (!validation.isObjectId(value)) {
      return Promise.reject('invalid id')
    } else return Promise.resolve()
  }),
  validation.validate,
  tokenHandler.verifyToken,
  boardController.delete
)


module.exports = router