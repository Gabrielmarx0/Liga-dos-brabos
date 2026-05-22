# Liga dos Brabos

Aplicação web para organizar campeonatos entre amigos, com foco em praticidade: cadastro de times/jogadores, geração automática de jogos em pontos corridos, tabela em tempo real e final opcional.

## Funcionalidades

- Cadastro de jogadores/times
- Bloqueio de nomes duplicados
- Geração automática de confrontos em pontos corridos (round-robin)
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

- `npm run dev` inicia o servidor de desenvolvimento
- `npm run build` gera a build de produção em `dist/`
- `npm run preview` serve localmente a build de produção
- `npm run lint` executa o lint do projeto

## Estrutura do projeto

```txt
.
├── public/
│   ├── _headers
│   └── vite.svg
├── src/
│   ├── assets/
│   ├── utils/
│   │   └── tournamentLogic.js
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

## Deploy (Netlify)

Configuração recomendada:

- Build command: `npm run build`
- Publish directory: `dist`

O projeto inclui o arquivo `public/_headers` com headers de segurança para o ambiente de produção.

## Segurança

- Não há backend, banco de dados ou credenciais versionadas.
- Arquivos `.env*`, `node_modules/` e `dist/` ficam fora do Git pelo `.gitignore`.
- Os dados do campeonato são salvos somente no navegador do usuário com `localStorage`.
- O servidor de desenvolvimento do Vite deve ser usado apenas localmente.
- Antes de publicar mudanças, rode `npm audit`, `npm run lint` e `npm run build`.

Headers aplicados em produção:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` restritiva para recursos sensíveis
- `Content-Security-Policy` configurada no `_headers`

## Observações

- Limpar os dados do navegador remove o campeonato salvo.
- Para compartilhar o projeto publicamente, publique somente o código-fonte e a build estática. Não exponha o servidor de desenvolvimento na internet.
