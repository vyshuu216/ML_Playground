const Experiment = require('../models/Experiment');

exports.saveExperiment = async (req, res) => {
  try {
    const { name, algorithm, parameters, results, insights } = req.body;
    const experiment = new Experiment({
      name: name || `${algorithm} - ${new Date().toLocaleString()}`,
      algorithm,
      parameters,
      results,
      insights,
      status: 'completed',
    });
    await experiment.save();
    res.json({ success: true, experiment });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save experiment' });
  }
};

exports.getExperiments = async (req, res) => {
  try {
    const experiments = await Experiment.find({ status: 'completed' })
      .select('-results.data -results.predicted -results.points')
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(experiments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getExperiment = async (req, res) => {
  try {
    const exp = await Experiment.findById(req.params.id);
    if (!exp) return res.status(404).json({ error: 'Not found' });
    res.json(exp);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteExperiment = async (req, res) => {
  try {
    await Experiment.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
