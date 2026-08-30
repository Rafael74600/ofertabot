const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

// Mostra o index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Pesquisa automática de produtos
app.get("/api/pesquisar", async (req, res) => {
  try {
    const produto = req.query.produto;

    if (!produto) {
      return res.status(400).json({
        erro: "Digite um produto para pesquisar."
      });
    }

    const url =
      "https://api.mercadolibre.com/sites/MLB/search?q=" +
      encodeURIComponent(produto) +
      "&limit=10";

    const resposta = await fetch(url);

    if (!resposta.ok) {
      throw new Error("Erro na pesquisa");
    }

    const dados = await resposta.json();

    const ofertas = dados.results.map(item => ({
      produto: item.title,
      preco: item.price,
      link: item.permalink,
      imagem: item.thumbnail
    }));

    res.json({
      sucesso: true,
      produto: produto,
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
