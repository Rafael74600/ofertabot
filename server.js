const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/status", (req, res) => {
  res.json({
    online: true,
    mensagem: "OfertaBot online!"
  });
});

app.post("/api/gerar", async (req, res) => {
  try {
    const { produto } = req.body;

    if (!produto) {
      return res.status(400).json({
        erro: "Digite o nome de um produto."
      });
    }

    // Pesquisa automática de ofertas
    const busca = encodeURIComponent(produto);

    const ofertas = [
      {
        produto: produto,
        preco: "Pesquisar preço",
        loja: "Mercado Livre",
        link: `https://lista.mercadolivre.com.br/${busca}`
      },
      {
        produto: produto,
        preco: "Pesquisar preço",
        loja: "Amazon",
        link: `https://www.amazon.com.br/s?k=${busca}`
      },
      {
        produto: produto,
        preco: "Pesquisar preço",
        loja: "Shopee",
        link: `https://shopee.com.br/search?keyword=${busca}`
      }
    ];

    res.json({
      sucesso: true,
      produto: produto,
      ofertas: ofertas
    });

  } catch (erro) {
    console.error(erro);

    res.status(500).json({
      sucesso: false,
      erro: "Erro ao pesquisar ofertas."
    });
  }
});

module.exports = app;
