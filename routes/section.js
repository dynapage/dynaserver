const router = require('express').Router();
const { verifyToken } = require('../handlers/tokenHandler');
const sectionController = require('../controllers/section');
const { validate } = require('../handlers/validation');
const { connectToDB } = require('../utils/connectToDB');

const { createSession, getAllSessions, updateSection, deleteSectionAndTasks } = sectionController;

router.post('/', validate, connectToDB, verifyToken, createSession);

router.get('/:dbname/all', validate, connectToDB, verifyToken, getAllSessions);

router.put('/:sectionId', validate, connectToDB, verifyToken, updateSection);

router.delete('/:sectionId', validate, connectToDB, verifyToken, deleteSectionAndTasks);

module.exports = router;
