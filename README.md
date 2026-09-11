# SpawnBrief

Portal de videogames com notícias, promoções, jogos gratuitos temporariamente, catálogo e próximos lançamentos. Interface editorial escura e responsiva, em português e inglês, sem conta ou backend próprio.

**Tecnologias:** React, TypeScript, Vite, React Router, TanStack Query, CSS, Lucide e date-fns.

## Executar

Requer Node.js 22.13+ e npm. A atualização do catálogo precisa de acesso à internet.

```sh
npm ci
npm run sync:data
npm run dev
```

Notícias e catálogo editorial são demonstrativos. Preços e lançamentos vêm das APIs públicas da Steam e CheapShark, salvos como dados estáticos com horário de atualização. Execute `npm run sync:data` para atualizar a cópia local.

```sh
npm run lint
npm run typecheck
npm test
npm run format:check
npm run build
```

## Idioma e conteúdo

- PT consulta preços brasileiros da Steam em BRL; EN consulta a loja americana em USD. CheapShark permanece em USD, sem conversão cambial.
- O controle **Conteúdo**, no topo, permite exibir jogos com conteúdo sexual explícito. A opção vem desativada. O filtro usa o descritor específico da Steam, não classificação +18, violência ou nudez isolada; GTA não é bloqueado por ser adulto.
- A classificação depende das fontes. Jogos sem metadados podem aparecer, com o aviso “Conteúdo não classificado”. O filtro não é controle parental nem garantia de classificação perfeita.
- Idioma e preferência de conteúdo ficam salvos apenas neste navegador. Nomes dos jogos não são traduzidos.
- Jogos grátis precisam ter preço normal positivo e preço atual zero. Confirme prazo, preço e disponibilidade na loja.

Nenhuma API key ou variável de ambiente é necessária. Não coloque segredos em `VITE_*`.

## GitHub Pages

O workflow `.github/workflows/pages.yml` está preparado para publicar `dist/`, ao receber um push em `main`, por execução manual ou por atualização agendada a cada seis horas. Ele consulta as APIs, classifica o conteúdo, verifica o projeto e gera o site. Se uma fonte obrigatória falhar, a publicação anterior é preservada.

1. Vincule o projeto ao seu repositório no GitHub.
2. Em **Settings → Pages → Build and deployment**, escolha **GitHub Actions**.
3. Faça o push dos commits locais ou execute **Publish SpawnBrief to GitHub Pages** na aba Actions.

A publicação usa rotas com hash, como `/#/deals`, e caminhos relativos para funcionar tanto no domínio principal quanto em uma subpasta de repositório, sem configurar seu nome. Recarregar uma página interna não depende de fallback de servidor.

Para verificar o pacote de publicação localmente:

```sh
npm run sync:data
npm run build:pages
npm run preview
```

O Pages serve os últimos dados publicados, sem proxy externo. A agenda do GitHub pode sofrer atrasos; o horário dos preços aparece na interface. Dados gerados ficam fora do Git e não exigem commits ou push automáticos.

Fontes: [Steam](https://store.steampowered.com/) e [CheapShark](https://apidocs.cheapshark.com/). Imagens e marcas pertencem aos respectivos publishers.
