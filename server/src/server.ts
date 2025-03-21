import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from 'path';
import dotenv from 'dotenv';

import db from './config/connection.js';
import { typeDefs } from './graphql/typeDefs/schemaIndex.js';
import resolvers from './graphql/resolvers/resolversIndex.js';
import { authMiddleware } from './services/auth.js';

import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  try {
    await server.start();
    console.log('Apollo Server started successfully.');
    
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.use(
      '/graphql',
      expressMiddleware(server, {
        context: async ({ req }) => authMiddleware({ req }),
      })
    );

    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../client/dist')));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
      });
    }

    db.once('open', () => console.log('MongoDB connected successfully.'));
    db.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });

    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

startApolloServer();
