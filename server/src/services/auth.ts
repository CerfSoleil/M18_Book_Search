import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';  // Ensure the User model is correctly imported

dotenv.config();

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string;
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

// This will be used in Apollo's context
export const authMiddleware = async ({ req }: { req: any }) => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];  // Extract token (after "Bearer")

    try {
      const secretKey = process.env.JWT_SECRET_KEY || '';
      const decoded = jwt.verify(token, secretKey) as JwtPayload;

      // Attach the user data to the request object
      req.user = await User.findById(decoded._id);

      // If no user is found, throw an AuthenticationError
      if (!req.user) {
        throw new AuthenticationError('Authentication failed, user not found');
      }

    } catch (err) {
      throw new AuthenticationError('Invalid or expired token');
    }
  } else {
    throw new AuthenticationError('No token provided');
  }

  return req;  // Return req with user attached for GraphQL resolvers to use
};

// Function to sign the token (already provided in your code)
export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1d' });
};
