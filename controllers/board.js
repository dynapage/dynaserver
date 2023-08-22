const Board = require('../models/board.model');
const Section = require('../models/section.model');
const Task = require('../models/task.model');
const { connectToDynamicMongoose } = require('../utils/mongooseConnection');

const { boardSchema } = Board;

exports.create = async (req, res) => {
  const dbName = req.body.dbName || req.params.dbName;
  if (!dbName) {
    return res.status(400).json({ error: 'dbName is required' });
  }
  const connection = connectToDynamicMongoose(dbName);
  const DynamicBoard = connection.model('Knbn_board_main', boardSchema);
  try {
    const boardsCount = await DynamicBoard.find().count();
    const board = await DynamicBoard.create({
      user: req.user._id,
      team: req.body.team,
      title: req.body.title,
      position: boardsCount > 0 ? boardsCount : 0,
    });
    res.status(201).json(board);
  } catch (err) {
    res.status(500).json(err);
  } finally {
    connection.close();
  }
};

exports.getBoardsTeamsByDbName = async (req, res) => {
  try {
    const { dbname } = req.params;
    const connection = connectToDynamicMongoose(dbname);
    const DynamicBoard = connection.model('Knbn_board_main', boardSchema);
    const boards = await DynamicBoard.find();
    connection.close();
    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const boards = await Board.find({ user: req.user._id }).sort('-position');
    res.status(200).json(boards);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updatePosition = async (req, res) => {
  const { boards } = req.body;
  try {
    for (const key in boards.reverse()) {
      const board = boards[key];
      await Board.findByIdAndUpdate(board.id, { $set: { position: key } });
    }
    res.status(200).json('updated');
  } catch (err) {
    res.status(500).json(err);
  }
};

// exports.getOne = async (req, res) => {
//   const { boardId } = req.params
//   try {
//     //const board = await Board.findOne({ user: req.user._id, _id: boardId })
//     const boards = await Board.find()
//     console.log('    f i r s tboardId  h e r e   ', boards)
//     const board = await Board.findOne({ _id: boardId })
//     console.log('    f i r s t h e r e   ', board)

//     if (!board) return res.status(404).json('Board not found')
//     const sections = await Section.find({ board: boardId })
//     for (const section of sections) {
//       const tasks = await Task.find({ section: section.id }).populate('section').sort('-position')
//       section._doc.tasks = tasks
//     }
//     board._doc.sections = sections
//     res.status(200).json(board)
//   } catch (err) {
//     res.status(500).json(err)
//   }
// }

exports.getOne = async (req, res, connection) => {
  const { boardId } = req.params;
  //try {
  const Board = connection.model('Knbn_board_main'); // Assuming 'Board' is your Mongoose model
  const Section = connection.model('Knbn_section_main'); // Assuming 'Section' is your Mongoose model
  const Task = connection.model('Knbn_task_main'); // Assuming 'Task' is your Mongoose model
  //const board = await Board.findOne({ user: req.user._id, _id: boardId });

  const board = await Board.findOne({ _id: boardId });
  if (!board) return res.status(404).json('Board not found');

  const sections = await Section.find({ board: boardId });
  for (const section of sections) {
    const tasks = await Task.find({ section: section.id }).populate('section').sort('-position');
    section._doc.tasks = tasks;
  }

  board._doc.sections = sections;
  res.status(200).json(board);
  // } catch (err) {
  // res.status(500).json(err);
  //}
};

exports.update = async (req, res) => {
  const { boardId } = req.params;
  const { title, description, favourite } = req.body;

  try {
    if (title === '') req.body.title = 'Untitled';
    if (description === '') req.body.description = 'Add description here';
    const currentBoard = await Board.findById(boardId);
    if (!currentBoard) return res.status(404).json('Board not found');

    if (favourite !== undefined && currentBoard.favourite !== favourite) {
      const favourites = await Board.find({
        user: currentBoard.user,
        favourite: true,
        _id: { $ne: boardId },
      }).sort('favouritePosition');
      if (favourite) {
        req.body.favouritePosition = favourites.length > 0 ? favourites.length : 0;
      } else {
        for (const key in favourites) {
          const element = favourites[key];
          await Board.findByIdAndUpdate(element.id, { $set: { favouritePosition: key } });
        }
      }
    }

    const board = await Board.findByIdAndUpdate(boardId, { $set: req.body });
    res.status(200).json(board);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getFavourites = async (req, res) => {
  try {
    const favourites = await Board.find({
      user: req.user._id,
      favourite: true,
    }).sort('-favouritePosition');
    res.status(200).json(favourites);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateFavouritePosition = async (req, res) => {
  const { boards } = req.body;
  try {
    for (const key in boards.reverse()) {
      const board = boards[key];
      await Board.findByIdAndUpdate(board.id, { $set: { favouritePosition: key } });
    }
    res.status(200).json('updated');
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.delete = async (req, res) => {
  const { boardId } = req.params;
  try {
    const sections = await Section.find({ board: boardId });
    for (const section of sections) {
      await Task.deleteMany({ section: section.id });
    }
    await Section.deleteMany({ board: boardId });

    const currentBoard = await Board.findById(boardId);

    if (currentBoard.favourite) {
      const favourites = await Board.find({
        user: currentBoard.user,
        favourite: true,
        _id: { $ne: boardId },
      }).sort('favouritePosition');

      for (const key in favourites) {
        const element = favourites[key];
        await Board.findByIdAndUpdate(element.id, { $set: { favouritePosition: key } });
      }
    }

    await Board.deleteOne({ _id: boardId });

    const boards = await Board.find().sort('position');
    for (const key in boards) {
      const board = boards[key];
      await Board.findByIdAndUpdate(board.id, { $set: { position: key } });
    }

    res.status(200).json('deleted');
  } catch (err) {
    res.status(500).json(err);
  }
};
