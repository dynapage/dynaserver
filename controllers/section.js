const { sectionSchema } = require('../models/section.model');
const { taskSchema } = require('../models/task.model');
const { boardSchema } = require('../models/board.model');

exports.createSession = async (req, res) => {
  const DynamicBoard = req.dbConnection.model('Knbn_board_main', boardSchema);
  const DynamicSession = req.dbConnection.model('Knbn_section_main', sectionSchema);
  try {
    const board = await DynamicBoard.findById(req.body.board);
    if (!board) {
      return res.status(404).json('Board not found');
    }
    const sessionCount = await DynamicSession.find().count();
    const session = await DynamicSession.create({
      board: req.body.board,
      title: req.body.title,
      position: sessionCount > 0 ? sessionCount : 0,
    });
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getAllSessions = async (req, res) => {
  const DynamicSession = req.dbConnection.model('Knbn_section_main', sectionSchema);

  try {
    const sessions = await DynamicSession.find();
    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateSection = async (req, res) => {
  const { sectionId } = req.params;
  const DynamicSection = req.dbConnection.model('Knbn_section_main', sectionSchema);
  try {
    const section = await DynamicSection.findByIdAndUpdate(sectionId, { $set: req.body }, { new: req.body });
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    section._doc.tasks = [];
    res.status(200).json(section);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteSectionAndTasks = async (req, res) => {
  const DynamicSection = req.dbConnection.model('Knbn_section_main', sectionSchema);
  const DynamicTask = req.dbConnection.model('Knbn_task_main', taskSchema);
  const { sectionId } = req.params;
  try {
    await DynamicTask.deleteMany({ section: sectionId });
    await DynamicSection.deleteOne({ _id: sectionId });
    res.status(200).json('Section and its tasks deleted');
  } catch (err) {
    res.status(500).json(err);
  }
};
