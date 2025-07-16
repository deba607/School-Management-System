const Subject = require('../models/Subject');

const subjectValidator = require('../validators/subjectValidator');


// Find subject(s) by query params
exports.findSubject = async (req, res) => {
  try {
    const { name, stream, sem } = req.query;
    const query = {};
    if (name) query.name = name;
    if (stream) query.stream = stream;
    if (sem) query.sem = sem;
    const subjects = await Subject.find(query);
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update subject by ID
exports.updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, stream, sem, teacher } = req.body;
    const updated = await Subject.findByIdAndUpdate(
      id,
      { name, stream, sem, teacher },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Create a new subject
exports.createSubject = async (req, res) => {
  try {
    // Validate request body
    const parsed = subjectValidator.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({ message: 'Validation failed', errors: parsed.error.errors });
    }
    const { name, stream, sem, teacher } = parsed.data;
    const subject = new Subject({ name, stream, sem, teacher });
    await subject.save();
    res.status(201).json(subject);
    alart('Subject submitted successfully!');
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all subjects
exports.getSubjects = async (req, res) => {
  try {
    const { sem, stream } = req.query;
    let query = {};
    if (sem) query.sem = sem;
    if (stream) query.stream = stream;

    const subjects = await Subject.find(query);
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch subjects.' });
  }
};