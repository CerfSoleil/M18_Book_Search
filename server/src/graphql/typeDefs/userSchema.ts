import { gql } from 'graphql-tag';

export const userTypeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    bookCount: Int!
    savedBooks: [Book]
  }

  type Query {
    users: [User]          # Get all users
    user(id: ID!): User    # Get a single user by ID
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): User
    saveBook(userId: ID!, book: BookInput!): User
    removeBook(userId: ID!, bookId: ID!): User
  }
`;
