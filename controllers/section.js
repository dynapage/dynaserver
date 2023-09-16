const { sectionSchema } = require('../models/section.model');
const { taskSchema } = require('../models/task.model');
const { boardSchema } = require('../models/board.model');

exports.createSection = async (req, res) => {
  const DynamicBoard = req.dbConnection.model('Knbn_board_main', boardSchema);
  const DynamicSection = req.dbConnection.model('Knbn_section_main', sectionSchema);
  try {
    const board = await DynamicBoard.findById(req.body.board);
    if (!board) {
      return res.status(404).json('Board not found');
    }
    const sectionCount = await DynamicSection.find().count();
    const section = await DynamicSection.create({
      board: req.body.board,
      title: req.body.title,
      position: sectionCount > 0 ? sectionCount : 0,
    });
    res.status(201).json(section);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getAllSections = async (req, res) => {
  const DynamicSection = req.dbConnection.model('Knbn_section_main', sectionSchema);

  try {
    const sections = await DynamicSection.find();
    res.status(200).json(sections);
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

exports.getAllBoardsSections = async (req, res) => {
  const DynamicBoard = req.dbConnection.model('Knbn_board_main', boardSchema);
  const DynamicSection = req.dbConnection.model('Knbn_section_main', sectionSchema);
  try {
    const board = await DynamicBoard.findOne({ _id: req.params.board });
    if (!board) {
      return res.status(404).json('Board not found');
    }
    const sections = await DynamicSection.find({ board: board._id });
    res.status(200).json(sections);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateBoardSection = async (req, res) => {
  const { board } = req.params;
  const { columns } = req.body;
  const DynamicBoard = req.dbConnection.model('Knbn_board_main', boardSchema);
  const DynamicSection = req.dbConnection.model('Knbn_section_main', sectionSchema);
  try {
    const boardInstance = await DynamicBoard.findById(board);
    if (!boardInstance) {
      return res.status(404).json({ message: 'Board not found' });
    }
    let sections = await DynamicSection.find({ board: boardInstance._id });
    if (!sections.length && columns.length === 0) {
      return res.status(404).json({ message: 'No sections found for the given board and no new sections provided' });
    }
    for (let i = 0; i < Math.min(sections.length, columns.length); i += 1) {
      sections[i].title = columns[i];
      // eslint-disable-next-line no-await-in-loop
      await sections[i].save();
    }
    if (columns.length < sections.length) {
      for (let i = columns.length; i < sections.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await sections[i].remove();
      }
    } else {
      for (let i = sections.length; i < columns.length; i += 1) {
        const newSection = new DynamicSection({
          title: columns[i],
          board: boardInstance._id,
          position: i,
        });
        // eslint-disable-next-line no-await-in-loop
        await newSection.save();
      }
    }
    sections = await DynamicSection.find({ board: boardInstance._id });
    res.status(200).json(sections);
  } catch (err) {
    res.status(500).json(err);
  }
};
