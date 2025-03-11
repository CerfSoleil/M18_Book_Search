import express from 'express';
import path from 'node:path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import db from './config/connection.js';  // Database connection
import { typeDefs } from './graphql/typeDefs/schemaIndex.js';  // Type definitions
import resolvers from './graphql/resolvers/resolversIndex.js'; // Resolvers
import dotenv from 'dotenv';
import { authMiddleware } from './services/auth.js';  // Import the authentication middleware

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start Apollo Server and apply middleware
const startServer = async () => {
  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        await authMiddleware({ req });
      }
    })
  );

  db.once('open', () => {
    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}/graphql`));
  });
};

startServer();
