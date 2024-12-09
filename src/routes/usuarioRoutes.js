
const express = require('express');
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, usuarioController.getUsuarios);
router.get('/:id', authMiddleware, usuarioController.findUsuario);
router.post('/', authMiddleware, usuarioController.createUsuario);
router.put('/:id', authMiddleware, usuarioController.updateUsuario);
router.delete('/:id', authMiddleware, usuarioController.deleteUsuario);

module.exports = router;