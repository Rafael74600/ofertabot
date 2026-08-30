<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>OfertaBot</title>

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: Arial, sans-serif;
      background: #0f1117;
      color: white;
      min-height: 100vh;
    }

    header {
      background: #171923;
      padding: 35px 20px;
      text-align: center;
      border-bottom: 1px solid #292d38;
    }

    header h1 {
      font-size: 42px;
      color: #00e676;
      margin-bottom: 12px;
    }

    header p {
      color: #aaa;
      font-size: 20px;
    }

    .container {
      max-width: 900px;
      margin: 50px auto;
      padding: 0 20px;
    }

    .box {
      background: #171923;
      border: 1px solid #292d38;
      border-radius: 25px;
      padding: 35px;
    }

    .box h2 {
      color: #00e676;
      font-size: 30px;
      margin-bottom: 15px;
    }

    .box p {
      color: #ccc;
      font-size: 18px;
      line-height: 1.6;
      margin-bottom: 25px;
    }

    input {
      width: 100%;
      padding: 20px;
      border-radius: 16px;
      border: 1px solid #303440;
      background: #0f1117;
      color: white;
      font-size: 18px;
      outline: none;
      margin-bottom: 15px;
    }

    input:focus {
      border-color: #00e676;
    }

    button {
      width: 100%;
      padding: 20px;
      border: none;
      border-radius: 16px;
      background: #00e676;
      color: #000;
      font-size: 19px;
      font-weight: bold;
      cursor: pointer;
    }

    button:hover {
      background: #00c965;
    }

    button:disabled {
      opacity: 0.6;
      cursor: wait;
    }

    #mensagem {
      text-align: center;
      margin: 30px 0 20px;
      color: #aaa;
      font-size: 18px;
    }

    #resultados {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 25px;
    }

    .oferta {
      background: #171923;
      border: 1px solid #292d38;
      border-radius: 18px;
      padding: 20px;
      overflow: hidden;
    }

    .oferta img {
      width: 100%;
      height: 200px;
      object-fit: contain;
      background: white;
      border-radius: 12px;
      margin-bottom: 15px;
    }

    .oferta h3 {
      font-size: 17px;
      line-height: 1.4;
      margin-bottom: 12px;
    }

    .preco {
      color: #00e676;
      font-size: 25px;
      font-weight: bold;
      margin-bottom: 15px;
    }

    .comprar {
      display: block;
      text-align: center;
      text-decoration: none;
      background: #00e676;
      color: #000;
      font-weight: bold;
      padding: 13px;
      border-radius: 12px;
    }

    footer {
      text-align: center;
      color: #777;
      padding: 50px 20px;
      font-size: 16px;
    }

    @media (max-width: 600px) {
      header h1 {
        font-size: 34px;
      }

      header p {
        font-size: 17px;
      }

      .container {
        margin-top: 30px;
      }

      .box {
        padding: 25px 20px;
      }
    }
  </style>
</head>

<body>

  <header>
    <h1>🤖 OfertaBot</h1>
    <p>Encontre ofertas de forma rápida e fácil</p>
  </header>

  <main class="container">

    <div class="box">
      <h2>🔎 Procurar oferta</h2>

      <p>
        Digite o nome do produto que você está procurando.
      </p>

      <input
        type="text"
        id="produto"
        placeholder="Ex: celular, notebook, fone..."
      >

      <button id="botao" onclick="pesquisarOferta()">
        Procurar oferta
      </button>
    </div>

    <div id="mensagem"></div>

    <div id="resultados"></div>

  </main>

  <footer>
    OfertaBot © 2026
  </footer>


  <script>

    async function pesquisarOferta() {

      const campo = document.getElementById("produto");
      const botao = document.getElementById("botao");
      const mensagem = document.getElementById("mensagem");
      const resultados = document.getElementById("resultados");

      const produto = campo.value.trim();

      if (!produto) {
        mensagem.innerHTML = "⚠️ Digite o nome de um produto.";
        resultados.innerHTML = "";
        return;
      }

      botao.disabled = true;
      botao.innerText = "🔎 Pesquisando...";

      mensagem.innerHTML = "⏳ Procurando as melhores ofertas...";
      resultados.innerHTML = "";

      try {

        const resposta = await fetch(
          "/api/pesquisar?produto=" + encodeURIComponent(produto)
        );

        const dados = await resposta.json();

        if (!resposta.ok || !dados.sucesso) {
          throw new Error(
            dados.erro || "Não foi possível realizar a pesquisa."
          );
        }

        if (!dados.ofertas || dados.ofertas.length === 0) {

          mensagem.innerHTML =
            "😕 Nenhuma oferta encontrada para <b>" +
            produto +
            "</b>.";

          return;
        }

        mensagem.innerHTML =
          "✅ Encontramos " +
          dados.ofertas.length +
          " ofertas para <b>" +
          produto +
          "</b>:";

        dados.ofertas.forEach(function(oferta) {

          const card = document.createElement("div");
          card.className = "oferta";

          const imagem = oferta.imagem
            ? `<img src="${oferta.imagem}" alt="${oferta.produto}">`
            : "";

          const preco = Number(oferta.preco).toLocaleString(
            "pt-BR",
            {
              style: "currency",
              currency: "BRL"
            }
          );

          card.innerHTML = `
            ${imagem}

            <h3>${oferta.produto}</h3>

            <div class="preco">
              ${preco}
            </div>

            <a
              class="comprar"
              href="${oferta.link}"
              target="_blank"
              rel="noopener noreferrer"
            >
              🛒 Ver oferta
            </a>
          `;

          resultados.appendChild(card);

        });

      } catch (erro) {

        console.error(erro);

        mensagem.innerHTML =
          "❌ Erro ao pesquisar. Verifique se o servidor está funcionando.";

        resultados.innerHTML = "";

      } finally {

        botao.disabled = false;
        botao.innerText = "Procurar oferta";

      }
    }


    document
      .getElementById("produto")
      .addEventListener("keydown", function(event) {

        if (event.key === "Enter") {
          pesquisarOferta();
        }

      });

  </script>

</body>
</html>
