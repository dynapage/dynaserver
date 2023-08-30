const router = require('express').Router();
const { verifyToken } = require('../handlers/tokenHandler');
const sectionController = require('../controllers/section');
const { validate } = require('../handlers/validation');
const { connectToDB } = require('../middlewares/connectToDB');

const { createSession, getAllSessions, updateBoardSection, updateSection, deleteSectionAndTasks, getAllBoardsSessions } =
  sectionController;

router.post('/', validate, verifyToken, connectToDB, createSession);

router.get('/:dbname/all', validate, verifyToken, connectToDB, getAllSessions);

router.get('/:dbname/:board/all', validate, verifyToken, connectToDB, getAllBoardsSessions);

router.put('/:sectionId', validate, verifyToken, connectToDB, updateSection);

router.put('/:board/all', validate, verifyToken, connectToDB, updateBoardSection);

router.delete('/:sectionId', validate, verifyToken, connectToDB, deleteSectionAndTasks);

module.exports = router;
