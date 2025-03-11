import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// Create an HTTP link to connect to the backend GraphQL endpoint
const httpLink = new HttpLink({
  uri: 'http://localhost:3001/graphql', 
  headers: {
    authorization: localStorage.getItem('id_token') ? `Bearer ${localStorage.getItem('id_token')}` : '',
  },
});

// Create the Apollo Client instance with the link and cache configuration
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
