const mongoose = require('mongoose');

const designerSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  username: {
    type: String,
  },
  accessType: {
    type: Number,
    default: 1,
  },
});

/**
 * @typedef DynaDesigner
 */
const DynaDesigner = mongoose.model('applications.designer', designerSchema);

module.exports = DynaDesigner;
