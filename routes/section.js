const router = require('express').Router();
const { verifyToken } = require('../handlers/tokenHandler');
const sectionController = require('../controllers/section');
const { validate } = require('../handlers/validation');
const { connectToDB } = require('../middlewares/connectToDB');

const { createSession, getAllSessions, updateBoardSection, updateSection, deleteSectionAndTasks, getAllBoardsSessions } =
  sectionController;

router.post('/', validate,  connectToDB, createSession);

router.get('/:dbname/all', validate,  connectToDB, getAllSessions);

router.get('/:dbname/:board/all', validate, connectToDB, getAllBoardsSessions);

router.put('/:sectionId', validate,  connectToDB, updateSection);

router.put('/:board/all', validate, connectToDB, updateBoardSection);

router.delete('/:sectionId', validate, connectToDB, deleteSectionAndTasks);

module.exports = router;
