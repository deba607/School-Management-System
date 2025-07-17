const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');

// POST /api/subjects
router.post('/', subjectController.createSubject);

// GET /api/subjects
router.get('/', subjectController.getSubjects);

// GET /api/subjects (with optional query params)
router.get('/find', subjectController.findSubject);

// PUT /api/subjects/:id
router.put('/:id',subjectController.updateSubject);

module.exports = router;