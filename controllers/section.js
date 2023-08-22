const Section = require('../models/section.model');
const Task = require('../models/task.model');
const { connectToDynamicMongoose } = require('../utils/mongooseConnection');

const { sessionSchema } = Section;

exports.createSession = async (req, res) => {
  const dbName = req.body.dbName || req.params.dbName;
  if (!dbName) {
    return res.status(400).json({ error: 'dbName is required' });
  }
  const connection = connectToDynamicMongoose(dbName);
  const DynamicSession = connection.model('Knbn_section_main', sessionSchema);
  try {
    const sessionCount = await DynamicSession.find().count();
    const session = await DynamicSession.create({
      board: req.body.board,
      title: req.body.title,
      position: sessionCount > 0 ? sessionCount : 0,
    });
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json(err);
  } finally {
    connection.close();
  }
};

exports.getAllSessions = async (req, res) => {
  try {
    const { dbname } = req.params;
    const connection = connectToDynamicMongoose(dbname);
    const DynamicSession = connection.model('Knbn_section_main', sessionSchema);
    const sessions = await DynamicSession.find();
    res.status(200).json(sessions);
    connection.close();
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.update = async (req, res) => {
  const { sectionId } = req.params;
  try {
    const section = await Section.findByIdAndUpdate(sectionId, { $set: req.body });
    section._doc.tasks = [];
    res.status(200).json(section);
  } catch (err) {
    res.status(500).josn(err);
  }
};

exports.delete = async (req, res) => {
  const { sectionId } = req.params;
  try {
    await Task.deleteMany({ section: sectionId });
    await Section.deleteOne({ _id: sectionId });
    res.status(200).json('deleted');
  } catch (err) {
    res.status(500).josn(err);
  }
};
