// routes/index.js

const express = require('express');
const router = express.Router();

const usuarioRoutes = require('./usuarioRoutes');
const clientesRoutes = require('./clientesRoutes');

router.use('/usuarios', usuarioRoutes);
router.use('/clientes', clientesRoutes);

router.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

module.exports = router;

