import userResolvers from './userResolvers.js';
import bookResolvers from './bookResolvers.js';

const resolvers = {
  Query: {
    ...userResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...bookResolvers.Mutation,
  },
};

export default resolvers;
