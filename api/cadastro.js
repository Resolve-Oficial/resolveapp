import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  try {
    const { nome, email, telefone } = req.body || {};
    
    if (!nome || !email || !telefone) {
      return res.status(400).json({ error: 'Preencha todos os campos.' });
    }

    // Pega a string de conexão que você vai colar na Vercel
    const sql = neon(process.env.DATABASE_URL);

    // Insere os dados de forma simples e direta
    await sql`
      INSERT INTO clientes (nome, email, telefone)
      VALUES (${nome}, ${email}, ${telefone})
    `;

    return res.status(200).json({ sucesso: true });

  } catch (error) {
    console.error('Erro no Neon:', error);
    return res.status(500).json({ error: 'Erro ao salvar: ' + error.message });
  }
}
