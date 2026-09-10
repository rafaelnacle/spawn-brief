# SpawnBrief

Portal de videogames com notícias, promoções, jogos gratuitos temporariamente, catálogo e próximos lançamentos. Interface editorial escura e responsiva, sem conta e sem backend próprio.

**Tecnologias:** React, TypeScript strict, Vite, React Router, TanStack Query, CSS, Lucide e date-fns.

## Executar

Requer Node.js 22.13+ e npm.

```sh
npm ci
npm run dev
```

Acesse o endereço exibido pelo Vite. Rotas: `/`, `/news`, `/deals`, `/games`, `/games/:slug`, `/releases` e `/search`.

```sh
npm run lint
npm run typecheck
npm test
npm run format:check
npm run build
npm run preview
```

## Dados e configuração

- Notícias e catálogo são demonstrativos e identificados na interface.
- Seletor PT/EN no topo: interface, notícias demonstrativas, descrições e datas traduzidas. Os nomes dos jogos são preservados. A preferência fica salva neste navegador.
- Preços reais da Steam: português consulta Brasil (BRL); inglês consulta Estados Unidos (USD). A CheapShark permanece em USD, sem conversão cambial.
- Ofertas priorizam a moeda do idioma; o filtro de moeda permite consultar as demais ofertas carregadas. Jogos grátis incluem todas as moedas.
- Jogos grátis incluem apenas ofertas com preço normal positivo e preço atual zero.
- Próximos lançamentos vêm da Steam; datas ausentes aparecem como “Em breve”.
- A pesquisa consulta os dados carregados, não todo o catálogo das lojas.
- Sem chaves de API para executar esta versão.

O servidor de desenvolvimento encaminha `/api/steam` para a Steam. Para uma publicação estática, configure `VITE_STEAM_PROXY_URL` com o endereço **público do seu próprio proxy**. Sem ele, o bloqueio CORS da Steam pode limitar o site às ofertas da CheapShark. O proxy deve encaminhar apenas as combinações permitidas `cc=br&l=brazilian` e `cc=us&l=english`, com cache separado por região. A variável é opcional; veja `.env.example`. Nunca inclua chaves ou tokens em `VITE_*`.

Publique o conteúdo de `dist/` em uma hospedagem com fallback de rotas para `index.html`. O comando `preview` serve os arquivos de produção e não inclui o proxy de desenvolvimento.

Preços e disponibilidade devem ser confirmados na loja. Imagens e marcas pertencem aos respectivos publishers. Fontes: [Steam](https://store.steampowered.com/) e [CheapShark](https://apidocs.cheapshark.com/).
