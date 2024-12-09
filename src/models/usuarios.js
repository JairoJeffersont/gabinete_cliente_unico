const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const Cliente = require('./clientes');

const Usuario = sequelize.define('Usuario', {
  usuario_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  usuario_nome: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  usuario_email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  usuario_telefone: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  usuario_senha: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  usuario_ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  usuario_aniversario: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  usuario_cliente: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Cliente,
      key: 'cliente_id',
    },
  },
}, {
  timestamps: true,
  createdAt: 'usuario_criado_em',
  updatedAt: 'usuario_atualizado_em',
  tableName: 'Usuario'
});

Cliente.hasMany(Usuario, {
  foreignKey: 'usuario_cliente',
  as: 'usuarios',
  onDelete: 'CASCADE',
});
Usuario.belongsTo(Cliente, {
  foreignKey: 'usuario_cliente',
  as: 'cliente',
  onDelete: 'CASCADE',
});

module.exports = Usuario;
