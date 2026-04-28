const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  date: { type: String, required: true },
  score: { type: Number, required: true },
  result: { type: Object, required: true }, // The full JSON from Gemini
  rawText: { type: String }, // Optional, might be large
  imagePreview: { type: String }, // Optional base64 image representation
  highlightCoords: { type: Array }, // For persistent PDF highlights
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);
