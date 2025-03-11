import User from '../../models/User.js';
import { AuthenticationError } from 'apollo-server-express';

const bookResolvers = {
  Mutation: {
    saveBook: async (_parent: any, { book }: { book: any }, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { savedBooks: book } },
        { new: true, runValidators: true }
      );

      return updatedUser;
    },

    deleteBook: async (_parent: any, { bookId }: { bookId: string }, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error("Couldn't find user with this ID!");
      }

      return updatedUser;
    },
  },
};

export default bookResolvers;
