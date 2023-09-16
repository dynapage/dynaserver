const router = require('express').Router();
const { verifyToken } = require('../handlers/tokenHandler');
const sectionController = require('../controllers/section');
const { validate } = require('../handlers/validation');
const { connectToDB } = require('../middlewares/connectToDB');

const { createSection, getAllSections, updateBoardSection, updateSection, deleteSectionAndTasks, getAllBoardsSections } =
  sectionController;

router.post('/', validate,  connectToDB, createSection);

router.get('/:dbname/all', validate,  connectToDB, getAllSections);

router.get('/:dbname/:board/all', validate, connectToDB, getAllBoardsSections);

router.put('/:sectionId', validate,  connectToDB, updateSection);

router.put('/:board/all', validate, connectToDB, updateBoardSection);

router.delete('/:sectionId', validate, connectToDB, deleteSectionAndTasks);

module.exports = router;
