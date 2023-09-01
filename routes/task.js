const router = require('express').Router({ mergeParams: true });
const { verifyToken } = require('../handlers/tokenHandler');
const { validate } = require('../handlers/validation');
const taskController = require('../controllers/task');
const { connectToDB } = require('../middlewares/connectToDB');

const { create, updatePosition, deleteTask, updateTask, getAllTasks } = taskController;

router.post('/', validate,  connectToDB, create);

router.put('/update-position', validate, connectToDB, updatePosition);

router.get('/:dbname/:sectionId', validate, connectToDB, getAllTasks);

router.delete('/:taskId', validate,  connectToDB, deleteTask);

router.put('/:taskId', validate,  connectToDB, updateTask);

module.exports = router;
