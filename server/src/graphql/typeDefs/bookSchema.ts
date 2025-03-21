import { gql } from 'graphql-tag';

export const bookTypeDefs = gql`
  type Book {
    id: ID!
    title: String!
    authors: [String]
    description: String!
    image: String
    link: String
  }

  input BookInput {
    id: ID!
    title: String!
    authors: [String]
    description: String!
    image: String
    link: String
  }
`;
