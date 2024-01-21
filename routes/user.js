const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/info', userController.getInfo);
router.get('/kardex', userController.getKardex);
router.get('/horario', userController.getHorario);
router.get('/calificaciones', userController.getCalificaciones)

module.exports = router;