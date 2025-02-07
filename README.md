🗨️ Aplicativo de Chat
Um aplicativo de chat em tempo real com autenticação JWT, WebSockets (Socket.io) e PostgreSQL para gerenciamento de usuários.

🚀 Funcionalidades
✅ Autenticação de Usuários (Login/Registro com JWT & PostgreSQL)
✅ Chat em Tempo Real (Usando Socket.io)
✅ API Segura (Node.js + Express + PostgreSQL)
✅ Comunicação WebSocket
✅ Interface Simples & Responsiva

🛠️ Como Instalar
1️⃣ Clonar o Repositório
git clone https://github.com/seu-usuario/chat-app.git
cd chat-app

2️⃣ Configurar o Backend
cd backend
npm install

Criar um arquivo .env e adicionar as configurações:
DB_USER=seu_usuario_banco
DB_PASSWORD=sua_senha_banco
DB_HOST=seu_host_banco
DB_NAME=seu_banco_nome

Iniciar o backend:
node server.js
3️⃣ Configurar o Frontend
cd frontend
Abra index.html no navegador.

🏗️ Tecnologias Utilizadas
Frontend: HTML, CSS, JavaScript, Socket.io-client
Backend: Node.js, Express, Socket.io, JWT
Banco de Dados: PostgreSQL

⚠️ Notas Importantes
O chat funciona apenas na mesma rede/localhost.
Se for testar em dois navegadores diferentes, ambos devem estar conectados ao mesmo IP/servidor.
Para acesso remoto, é necessário configurar um servidor público e garantir que as conexões WebSocket sejam acessíveis.

🤝 Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para enviar issues e pull requests.

📜 Licença
Este projeto está licenciado sob a Licença MIT
