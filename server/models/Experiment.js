const mongoose = require('mongoose');

const experimentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    algorithm: { type: String, required: true },
    dataset: { type: String },
    parameters: { type: Object },
    results: { type: Object },
    insights: { type: String },
    status: { type: String, enum: ['running', 'completed', 'failed'], default: 'running' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Experiment', experimentSchema);
