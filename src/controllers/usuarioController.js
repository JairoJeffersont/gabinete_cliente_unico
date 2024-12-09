const Usuario = require('../models/usuarios');
const Cliente = require('../models/clientes');
const argon2 = require('argon2');
const logger = require('../middleware/logger');


exports.getUsuarios = async (req, res) => {
    try {

        const cliente_id = req.query.cliente_id

        if (!cliente_id) {
            return res.status(400).json({ status: 400, message: 'O ID do cliente não foi enviado' });
        }

        const usuarios = await Usuario.findAll({
            attributes: {
                exclude: ['usuario_senha'],
            },
            where: {
                usuario_cliente: cliente_id
            },
        });

        if (usuarios.length === 0) {
            return res.status(200).json({ status: 200, message: 'Nenhum usuário encontrado' });
        }

        const usuariosSemSenha = usuarios.map(usuario => {
            const { usuario_senha, ...usuarioSemSenha } = usuario.toJSON();
            return usuarioSemSenha;
        });

        return res.status(200).json({ status: 200, message: `${usuarios.length} usuário(s) encontrado(s)`, dados: usuariosSemSenha });
    } catch (error) {
        logger.error('Ocorreu um erro: ' + error.message);
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.findUsuario = async (req, res) => {
    try {

        const cliente_id = req.query.cliente_id

        if (!cliente_id) {
            return res.status(400).json({ status: 400, message: 'O ID do cliente não foi enviado' });
        }

        const { id } = req.params;

        const usuario = await Usuario.findOne({
            attributes: {
                exclude: ['usuario_senha'],
            },
            where: {
                usuario_id: id,
                usuario_cliente: cliente_id
            },
        });


        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const { usuario_senha, ...usuarioSemSenha } = usuario.toJSON();

        return res.status(200).json({ status: 200, message: 'Usuário encontrado', dados: usuarioSemSenha });
    } catch (error) {
        logger.error('Ocorreu um erro: ' + error.message);
        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
};

exports.deleteUsuario = async (req, res) => {
    try {

        const cliente_id = req.query.cliente_id

        if (!cliente_id) {
            return res.status(400).json({ status: 400, message: 'O ID do cliente não foi enviado' });
        }

        const { id } = req.params;
        const usuario = await Usuario.findOne({
            attributes: {
                exclude: ['usuario_senha'],
            },
            where: {
                usuario_id: id,
                usuario_cliente: cliente_id
            },
        });
        if (!usuario) {
            return res.status(404).json({ status: 404, message: 'Esse usuário não encontrado.' });
        }

        await usuario.destroy();
        return res.status(200).json({ status: 200, message: 'Usuário apagado com sucesso.' });
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({ status: 409, message: 'Esse usuário não pode ser apagado.' });
        }
        logger.error('Ocorreu um erro: ' + error.message);
        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
};

exports.createUsuario = async (req, res) => {
    try {

        const { usuario_nome, usuario_email, usuario_telefone, usuario_senha, usuario_ativo, usuario_aniversario, usuario_cliente } = req.body;


        if (!usuario_nome || !usuario_email || !usuario_telefone || !usuario_senha || usuario_ativo === undefined || !usuario_aniversario || !usuario_cliente) {
            return res.status(400).json({ status: 400, message: 'Todos os campos são obrigatórios.' });
        }

        const cliente = await Cliente.findByPk(usuario_cliente);

        if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado.' });
        }

        const clienteAssinaturas = cliente.cliente_assinaturas;

        const quantidadeUsuarios = await Usuario.count({
            where: { usuario_cliente }
        });

        if (quantidadeUsuarios >= clienteAssinaturas) {
            return res.status(400).json({
                error: 'Limite de usuários atingido para esse cliente. Não é possível cadastrar mais usuários.'
            });
        }

        const novoUsuario = await Usuario.create({
            usuario_nome,
            usuario_email,
            usuario_telefone,
            usuario_senha: await argon2.hash(usuario_senha),
            usuario_ativo,
            usuario_aniversario,
            usuario_cliente
        });

        const usuarioSemSenha = novoUsuario.get({ plain: true });
        delete usuarioSemSenha.usuario_senha;

        return res.status(201).json({ status: 201, message: 'Usuário criado com sucesso.', dados: usuarioSemSenha });

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

exports.updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const cliente_id = req.query.cliente_id

        if (!cliente_id) {
            return res.status(400).json({ status: 400, message: 'O ID do cliente não foi enviado' });
        }

        const usuario = await Usuario.findOne({
            attributes: {
                exclude: ['usuario_senha'],
            },
            where: {
                usuario_id: id,
                usuario_cliente: cliente_id
            },
        });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        await usuario.update(req.body);

        const usuarioAtualizado = usuario.get({ plain: true });
        delete usuarioAtualizado.usuario_senha;

        return res.status(200).json({ status: 200, message: 'Usuário atualizado com sucesso.', dados: usuarioAtualizado });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ status: 409, message: 'E-mail já cadastrado.' });
        }

        if (error.name === 'SequelizeDatabaseError') {
            return res.status(400).json({ status: 400, message: 'Um ou mais campos têm o tipo de dado incorreto.' });
        }
        logger.error('Ocorreu um erro: ' + error.message);
        return res.status(500).json({ status: 500, message: 'Erro interno do servidor' });
    }
};
