const express = require("express");

const app = express();

app.use(express.json());
app.use(express.static("public"));

// Status do OfertaBot
app.get("/api/status", (req, res) => {
  res.json({
    online: true,
    mensagem: "OfertaBot online!"
  });
});

// Pesquisa automática de ofertas
app.get("/api/pesquisar", async (req, res) => {
  try {
    const produto = String(req.query.produto || "").trim();

    if (!produto) {
      return res.status(400).json({
        sucesso: false,
        erro: "Digite o nome de um produto."
      });
    }

    const url =
      "https://api.mercadolibre.com/sites/MLB/search?q=" +
      encodeURIComponent(produto) +
      "&limit=10";

    const resposta = await fetch(url);

    if (!resposta.ok) {
      throw new Error("Erro ao consultar ofertas.");
    }

    const dados = await resposta.json();

    const ofertas = (dados.results || []).map((item) => ({
      produto: item.title,
      preco: item.price,
      moeda: item.currency_id,
      link: item.permalink,
      imagem: item.thumbnail,
      vendedor: item.seller?.nickname || "Mercado Livre"
    }));

    res.json({
      sucesso: true,
      pesquisa: produto,
      total: ofertas.length,
      ofertas
    });

  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      sucesso: false,
      erro: "Não foi possível buscar as ofertas agora."
    });
  }
});

// Compatibilidade com o botão antigo
app.post("/api/gerar", (req, res) => {
  const { produto, preco, link } = req.body;

  if (!produto || !preco || !link) {
    return res.status(400).json({
      sucesso: false,
      erro: "Preencha produto, preço e link."
    });
  }

  const oferta = `🔥 OFERTA 🔥

📦 ${produto}

💰 Por apenas R$ ${preco}

🛒 Compre aqui:
${link}

🚀 OfertaBot`;

  res.json({
    sucesso: true,
    oferta
  });
});

// Vercel
module.exports = app;

// Execução local
if (require.main === module) {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`OfertaBot rodando na porta ${PORT}`);
  });
}
