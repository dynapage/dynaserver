const router = require('express').Router({ mergeParams: true });
const { verifyToken } = require('../handlers/tokenHandler');
const { validate } = require('../handlers/validation');
const taskController = require('../controllers/task');
const { connectToDB } = require('../middlewares/connectToDB');

const { create, updatePosition, deleteTask, updateTask, getAllTasks } = taskController;

router.post('/', validate, connectToDB, verifyToken, create);

router.put('/update-position', validate, connectToDB, verifyToken, updatePosition);

router.get('/:sectionId/:dbName', validate, connectToDB, verifyToken, getAllTasks);

router.delete('/:taskId', validate, connectToDB, verifyToken, deleteTask);

router.put('/:taskId', validate, connectToDB, verifyToken, updateTask);

module.exports = router;
