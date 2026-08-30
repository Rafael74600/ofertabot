export default async function handler(req, res) {
  try {
    const produto = req.query.produto;

    if (!produto) {
      return res.status(400).json({
        erro: "Digite o nome do produto"
      });
    }

    const url =
      "https://api.mercadolibre.com/sites/MLB/search?q=" +
      encodeURIComponent(produto) +
      "&limit=10";

    const resposta = await fetch(url);

    if (!resposta.ok) {
      throw new Error("Erro ao consultar Mercado Livre");
    }

    const dados = await resposta.json();

    const ofertas = dados.results.map(item => ({
      titulo: item.title,
      preco: item.price,
      link: item.permalink,
      imagem: item.thumbnail
    }));

    return res.status(200).json({
      sucesso: true,
      produto: produto,
      ofertas: ofertas
    });

  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      sucesso: false,
      erro: "Não foi possível buscar as ofertas",
      detalhes: erro.message
    });
