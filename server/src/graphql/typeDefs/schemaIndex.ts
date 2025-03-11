import { gql } from 'graphql-tag';
import { bookTypeDefs } from './bookSchema.js';
import { userTypeDefs } from './userSchema.js';

export const typeDefs = gql`
  ${bookTypeDefs}
  ${userTypeDefs}
`;
