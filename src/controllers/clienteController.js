const Usuario = require('../models/usuarios');
const Cliente = require('../models/clientes');
const fs = require('fs');
const path = require('path');
const logger = require('../middleware/logger');
const { Op } = require('sequelize');


exports.getClientes = async (req, res) => {
    try {

        const clientes = await Cliente.findAll({
            where: {
                cliente_id: {
                    [Op.ne]: 1
                }
            },
            include: [
                {
                    model: Usuario,
                    as: 'usuarios',
                    attributes: ['usuario_nome', 'usuario_email', 'usuario_telefone', 'usuario_ativo'],
                },
            ],
        });

        if (clientes.length === 0) {
            return res.status(200).json({ status: 200, message: 'Nenhum cliente encontrado' });
        }

        return res.status(200).json({ status: 200, message: clientes.length + ' clientes(s) encontrado(s)', dados: clientes });
    } catch (error) {
        logger.error('Ocorreu um erro: ' + error.message);
        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
};

exports.findCliente = async (req, res) => {
    try {
        const { id } = req.params;

        const cliente = await Cliente.findByPk(id, {
            include: [
                {
                    model: Usuario,
                    as: 'usuarios',
                    attributes: ['usuario_nome', 'usuario_email', 'usuario_telefone', 'usuario_ativo'],
                },
            ],
        });

        if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        return res.status(200).json({ status: 200, message: 'Cliente encontrado', dados: cliente });
    } catch (error) {
        logger.error('Ocorreu um erro: ' + error.message);
        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
};

exports.deleteCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const cliente = await Cliente.findByPk(id);

        if (!cliente) {
            return res.status(404).json({ status: 404, message: 'Esse cliente não encontrado.' });
        }

        await cliente.destroy();
        return res.status(200).json({ status: 200, message: 'Cliente apagado com sucesso.' });
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({ status: 409, message: 'Esse cliente não pode ser apagado.' });
        }
        logger.error('Ocorreu um erro: ' + error.message);
        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
};

exports.createCliente = async (req, res) => {
    try {
        const { cliente_nome, cliente_email, cliente_telefone, cliente_ativo, cliente_cpf_cnpj, cliente_endereco, cliente_assinaturas, cliente_deputado_id, cliente_deputado_nome } = req.body;

        if (!cliente_nome || !cliente_email || !cliente_telefone || !cliente_ativo || !cliente_cpf_cnpj || !cliente_endereco || !cliente_assinaturas || !cliente_deputado_id || !cliente_deputado_nome) {
            return res.status(400).json({ status: 400, message: 'Todos os campos são obrigatórios.' });
        }

        const cliente = await Cliente.create({
            cliente_nome,
            cliente_email,
            cliente_telefone,
            cliente_ativo,
            cliente_cpf_cnpj,
            cliente_endereco,
            cliente_assinaturas,
            cliente_deputado_id,
            cliente_deputado_nome
        });

        const clienteId = cliente.cliente_id;
        const folderPath = path.join(__dirname, '..', '..', 'public', 'arquivos', String(clienteId));  // Caminho para a raiz do projeto

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        return res.status(201).json({ status: 200, message: 'Cliente criado com sucesso.', dados: cliente });

    } catch (error) {

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ status: 409, message: 'E-mail já cadastrado ou deputado já selecionado.' });
        }

        if (error.name === 'SequelizeDatabaseError') {
            return res.status(422).json({ status: 422, message: 'Um ou mais campos têm o tipo de dado incorreto.' });
        }
        logger.error('Ocorreu um erro: ' + error.message);
        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
};

exports.updateCliente = async (req, res) => {
    try {

        const { id } = req.params;

        const cliente = await Cliente.findByPk(id);
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        await cliente.update(req.body);

        return res.status(201).json({ status: 200, message: 'Cliente atualizado com sucesso.', dados: cliente });
    } catch (error) {

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ status: 409, message: 'E-mail já cadastrado.' });
        }

        if (error.name === 'SequelizeDatabaseError') {
            return res.status(422).json({ status: 422, message: 'Um ou mais campos têm o tipo de dado incorreto.' });
        }
        logger.error('Ocorreu um erro: ' + error.message);
        return res.status(500).json({ status: 500, message: error.message });
    }
};