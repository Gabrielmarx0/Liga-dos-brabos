# Liga dos Brabos

Aplicação web para organizar campeonatos entre amigos, com foco em praticidade: cadastro de times/jogadores, geração automática de jogos em pontos corridos, tabela em tempo real e final opcional.

## Funcionalidades

- Cadastro de jogadores/times
- Evita nomes duplicados
- Geração automática de confrontos (round-robin)
- Opção de turno único ou ida e volta
- Lançamento de placares por partida
- Tabela de classificação automática (P, J, V, E, D, GP, GC, SG)
- Final opcional entre 1º e 2º colocados
- Persistência local dos dados com `localStorage`

## Stack

- React 19
- Vite 7
- JavaScript (ESM)
- CSS

## Como rodar localmente

### 1. Instalar dependências

```bash
npm install
```

### 2. Ambiente de desenvolvimento

```bash
npm run dev
```

### 3. Build de produção

```bash
npm run build
```

### 4. Preview local do build

```bash
npm run preview
```

## Scripts disponíveis

- `npm run dev` -> inicia servidor de desenvolvimento
- `npm run build` -> gera build de produção em `dist/`
- `npm run preview` -> serve localmente a build de produção
- `npm run lint` -> executa lint do projeto

## Estrutura do projeto

```txt
.
├─ public/
│  ├─ _headers
│  └─ vite.svg
├─ src/
│  ├─ assets/
│  ├─ utils/
│  │  └─ tournamentLogic.js
│  ├─ App.jsx
│  ├─ App.css
│  ├─ main.jsx
│  └─ index.css
├─ index.html
├─ package.json
└─ vite.config.js
```

## Deploy (Netlify)

Configuração recomendada:

- Build command: `npm run build`
- Publish directory: `dist`

O projeto inclui o arquivo `public/_headers` com headers de segurança para ambiente de produção.

## Segurança aplicada

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` restritiva para recursos sensíveis
- `Content-Security-Policy` configurada no `_headers` para deploy

## Observações

- Os dados do campeonato são salvos no navegador do usuário (`localStorage`).
- Limpar os dados do navegador remove o estado salvo.
