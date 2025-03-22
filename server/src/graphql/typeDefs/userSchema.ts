import { gql } from 'graphql-tag';

export const userTypeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    bookCount: Int!
    savedBooks: [ID!]
  }

  type LoginResponse {
  token: String!
  user: User!
  }

  type Query {
    users: [User]          # Get all users
    getSingleUser(id: ID, username: String): User # Get a single user
  }

  type Mutation {
  createUser(username: String!, email: String!, password: String!): User
  saveBook(book: BookInput!): User
  deleteBook(bookId: ID!): User
  login(username: String, email: String, password: String!): LoginResponse
  }
`;
