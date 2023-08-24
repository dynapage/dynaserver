const router = require('express').Router();
const { verifyToken } = require('../handlers/tokenHandler');
const sectionController = require('../controllers/section');
const { validate } = require('../handlers/validation');
const { connectToDB } = require('../utils/connectToDB');

const { createSession, getAllSessions, updateBoardSection, updateSection, deleteSectionAndTasks, getAllBoardsSessions } =
  sectionController;

router.post('/', validate, connectToDB, verifyToken, createSession);

router.get('/:dbname/all', validate, connectToDB, verifyToken, getAllSessions);

router.get('/:dbname/:board/all', validate, connectToDB, verifyToken, getAllBoardsSessions);

router.put('/:sectionId', validate, connectToDB, verifyToken, updateSection);

router.put('/:board/all', validate, connectToDB, verifyToken, updateBoardSection);

router.delete('/:sectionId', validate, connectToDB, verifyToken, deleteSectionAndTasks);

module.exports = router;
