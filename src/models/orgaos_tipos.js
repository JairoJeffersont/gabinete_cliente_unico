// models/orgaos_tipos.js

const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const Usuario = require('./usuarios');

const OrgaoTipo = sequelize.define('OrgaoTipo', {
  orgao_tipo_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orgao_tipo_nome: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  orgao_tipo_descricao: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  orgao_tipo_criado_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  orgao_tipo_criado_por: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'usuario_id',
    },
  },
  orgao_tipo_atualizado_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
  createdAt: 'orgao_tipo_criado_em',
  updatedAt: 'orgao_tipo_atualizado_em',
});

Usuario.hasMany(OrgaoTipo, { foreignKey: 'orgao_tipo_criado_por', sourceKey: 'usuario_id', as: 'OrgaoTipos' });
OrgaoTipo.belongsTo(Usuario, { foreignKey: 'orgao_tipo_criado_por', targetKey: 'usuario_id', as: 'Usuario' });

module.exports = OrgaoTipo;
