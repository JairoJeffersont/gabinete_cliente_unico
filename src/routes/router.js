// routes/index.js

const express = require('express');
const router = express.Router();
const logger = require('../middleware/logger');

const usuarioRoutes = require('./usuarioRoutes');
const clientesRoutes = require('./clientesRoutes');
const orgaosTiposRoutes = require('./orgaosTiposRoutes');
const orgaosRoutes = require('./OrgaosRoutes');
const pessoasTiposRoutes = require('./pessoasTiposRoutes');
const loginRoutes = require('./loginRoutes');
router.use('/login', loginRoutes);





router.use('/usuarios', usuarioRoutes);
router.use('/clientes', clientesRoutes);
router.use('/tipos-orgaos', orgaosTiposRoutes);
router.use('/orgaos', orgaosRoutes);
router.use('/tipos-pessoas', pessoasTiposRoutes);


router.use((req, res) => {
    logger.info(`Rota não encontrada. Método: ${req.method}, URL: ${req.originalUrl}`);
    return res.status(404).json({ status: 404, message: 'Rota não encontrada' });
});

module.exports = router;

