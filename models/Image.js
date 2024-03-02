const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  imgurLink: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Image', ImageSchema);
