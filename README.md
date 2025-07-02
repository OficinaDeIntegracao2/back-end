# Projeto Backend

## Pré-requisitos:
 - Node.js (versão 20.13.1)
 - npm ou yarn
 - Banco de dados configurado (verifique o arquivo .env e prisma/schema.prisma)

## Configuração Inicial:
 - Clone o repositório:  
  `git clone [seu-repositório]`  
  `cd back-end`   

 - Instale as dependências:  
  `npm install`  

 - Configure o ambiente:  
  `cp .env.example .env`  
 - Edite o arquivo .env com todas as configurações necessárias:
   - `SERVER_PORT=` Define a porta em que o servidor irá escutar. Exemplo: 3000, 8080
   - `LOGGING_LEVEL=` Define o nível de verbosidade dos logs, usado por bibliotecas como o Pino. Exemplo: info, debug, error, warn.
   - `JWT_SECRET=` Chave secreta usada para assinar e verificar tokens JWT. 
   - `JWT_EXPIRES_IN=` Tempo de expiração dos tokens JWT. Exemplo: 1h, 7d, 60m.
   - `RESEND_API_KEY=` Chave da API do serviço Resend, usado para envio de e-mails.

## Executando o Projeto:  
   - Use o comando completo que executa todos os passos necessários:  
    `npm run start:dev`
   - Este script irá:  
     - Executar as migrations do Prisma  
     - Gerar o Prisma Client  
     - Rodar a seed do admin  
     - Iniciar o servidor em modo desenvolvimento

## Scripts Disponíveis:
  `npm run start:dev - Configura e inicia o servidor (recomendado para desenvolvimento)`  
  `npm run dev - Apenas inicia o servidor (sem configurar o banco)`    
  `npm run setup - Apenas configura o banco (migrations + generate + seed)`    
  `npm test - Executa os testes`  
  `npm run test:watch - Executa testes em modo watch`  
  `npm run test:coverage - Gera relatório de cobertura de testes`  
  `npm run build - Compila o projeto TypeScript`  
  `npm run clean - Limpa a pasta de build`   

## Acessando a API:
  - Após iniciar com start:dev, a API estará disponível em:  
    `http://localhost:[PORT]/`
  - Documentação Swagger:  
    `http://localhost:[PORT]/api/docs`

 ## Estrutura do Projeto:
  - Principais diretórios:
     - src/ - Código fonte principal
     - prisma/ - Configurações do banco de dados
     - tests/ - Testes automatizados

 ## Dúvidas ou Problemas:
  - Se encontrar problemas ao executar o projeto:
  - Verifique se todas as variáveis no .env estão corretas
  - Confira se o banco de dados está acessível
  - Caso persista, abra uma issue no repositório