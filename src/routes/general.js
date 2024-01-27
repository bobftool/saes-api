const express = require('express');
const router = express.Router();

const generalController = require('../controllers/generalController');

router.get('/horarios', generalController.getHorariosActual);
router.get('/horarios-proximo', generalController.getHorariosProximo);
router.get('/asignaturas', generalController.getAsignaturas);
router.get('/cupos', generalController.getCupos);

module.exports = router;