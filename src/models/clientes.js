const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Cliente = sequelize.define('Cliente', {
    cliente_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    cliente_nome: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    cliente_email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    cliente_telefone: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    cliente_ativo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    cliente_cpf_cnpj: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    cliente_endereco: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    cliente_assinaturas: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cliente_deputado_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
    cliente_deputado_nome: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
}, {
    timestamps: true,
    createdAt: 'cliente_criado_em',
    updatedAt: 'cliente_atualizado_em',
    tableName: 'Cliente'
});

module.exports = Cliente;
