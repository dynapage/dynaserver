const router = require('express').Router();
const { validate } = require('../handlers/validation');
const { verifyToken } = require('../handlers/tokenHandler');
const boardController = require('../controllers/board');
const { connectToDB } = require('../middlewares/connectToDB');

const {
  getBoardsByDbName,
  create,
  getFavourites,
  updateFavouriteStatusForMultipleBoards,
  updateOne,
  deleteOne,
  getBoardByTeamId,
} = boardController;

router.post('/', validate, verifyToken, connectToDB, create);
//router.post('/', validate, connectToDB, create);

router.get('/:dbname/favourites', validate, connectToDB, getFavourites);

router.put('/favourites', validate,  connectToDB, updateFavouriteStatusForMultipleBoards);

router.put('/:boardId', validate, connectToDB, updateOne);

router.delete('/:boardId', validate,  connectToDB, deleteOne);

router.get('/:dbname', validate,  connectToDB, getBoardsByDbName);

router.get('/:dbname/:teamId/team', validate, connectToDB, getBoardByTeamId);

module.exports = router;
