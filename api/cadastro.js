export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  try {
    const { nome, email, telefone } = req.body || {};
    if (!nome || !email || !telefone) {
      return res.status(400).json({ error: 'Preencha todos os campos.' });
    }

    const conn = process.env.DATABASE_URL;
    if (!conn) return res.status(500).json({ error: 'Variável DATABASE_URL não encontrada.' });

    // Extrai o host e o database da string de conexão do Neon
    const urlParts = conn.split('@')[1].split('/');
    const host = urlParts[0];
    const database = urlParts[1].split('?')[0];

    // Faz a requisição HTTP direta para a API do Neon
    const response = await fetch(`https://${host}/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Neon-Connection-String': conn
      },
      body: JSON.stringify({
        query: 'INSERT INTO clientes (nome, email, telefone) VALUES ($1, $2, $3)',
        params: [nome, email, telefone]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Erro no Neon: ${errorData}`);
    }

    return res.status(200).json({ sucesso: true });

  } catch (error) {
    console.error('Erro no servidor:', error);
    return res.status(500).json({ error: 'Erro ao salvar: ' + error.message });
  }
}
