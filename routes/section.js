const router = require('express').Router({ mergeParams: true });
const { param } = require('express-validator');
const { verifyToken } = require('../handlers/tokenHandler');
const sectionController = require('../controllers/section');
const validation = require('../handlers/validation');

const { createSession, getAllSessions } = sectionController;
const { validate } = validation;

router.post('/', validate, verifyToken, createSession);

router.get('/:dbname/all', validate, verifyToken, getAllSessions);

router.put(
  '/:sectionId',
  param('boardId').custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject('invalid board id');
    } else return Promise.resolve();
  }),
  param('sectionId').custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject('invalid section id');
    } else return Promise.resolve();
  }),
  validate,
  verifyToken,
  sectionController.update
);

router.delete(
  '/:sectionId',
  param('boardId').custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject('invalid board id');
    } else return Promise.resolve();
  }),
  param('sectionId').custom((value) => {
    if (!validation.isObjectId(value)) {
      return Promise.reject('invalid section id');
    } else return Promise.resolve();
  }),
  validate,
  verifyToken,
  sectionController.delete
);

module.exports = router;
