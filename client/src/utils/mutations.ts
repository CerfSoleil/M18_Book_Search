import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation createUser($userData: UserInput!) {
    createUser(userData: $userData) {
      _id
      username
      email
    }
  }
`;

export const LOGIN_USER = gql`
  mutation loginUser($userData: UserInput!) {
    login(userData: $userData) {
      token
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBook($bookData: BookInput!) {
    saveBook(bookData: $bookData) {
      _id
      title
      author
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation deleteBook($bookId: ID!) {
    deleteBook(bookId: $bookId) {
      _id
    }
  }
`;

export const SEARCH_GOOGLE_BOOKS = gql`
  query searchBooks($searchQuery: String!) {
    searchBooks(searchquery: $searchQuery) {
      id
      volumeInfo {
        title
        authors
        description
        imageLinks {
          smallThumbnail
          thumbnail
        }
      }
    }
  }
`;