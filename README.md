# OfertaBot Automático 2.0

O robô procura ofertas da Shopee em intervalos configuráveis, escolhe uma oferta que ainda não foi enviada e publica a mensagem no grupo configurado.

## Fluxo

1. O servidor inicia.
2. Se `AUTO_ENABLED=true`, a automação é ativada.
3. A cada intervalo, o servidor consulta a Shopee.
4. Ele procura uma oferta nova que ainda não está no histórico.
5. Monta a mensagem.
6. Envia para o grupo pelo WhatsApp Business Platform.
7. Salva o item enviado em `data/history.json`.
8. Repete no próximo intervalo.

O histórico evita ficar enviando o mesmo produto enquanto o arquivo de histórico existir.

## Instalação

Node.js 20+:

```bash
npm install
```

Copie `.env.example` para `.env` e preencha:

```env
SHOPEE_APP_ID=...
SHOPEE_APP_SECRET=...

WA_ACCESS_TOKEN=...
WA_PHONE_NUMBER_ID=...
WA_GROUP_ID=...
```

Depois:

```bash
npm start
```

Abra:

```text
http://localhost:3000
```

## Ativar automaticamente

No `.env`:

```env
AUTO_ENABLED=true
AUTO_KEYWORD=fone bluetooth
AUTO_INTERVAL_MINUTES=60
AUTO_LIMIT=10
```

Também é possível ativar, pausar e alterar o intervalo pela tela do OfertaBot.

## Atenção ao WhatsApp

A Meta passou a documentar a Groups API oficialmente em 2026. O envio para grupo usa `recipient_type: "group"` e o ID do grupo. Porém, o recurso possui requisitos de elegibilidade da conta/WABA. Veja a documentação oficial da Meta antes de publicar em produção:

https://developers.facebook.com/documentation/business-messaging/whatsapp/groups

O `WA_GROUP_ID` precisa ser um ID de grupo válido obtido pelo fluxo da Groups API; não é simplesmente o nome do grupo.

## Shopee

A busca usa a Shopee Affiliate Open API GraphQL:

https://open-api.affiliate.shopee.com.br/explorer

O Secret fica somente no backend. Nunca coloque o Secret no `index.html`.

## Produção

Para deixar 24h no ar, rode o servidor em uma hospedagem que mantenha o processo ativo. Se o servidor desligar, o robô para até voltar.

Recomendado:

- HTTPS;
- variáveis secretas no ambiente da hospedagem;
- processo persistente (PM2, Docker ou serviço equivalente);
- backup de `data/history.json`;
- intervalo razoável para evitar excesso de chamadas.
