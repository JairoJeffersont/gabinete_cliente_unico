
const express = require('express');
const clienteController = require('../controllers/clienteController');


const router = express.Router();

router.get('/', clienteController.getClientes);
router.get('/:id', clienteController.findCliente);
router.delete('/:id', clienteController.deleteCliente);
router.post('/', clienteController.createCliente);
router.put('/:id', clienteController.updateCliente);


module.exports = router;