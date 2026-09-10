# Contratos e próximos adaptadores

## Limites da primeira entrega

Componentes consomem modelos de `src/types` por hooks do TanStack Query. Chamadas externas ficam em `src/services`; as validações e conversões ficam em `mappers.ts`. Dados de demonstração ficam em `src/data`.

O cache dura dez minutos para promoções, cinco para notícias e uma hora para jogos. Chamadas têm timeout de quinze segundos e uma tentativa adicional. As duas fontes de promoções falham independentemente. Respostas inválidas são descartadas; valores malformados não viram preços zero. Imagens externas aceitam somente HTTPS.

Steam: `featuredcategories?cc=br&l=brazilian`. `specials`, `top_sellers` e `new_releases` contribuem somente quando o preço é reduzido; resultados são deduplicados por aplicativo. `coming_soon` alimenta o calendário sem inventar datas que o endpoint não fornece. Preços inteiros são divididos por cem e só BRL é aceito neste adaptador.

CheapShark: até sessenta ofertas ordenadas pelo índice da fonte; lojas são consultadas na API oficial. Valores permanecem em USD. Redirecionamentos usam `https://www.cheapshark.com/redirect?id=...` com o ID codificado uma única vez. Nenhuma comparação numérica entre moedas diferentes ocorre na ordenação por preço: resultados são agrupados por moeda.

As ofertas de um jogo são um subconjunto desses destaques. Não representam uma pesquisa completa de preços nem histórico. O site não calcula ou inventa um menor preço histórico. Jogos gratuitos só passam se `normalPrice > 0` e `salePrice === 0`.

## Proxy Steam para produção

`VITE_STEAM_PROXY_URL` aponta para uma URL pública de um Worker ou função sob seu controle. O proxy deve aceitar apenas GET, encaminhar para o endpoint Steam fixo acima, validar a resposta, aplicar cache de 5–10 minutos, limitar tráfego e emitir CORS somente para as origens do portal. Não aceite um parâmetro de URL arbitrário. Não use proxies públicos aleatórios. O proxy Vite é exclusivamente local e não faz parte de `dist`.

## Notícias por RSS

Substitua `newsService.getArticles` por uma chamada ao seu próprio agregador. Contrato de retorno: `NewsArticle[]`, com `isDemo: false`. Fontes propostas: PC Gamer, IGN, GameSpot, Polygon, Eurogamer e Game Developer. Ainda não há scraping nem chamadas a esses veículos.

Uma futura Cloudflare Worker, Vercel Function ou Netlify Function deve buscar uma lista fixa de feeds autorizados, fazer parsing de RSS/Atom no servidor, deduplicar por link, validar datas e URLs, resumir trechos, sanitizar texto e retornar JSON. Exponha apenas título, resumo, imagem autorizada, fonte, data, categoria e URL do artigo original. Não copie artigos completos. Valide URLs de saída HTTP(S) antes de retornar e remova HTML. A UI renderiza texto, sem `dangerouslySetInnerHTML`.

## RAWG e IsThereAnyDeal

`futureProviders` marca ambos com `requiresServerProxy: true`. Nenhuma chamada autenticada está implementada. Crie posteriormente um adaptador que receba a resposta já normalizada do servidor, preservando `Game`, `GameRelease` e `Deal`. Chaves ficam exclusivamente nos secrets da função, nunca em variáveis `VITE_*`. Acrescente atribuição conforme os termos da API escolhida.

## Imagens

`image-sources.json` registra os URLs oficiais da Steam das artes presentes em `public/images`. São materiais promocionais dos publishers; disponibilidade pública não concede licença aberta. Os arquivos não são assets gerados por IA.

## Revisão da arquitetura

A interface está separada dos formatos externos. O próximo passo é conectar o agregador RSS e um catálogo seguro sem mudar os cards. Não adicionar autenticação, banco ou histórico de preços até existir um requisito concreto para isso. Esta entrega não publica código nem executa push.
