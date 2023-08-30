const router = require('express').Router({ mergeParams: true });
const { verifyToken } = require('../handlers/tokenHandler');
const { validate } = require('../handlers/validation');
const taskController = require('../controllers/task');
const { connectToDB } = require('../middlewares/connectToDB');

const { create, updatePosition, deleteTask, updateTask, getAllTasks } = taskController;

router.post('/', validate, verifyToken, connectToDB, create);

router.put('/update-position', validate, verifyToken, connectToDB, updatePosition);

router.get('/:dbname/:sectionId', validate, verifyToken, connectToDB, getAllTasks);

router.delete('/:taskId', validate, verifyToken, connectToDB, deleteTask);

router.put('/:taskId', validate, verifyToken, connectToDB, updateTask);

module.exports = router;
