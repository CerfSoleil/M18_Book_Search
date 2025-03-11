import { gql } from '@apollo/client';
import client from '../apollo/apolloClient.js'; 
import { User } from '../models/User.js';
import { Book } from '../models/Book.js';
import { CREATE_USER, LOGIN_USER, SAVE_BOOK, DELETE_BOOK } from './mutations.js'; // Import from mutations.ts

// Query to get the logged-in user's information (no changes here)
export const GET_ME = gql`
  query getMe {
    me {
      _id
      username
      email
    }
  }
`;

export const getMe = async (token: string) => {
  try {
    const result = await client.query({
      query: GET_ME,
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    });
    return result.data.me;  // Access the user data from the response
  } catch (err) {
    console.error(err);
    throw new Error('Failed to fetch user data');
  }
};

// Use the imported CREATE_USER mutation here
export const createUser = async (userData: User) => {
  try {
    const result = await client.mutate({
      mutation: CREATE_USER,
      variables: { userData },
    });
    return result.data.createUser;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to create user');
  }
};

// Use the imported LOGIN_USER mutation here
export const loginUser = async (userData: User) => {
  try {
    const result = await client.mutate({
      mutation: LOGIN_USER,
      variables: { userData },
    });
    return result.data.login.token;  // Access the token from the response
  } catch (err) {
    console.error(err);
    throw new Error('Failed to login user');
  }
};

// Use the imported SAVE_BOOK mutation here
export const saveBook = async (bookData: Book, token: string) => {
  try {
    const result = await client.mutate({
      mutation: SAVE_BOOK,
      variables: { bookData },
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    });
    return result.data.saveBook;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to save book');
  }
};

// Use the imported DELETE_BOOK mutation here
export const deleteBook = async (bookId: string, token: string) => {
  try {
    const result = await client.mutate({
      mutation: DELETE_BOOK,
      variables: { bookId },
      context: {
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    });
    return result.data.deleteBook;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to delete book');
  }
};

// Function to search Google Books API (no changes here)
export const searchGoogleBooks = (query: string) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};
