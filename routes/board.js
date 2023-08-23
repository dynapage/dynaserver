const router = require('express').Router();
const { validate } = require('../handlers/validation');
const { verifyToken } = require('../handlers/tokenHandler');
const boardController = require('../controllers/board');
const { connectToDB } = require('../utils/connectToDB');

const { getBoardsTeamsByDbName, create, getFavourites, updateFavouriteStatusForMultipleBoards, updateOne, deleteOne } =
  boardController;

router.post('/', verifyToken, connectToDB, create);

router.get('/:dbname/favourites', verifyToken, connectToDB, getFavourites);

router.put('/favourites', verifyToken, connectToDB, updateFavouriteStatusForMultipleBoards);

router.put('/:boardId', validate, verifyToken, connectToDB, updateOne);

router.delete('/:boardId', validate, verifyToken, connectToDB, deleteOne);

router.get('/:dbname', validate, verifyToken, connectToDB, getBoardsTeamsByDbName);

module.exports = router;
