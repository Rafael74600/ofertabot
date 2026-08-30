const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Teste do servidor
app.get("/api/status", (req, res) => {
  res.json({
    online: true,
    mensagem: "🤖 OfertaBot online!"
  });
});

// Pesquisa automática no Mercado Livre
app.get("/api/pesquisar", async (req, res) => {
  try {
    const produto = req.query.produto;

    if (!produto) {
      return res.status(400).json({
        sucesso: false,
        erro: "Digite o nome do produto."
      });
    }

    const url =
      "https://api.mercadolibre.com/sites/MLB/search?q=" +
      encodeURIComponent(produto) +
      "&limit=10";

    const resposta = await fetch(url);

    if (!resposta.ok) {
      throw new Error("Erro ao consultar o Mercado Livre");
    }

    const dados = await resposta.json();

    const ofertas = dados.results.map((item) => ({
      id: item.id,
      produto: item.title,
      preco: item.price,
      moeda: item.currency_id,
      imagem: item.thumbnail,
      link: item.permalink
    }));

    res.json({
      sucesso: true,
      pesquisa: produto,
      total: ofertas.length,
      ofertas: ofertas
    });

  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      sucesso: false,
      erro: "Não foi possível pesquisar as ofertas."
    });
  }
});

module.exports = app; 
