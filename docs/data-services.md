# Contratos e adaptadores

Componentes consomem modelos de `src/types` por hooks do TanStack Query. Serviços e mappers validam dados externos. O conteúdo demonstrativo fica em `src/data`, com textos em inglês em `src/i18n`.

## Dados estáticos para Pages

`scripts/sync-data.mjs` consulta os endpoints oficiais da Steam `featuredcategories` nas regiões BR/US, promoções e lojas da CheapShark e `appdetails` da Steam para descritores de conteúdo. Nenhuma chamada exige chave e nenhum website é raspado. Apenas os campos utilizados são gravados em `public/data/steam-br.json`, `steam-us.json` e `cheapshark.json`, com versão e horário da consulta. Os arquivos gerados e o cache local ficam fora do Git.

O script usa timeouts, no máximo três tentativas por chamada, dois trabalhadores para metadados e espaçamento entre consultas. Descritores conhecidos podem ser reaproveitados do cache local por até sete dias. Falhas pontuais de classificação resultam em “unknown”; falha total de classificação ou de uma fonte obrigatória impede a publicação de um catálogo incompleto. O GitHub Actions consulta tudo novamente a cada execução e não faz commits de dados.

O navegador consulta os JSON no mesmo domínio, evitando CORS e a necessidade de proxy ou backend. Não há chamadas diretas do navegador à Steam ou CheapShark. O botão de atualização busca a versão publicada mais recente, não dispara o workflow. A agenda de seis horas do GitHub não é uma garantia de execução pontual.

Cache do cliente: dez minutos para promoções, cinco para notícias e uma hora para jogos. Steam Brasil e Estados Unidos usam chaves de consulta distintas. Fonte indisponível não transforma preços em zero nem remove as ofertas válidas da outra fonte.

## Preços e calendário

Steam: `specials`, `top_sellers` e `new_releases` contribuem somente quando há desconto; resultados são deduplicados por aplicativo e moeda. Centavos são divididos por cem e a moeda precisa corresponder à região. Descontos com prazo conhecido já encerrado são descartados. `coming_soon` fornece lançamentos; datas ausentes não são inventadas.

CheapShark: até sessenta ofertas e nomes das lojas pela API oficial. Valores permanecem em USD; os IDs de redirecionamento são codificados uma única vez. Não há comparação numérica entre moedas diferentes. Ofertas de um jogo representam apenas esse conjunto de destaques, sem histórico de menor preço. Jogos grátis exigem preço normal positivo e preço atual zero.

## Conteúdo sexual explícito

`content_descriptors.ids` vem da API de detalhes da Steam. Somente o descritor **3 — Adult Only Sexual Content** gera `explicit-sexual`. Os descritores 1 (alguma nudez/sexualidade), 2 (violência), 4 (nudez/sexualidade frequente) e 5 (conteúdo adulto geral) não bastam para ocultar um jogo. Não são usados classificação etária, gênero, tags vagas ou palavras no título.

Sem descritores válidos, o estado é `unknown`. Isso não é interpretado como pornografia: o item pode aparecer com indicação de classificação ausente. Jogos sem vínculo com a Steam também podem permanecer desconhecidos. A opção é uma preferência de exibição baseada nas fontes, não controle de acesso ou classificação infalível.

A preferência começa desativada e é aplicada nos hooks, antes de renderizar cards e imagens: home, ofertas, jogos gratuitos, lançamentos, catálogo, notícias, busca e detalhes. O cache guarda os dados completos, então ativar/desativar a opção atualiza todas as superfícies sem refazer consultas. Conteúdo demo atual foi revisado como não pornográfico. Metadados de futuras fontes devem ser mapeados para o mesmo modelo interno.

Referências: [pesquisa de conteúdo da Steam](https://partner.steamgames.com/doc/gettingstarted/contentsurvey) e API pública `https://store.steampowered.com/api/appdetails?appids=271590&filters=content_descriptors` (GTA V: descritor 5 na verificação da implementação).

## Idiomas e integrações futuras

O contexto de idioma traduz a interface e o conteúdo demonstrativo. Nomes oficiais ficam intactos. Datas usam date-fns; valores usam Intl.NumberFormat. Só preferências de idioma e exibição são armazenadas no navegador.

Substitua `newsService.getArticles` futuramente por um agregador RSS próprio, com fontes permitidas, deduplicação, validação de datas/URLs, resumos curtos e HTML removido. Retorne `NewsArticle[]` com fonte, data, URL original e `isDemo: false`. Não copie artigos completos. Notícias reais conservam o idioma original até existir tradução autorizada.

RAWG e IsThereAnyDeal continuam com `requiresServerProxy: true`, sem chamadas autenticadas. Mantenha futuras chaves apenas nos secrets de uma função; nunca em `VITE_*`. Imagens oficiais utilizadas estão documentadas em `image-sources.json`; disponibilidade pública não implica licença aberta.
