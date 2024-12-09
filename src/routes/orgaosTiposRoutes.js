// routes/orgaosTiposRoutes.js

const express = require('express');
const router = express.Router();
const orgaosTiposController = require('../controllers/orgaosTiposController');

router.get('/', orgaosTiposController.getAllOrgaosTipos);
router.post('/', orgaosTiposController.createOrgaoTipo);
router.get('/:id', orgaosTiposController.getOrgaoTipoById);
router.delete('/:id', orgaosTiposController.deleteOrgaoTipo);
router.put('/:id', orgaosTiposController.updateOrgaoTipo);


module.exports = router;
