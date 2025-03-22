import User from '../../models/User.js';
import { signToken } from '../../services/auth.js';
import { AuthenticationError } from 'apollo-server-express';

const userResolvers = {
  Query: {
    getSingleUser: async (_parent: any, { id, username }: { id?: string; username?: string }, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }

      const foundUser = await User.findOne({
        $or: [{ _id: id }, { username }],
      });

      if (!foundUser) {
        throw new Error('Cannot find a user with this ID or username!');
      }

      return foundUser;
    },
  },

  Mutation: {
    createUser: async (_parent: any, { username, email, password }: { username: string; email: string; password: string }) => {
      const user = await User.create({ username, email, password });

      if (!user) {
        throw new Error('Something went wrong!');
      }

      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    login: async (_parent: any, { username, email, password }: { username?: string; email?: string; password: string }) => {
      const user = await User.findOne({ $or: [{ username }, { email }] });

      if (!user) {
        throw new AuthenticationError("Can't find this user");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Wrong password!');
      }

      const token = signToken(user.username, user.password, user._id);
      return { token, user };
    },
  },
};

export default userResolvers;
