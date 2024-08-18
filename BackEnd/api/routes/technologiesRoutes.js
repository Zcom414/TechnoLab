const express = require('express');
const router = express.Router();
const { getAllTechnologies, getOneTechnology, createOneTechnology, updateOneTechnology, deleteOneTechnology } = require('../controllers/technologiesControllers');


// Routes for technologies
router.get('/', getAllTechnologies);
router.get('/:id', getOneTechnology);
router.post('/', createOneTechnology);
router.put('/:id', updateOneTechnology);
router.delete('/:id', deleteOneTechnology);


module.exports = router;