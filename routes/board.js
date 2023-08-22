const router = require('express').Router();
const { param } = require('express-validator');
const validation = require('../handlers/validation');
const { verifyToken } = require('../handlers/tokenHandler');
const boardController = require('../controllers/board');
const { connectToDynamicMongoose } = require('../utils/mongooseConnection');

const { getBoardsTeamsByDbName } = boardController;
const { validate } = validation;

router.post('/', verifyToken, boardController.create);

router.get('/', verifyToken, boardController.getAll);

router.put('/', verifyToken, boardController.updatePosition);

router.get('/favourites', verifyToken, boardController.getFavourites);

router.put('/favourites', verifyToken, boardController.updateFavouritePosition);

router.get(
  '/:boardId/:dbName',
  param('boardId').custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject('invalid id');
    } else return Promise.resolve();
  }),
  async (req, res) => {
    const { boardId, dbName } = req.params;
    try {
      connection = connectToDynamicMongoose(dbName);
      await boardController.getOne(req, res, connection);
      connection.close(); // Close the dynamic connection when done
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

router.put(
  '/:boardId',
  param('boardId').custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject('invalid id');
    } else return Promise.resolve();
  }),
  validate,
  verifyToken,
  boardController.update
);

router.delete(
  '/:boardId',
  param('boardId').custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject('invalid id');
    } else return Promise.resolve();
  }),
  validate,
  verifyToken,
  boardController.delete
);

router.get('/:dbname', validate, verifyToken, getBoardsTeamsByDbName);

module.exports = router;

// router.get(
//   '/:boardId',
//   param('boardId').custom(value => {
//     if (!validation.isObjectId(value)) {
//       return Promise.reject('invalid id')
//     } else return Promise.resolve()
//   }),
//   validate,
//   verifyToken,
//   boardController.getOne
// )
