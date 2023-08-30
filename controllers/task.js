const { taskSchema } = require('../models/task.model');
const { sectionSchema } = require('../models/section.model');

exports.getAllTasks = async (req, res) => {
  const { sectionId } = req.params;
  try {
    const DynamicTask = req.dbConnection.model('Knbn_task_main');
    const tasks = await DynamicTask.find({ section: sectionId }).sort('position');
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.create = async (req, res) => {
  const { sectionId, content, title, assignee } = req.body;
  try {
    const DynamicSection = req.dbConnection.model('Knbn_section_main', sectionSchema);
    const section = await DynamicSection.findById(sectionId);
    const DynamicTask = req.dbConnection.model('Knbn_task_main', taskSchema);
    const tasksCount = await DynamicTask.find({ section: sectionId }).count();
    const task = await DynamicTask.create({
      section: sectionId,
      title,
      content,
      position: tasksCount > 0 ? tasksCount : 0,
      assignee,
    });
    task._doc.section = section;
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, content, assignee } = req.body;
  try {
    const DynamicTask = req.dbConnection.model('Knbn_task_main');
    const task = await DynamicTask.findByIdAndUpdate(taskId, { $set: { title, content, assignee } }, { new: true });
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    const DynamicTask = req.dbConnection.model('Knbn_task_main');
    const currentTask = await DynamicTask.findById(taskId);
    await DynamicTask.deleteOne({ _id: taskId });
    const tasks = await DynamicTask.find({ section: currentTask.section }).sort('position');
    const updateTasksPromises = tasks.map((task, index) => {
      return DynamicTask.findByIdAndUpdate(task.id, { $set: { position: index } });
    });
    await Promise.all(updateTasksPromises);
    res.status(200).json('deleted');
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updatePosition = async (req, res) => {
  const { resourceList, destinationList, resourceSectionId, destinationSectionId } = req.body;
  const resourceListReverse = resourceList;
  const destinationListReverse = destinationList;
  try {
    const DynamicTask = req.dbConnection.model('Knbn_task_main');
    const updateResourcePromises = resourceListReverse.map((resource, index) => {
      return DynamicTask.findByIdAndUpdate(resource.id, {
        $set: {
          section: resourceSectionId,
          position: index,
        },
      });
    });
    const updateDestinationPromises = destinationListReverse.map((destination, index) => {
      return DynamicTask.findByIdAndUpdate(destination.id, {
        $set: {
          section: destinationSectionId,
          position: index,
        },
      });
    });
    await Promise.all([...updateResourcePromises, ...updateDestinationPromises]);
    res.status(200).json('updated');
  } catch (err) {
    res.status(500).json(err);
  }
};
