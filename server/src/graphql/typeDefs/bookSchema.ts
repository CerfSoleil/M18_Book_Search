import { gql } from 'graphql-tag';

export const bookTypeDefs = gql`
  type Book {
    bookId: ID!
    title: String!
    authors: [String]
    description: String!
    image: String
    link: String
  }

  input BookInput {
    bookId: ID!
    title: String!
    authors: [String]
    description: String!
    image: String
    link: String
  }
`;
