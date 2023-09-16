const { boardSchema } = require('../models/board.model');
const { sectionSchema } = require('../models/section.model');
const { taskSchema } = require('../models/task.model');

exports.create = async (req, res) => {
  const DynamicBoard = req.dbConnection.model('Knbn_board_main', boardSchema);
  try {
    const boardsCount = await DynamicBoard.find().count();
    console.log('----------- we are here ---------201-----', req.user)
    const board = await DynamicBoard.create({
      user: req.user._id,
      team: req.body.team,
      title: req.body.title,
      position: boardsCount > 0 ? boardsCount : 0,
    });
   
    res.status(201).json(board);
  } catch (err) {
    console.log('----------- err err ---------201-----', err)
    res.status(500).json(err);
  }
};

exports.getBoardsByDbName = async (req, res) => {
  console.log('----------- we are here ----------0------')
  try {
    const DynamicBoard = req.dbConnection.model('Knbn_board_main', boardSchema);

   
    const boards = await DynamicBoard.find();
    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePosition = async (req, res) => {
  const { boards } = req.body;
  const DynamicBoard = req.dbConnection.model('Knbn_board_main', boardSchema);

  try {
    boards.reverse().forEach(async (board, index) => {
      await DynamicBoard.findByIdAndUpdate(board.id, { $set: { position: index } });
    });
    res.status(200).json('updated');
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateOne = async (req, res) => {
  const DynamicBoard = req.dbConnection.model('Knbn_board_main', boardSchema);
  const { boardId } = req.params;
  const { favourite } = req.body;
  try {
    const currentBoard = await DynamicBoard.findById(boardId);
    if (!currentBoard) return res.status(404).json('Board not found');
    if (favourite !== undefined && currentBoard.favourite !== favourite) {
      const favourites = await DynamicBoard.find({
        user: currentBoard.user,
        favourite: true,
        _id: { $ne: boardId },
      }).sort('favouritePosition');
      if (favourite) {
        req.body.favouritePosition = favourites.length > 0 ? favourites.length : 0;
      } else {
        const updatePromises = favourites.map((element, index) =>
          DynamicBoard.findByIdAndUpdate(element.id, { $set: { favouritePosition: index } })
        );
        await Promise.all(updatePromises);
      }
    }
    const board = await DynamicBoard.findByIdAndUpdate(boardId, { $set: req.body }, { new: true });
    res.status(200).json(board);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getFavourites = async (req, res) => {
  const DynamicBoard = req.dbConnection.model('Knbn_board_main', boardSchema);
  try {
    const favourites = await DynamicBoard.find({
      user: req.user._id,
      favourite: true,
    }).sort('-favouritePosition');
    res.status(200).json(favourites);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateFavouriteStatusForMultipleBoards = async (req, res) => {
  const DynamicBoard = req.dbConnection.model('Knbn_board_main', boardSchema);
  const { boards, favourite } = req.body;
  try {
    const updatePromises = boards.map((boardId) =>
      DynamicBoard.findByIdAndUpdate(boardId, { $set: { favourite } }, { new: favourite })
    );
    const updatedBoards = await Promise.all(updatePromises);
    if (!updatedBoards.length) {
      return res.status(404).json({ message: 'Boards not found' });
    }
    res.status(200).json(updatedBoards);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteOne = async (req, res) => {
  const DynamicBoard = req.dbConnection.model('Knbn_board_main', boardSchema);
  const DynamicSection = req.dbConnection.model('Knbn_section_main', sectionSchema);
  const DynamicTask = req.dbConnection.model('Knbn_task_main', taskSchema);
  const { boardId } = req.params;
  try {
    const sections = await DynamicSection.find({ board: boardId });
    await Promise.all(sections.map((section) => DynamicTask.deleteMany({ section: section.id })));
    await DynamicSection.deleteMany({ board: boardId });
    const currentBoard = await DynamicBoard.findById(boardId);
    if (!currentBoard) return res.status(404).json('Board not found');

    if (currentBoard.favourite) {
      const favourites = await DynamicBoard.find({
        user: currentBoard.user,
        favourite: true,
        _id: { $ne: boardId },
      }).sort('favouritePosition');
      await Promise.all(
        favourites.map((element, index) =>
          DynamicBoard.findByIdAndUpdate(element.id, { $set: { favouritePosition: index } })
        )
      );
    }
    await DynamicBoard.deleteOne({ _id: boardId });
    const boards = await DynamicBoard.find().sort('position');
    await Promise.all(boards.map((board, index) => DynamicBoard.findByIdAndUpdate(board.id, { $set: { position: index } })));
    res.status(200).json('deleted');
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getOne = async (req, res) => {
  const DynamicBoard = req.dbConnection.model('Knbn_board_main', boardSchema);
  const DynamicSection = req.dbConnection.model('Knbn_section_main', sectionSchema);
  const DynamicTask = req.dbConnection.model('Knbn_task_main', taskSchema);
  const { boardId } = req.params;
  try {
    const board = await DynamicBoard.findOne({ _id: boardId });
    if (!board) return res.status(404).json('Board not found');
    const sections = await DynamicSection.find({ board: boardId });
    const tasksPromises = sections.map(async (section) => {
      const tasks = await DynamicTask.find({ section: section.id }).populate('section').sort('-position');
      return {
        ...section._doc,
        tasks,
      };
    });
    const updatedSections = await Promise.all(tasksPromises);
    board._doc.sections = updatedSections;
    res.status(200).json(board);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getBoardByTeamId = async (req, res) => {
  try {
    const DynamicBoard = req.dbConnection.model('Knbn_board_main', boardSchema);
    const boards = await DynamicBoard.find({ team: req.params.teamId });
    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
