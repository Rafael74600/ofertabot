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

app.post("/api/gerar", (req, res) => {
  const { produto, preco, link } = req.body;

  if (!produto || !preco || !link) {
    return res.status(400).json({
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
    oferta: oferta
  });
});

module.exports = app;
