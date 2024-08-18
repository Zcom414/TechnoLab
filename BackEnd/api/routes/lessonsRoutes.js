const express = require('express');
const router = express.Router();
const { getAllLessons, getOneLesson, createOneLesson, updateOneLesson, deleteOneLesson } = require('../controllers/lessonsControllers');


// Routes for lessons
router.get('/', getAllLessons);
router.get('/:id', getOneLesson);
router.post('/', createOneLesson);
router.put('/:id', updateOneLesson);
router.delete('/:id', deleteOneLesson);


module.exports = router;