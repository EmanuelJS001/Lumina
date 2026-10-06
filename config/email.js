require('dotenv').config();

// chave da API Brevo
const BREVO_API_KEY = process.env.BREVO_API_KEY;

// funçao para enviar email de contato
const enviarEmailContato = async (dados) => {
  const { nome, email, telefone, mensagem, tipo } = dados;
  try {
    const resposta = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },

      body: JSON.stringify({
        sender: {
          name: 'Lumina',
          email: 'luminatechnologic@gmail.com',
        },

        to: [{email: 'luminatechnologic@gmail.com',},],
        subject: `Novo contato - ${tipo || 'Geral'}`,
        htmlContent: `
          <h2>Novo contato recebido</h2>
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Telefone:</strong> ${telefone || 'Não informado'}</p>
          <p><strong>Tipo:</strong> ${tipo || 'Geral'}</p>
          <p><strong>Mensagem:</strong></p>
          <p>${mensagem.replace(/\n/g, '<br>')}</p>
        `,
      }),
    });

    const resultado = await resposta.json();
    if (!resposta.ok) {
      console.error('Erro ao enviar email:', resultado);
      return {
        sucesso: false,
        mensagem: 'Erro ao enviar email',
      };
    }

    console.log('Email enviado com sucesso:', resultado.messageId);
    return {
      sucesso: true,
      mensagem: 'Email enviado com sucesso!',
    };

  } catch (erro) {
    console.error('Erro ao enviar email:', erro);
    return {
      sucesso: false,
      mensagem: 'Erro ao enviar email',
    };
  }
};

// Função para enviar email de confirmação ao cliente
const enviarConfirmacao = async (email, nome) => {
  try {
    const resposta = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'Lumina',
          email: 'luminatechnologic@gmail.com',
        },

        to: [
          {
            email: email,
            name: nome,
          },
        ],

        subject: 'Recebemos sua mensagem - Lumina',
        htmlContent: `
          <h2>Obrigado por entrar em contato!</h2>
          <p>Olá ${nome},</p>
          <p>
            Recebemos sua mensagem com sucesso.
            Nossa equipe analisará seus dados em breve.
          </p>
          <p>
            Em breve você receberá uma resposta.
          </p
          <br>
          <p>Equipe Lumina</p>
        `,
      }),
    });

    const resultado = await resposta.json();
    if (!resposta.ok) {
      console.error('Erro ao enviar confirmação:', resultado);
      return false;
    }

    console.log('Confirmação enviada:', resultado.messageId);
    return true;

  } catch (erro) {
    console.error('Erro ao enviar confirmação:', erro);
    return false;
  }
};

module.exports = {
  enviarEmailContato,
  enviarConfirmacao,
};