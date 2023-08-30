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

router.get('/:dbname/favourites', validate, verifyToken, connectToDB, getFavourites);

router.put('/favourites', validate, verifyToken, connectToDB, updateFavouriteStatusForMultipleBoards);

router.put('/:boardId', validate, verifyToken, connectToDB, updateOne);

router.delete('/:boardId', validate, verifyToken, connectToDB, deleteOne);

router.get('/:dbname', validate, verifyToken, connectToDB, getBoardsByDbName);

router.get('/:dbname/:teamId/team', validate, verifyToken, connectToDB, getBoardByTeamId);

module.exports = router;
