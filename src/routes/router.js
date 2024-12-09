// routes/index.js

const express = require('express');
const router = express.Router();
const logger = require('../middleware/logger');

const usuarioRoutes = require('./usuarioRoutes');
const clientesRoutes = require('./clientesRoutes');
const orgaosTiposRoutes = require('./orgaosTiposRoutes');
const pessoasTiposRoutes = require('./pessoasTiposRoutes');


router.use('/usuarios', usuarioRoutes);
router.use('/clientes', clientesRoutes);
router.use('/tipos-orgaos', orgaosTiposRoutes);
router.use('/tipos-pessoas', pessoasTiposRoutes);


router.use((req, res) => {
    logger.info(`Rota não encontrada. Método: ${req.method}, URL: ${req.originalUrl}`);
    res.status(404).json({ error: 'Rota não encontrada' });
});

module.exports = router;

