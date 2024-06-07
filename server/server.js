const express = require('express');
const { createServer } = require('node:http');
const session = require('express-session');
const { Server } = require('socket.io');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');
const socketHandler = require('./sockets');

async function main() {
  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {},
  });

  app.use(express.json());
  app.use(
    session({
      secret: 'mysecret',
      resave: false,
      saveUninitialized: true,
    })
  );

  app.use(authRoutes);
  app.use(indexRoutes);

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  socketHandler(io);

  server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
  });
}

main().catch((err) => {
  console.error('Error starting the application:', err);
});
