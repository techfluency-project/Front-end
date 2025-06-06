````markdown
# TechFluency - Aplicação Next.js

Este é o repositório da aplicação **TechFluency**, construída com React e Next.js.

---

## Começando

Siga os passos abaixo para rodar a aplicação localmente em sua máquina.

### Pré-requisitos

- Node.js instalado (recomenda-se versão 16 ou superior)
- npm (gerenciador de pacotes do Node.js)

---

### Instalação

1. Clone este repositório:

```bash
git clone <URL-DO-REPOSITORIO>
````

2. Entre na pasta do projeto:

```bash
cd nome-do-projeto
```

3. Instale as dependências:

```bash
npm install
```

---

### Configuração do ambiente

Crie um arquivo `.env.local` na raiz do projeto com a seguinte variável de ambiente:

```env
NEXT_PUBLIC_API_URL=http://localhost:5092
```

Essa variável define a URL base da API utilizada pela aplicação em ambiente local.

---

### Executando a aplicação

Para rodar a aplicação em modo de desenvolvimento, utilize o comando:

```bash
npm run dev
```

Depois, acesse a aplicação em seu navegador pelo endereço:

```
http://localhost:3000
```

---

## Deploy

A aplicação está deployada e disponível em produção na URL:

[https://techfluency.vercel.app/home](https://techfluency.vercel.app/home)

---

## Scripts disponíveis

* `npm run dev` - Inicia o servidor de desenvolvimento
* `npm run build` - Cria uma build para produção
* `npm start` - Roda a aplicação em modo produção (após build)

---

## Tecnologias utilizadas

* React
* Next.js
* Node.js
* Vercel (para deploy)


