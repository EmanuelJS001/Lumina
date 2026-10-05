require('dotenv').config();
const nodemailer = require('nodemailer');

// Criar transportador de email
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
  },
});

// Verificar conexão
transporter.verify((error, success) => {
  if (error) {
    console.log('⚠️  Email não configurado:', error.message);
  } else {
    console.log('✓ Email pronto para envio');
  }
});

// Função para enviar email de contato
const enviarEmailContato = async (dados) => {
  const { nome, email, telefone, mensagem, tipo } = dados;

  const mailOptions = {
    from: "luminatechnologic@gmail.com",  
    to: "luminatechnologic@gmail.com",  
    subject: `Novo contato - ${tipo || 'Geral'}`,  
    html: `
      <h2>Novo contato recebido</h2>
      <p><strong>Nome:</strong> ${nome}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Telefone:</strong> ${telefone || 'Não informado'}</p>
      <p><strong>Tipo:</strong> ${tipo || 'Geral'}</p>
      <p><strong>Mensagem:</strong></p>
      <p>${mensagem.replace(/\n/g, '<br>')}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { sucesso: true, mensagem: 'Email enviado com sucesso!' };
  } catch (erro) {
    console.error('Erro ao enviar email:', erro);
    return { sucesso: false, mensagem: 'Erro ao enviar email' };
  }
};

// Função para enviar email de confirmação ao cliente
const enviarConfirmacao = async (email, nome) => {
  const mailOptions = {
    from: "luminatechnologic@gmail.com",
    to: email,
    subject: 'Recebemos sua mensagem - Lumina',
    html: `
      <h2>Obrigado por entrar em contato!</h2>
      <p>Olá ${nome},</p>
      <p>Recebemos sua mensagem com sucesso. Nossa equipe analisará seus dados em breve.</p>
      <p>Em breve você receberá uma resposta.</p>
      <br>
      <p>Equipe Lumina</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (erro) {
    console.error('Erro ao enviar confirmação:', erro);
    return false;
  }
};

module.exports = {
  transporter,
  enviarEmailContato,
  enviarConfirmacao,
};