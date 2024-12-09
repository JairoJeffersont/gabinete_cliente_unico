const Usuario = require('../models/usuarios');
const Cliente = require('../models/clientes');



const insertDefaultData = async () => {
  try {

    await Cliente.findOrCreate({
      where: { cliente_id: 1 },
      defaults: {
        cliente_nome: 'CLIENTE SISTEMA',
        cliente_email: 'cliente@email',
        cliente_telefone: '000000000000',
        cliente_ativo: 1,
        cliente_cpf_cnpj: '00000000',
        cliente_endereco: '0000000000',
        cliente_assinaturas: 1,
        cliente_deputado_id: 204379,
        cliente_deputado_nome: "Acácio Favacho",
      },
    });

    await Usuario.findOrCreate({
      where: { usuario_id: 1 },
      defaults: {
        usuario_nome: 'USUÁRIO SISTEMA',
        usuario_email: 'email@email.com',
        usuario_telefone: '000000',
        usuario_senha: 'sd9fasdfasd9fasd89fsad9f8',
        usuario_ativo: 1,
        usuario_aniversario: '2000-01-01',
        usuario_cliente: 1
      },
    });


  } catch (error) {
    console.error('Erro ao inserir dados padrão:', error);
  }
};

module.exports = insertDefaultData;