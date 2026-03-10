import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'node:http';
import cors from 'cors';
import { config } from './config/index.js';
import { prisma } from './prisma.js';
import { typeDefs, resolvers } from './graphql/index.js';
import { formatError } from './middleware/formatError.js';
import { authMiddleware } from './middleware/auth.js';
import { AuthService } from './services/AuthService.js';
import type { AppContext } from './types.js';

const authService = new AuthService();

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer<AppContext>({
    typeDefs,
    resolvers,
    formatError,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>({ origin: config.clientUrl, credentials: true }),
    express.json(),
    authMiddleware,
    expressMiddleware(server, {
      context: async ({ req }) => {
        let user: AppContext['user'] = null;

        if (req.authUser) {
          user = await authService.findOrCreateUser(
            req.authUser.uid,
            req.authUser.email ?? '',
            req.authUser.displayName ?? '',
          );
        }

        return { prisma, user };
      },
    }),
  );

  httpServer.listen({ port: config.port }, () => {
    console.log(`Server ready at http://localhost:${config.port}/graphql`);
  });

  const shutdown = async () => {
    console.log('\nShutting down gracefully...');
    await server.stop();
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
