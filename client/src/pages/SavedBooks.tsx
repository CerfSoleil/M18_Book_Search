import { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/API.js'; // Import query to get user data
import { DELETE_BOOK } from '../utils/mutations'; // Import mutation for deleting a book
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import type { User } from '../models/User';

const SavedBooks = () => {
  // State to manage user data
  const [userData, setUserData] = useState<User>({
    username: '',
    email: '',
    password: '',
    savedBooks: [],
  });

  // Use Apollo's useQuery hook to fetch user data
  const { data, loading, error } = useQuery(GET_ME, {
    context: {
      headers: {
        authorization: `Bearer ${Auth.getToken()}`, // Authorization header with token
      },
    },
  });

  // Apollo's useMutation for deleteBook
  const [deleteBookMutation] = useMutation(DELETE_BOOK);

  // Update the userData state with the fetched data
  useEffect(() => {
    if (data && data.me) {
      setUserData(data.me);
    }
  }, [data]);

  // Handle book deletion
  const handleDeleteBook = async (bookId: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) return false;

    try {
      // Call Apollo's deleteBook mutation
      const { data } = await deleteBookMutation({
        variables: { bookId },
        context: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      });

      if (data.deleteBook) {
        // Remove the book from the user data after successful deletion
        setUserData((prevState) => ({
          ...prevState,
          savedBooks: prevState.savedBooks.filter((book) => book.bookId !== bookId),
        }));

        // Remove book's id from localStorage
        removeBookId(bookId);
      }
    } catch (err) {
      console.error('Error deleting book:', err);
    }
  };

  // If data is loading, show loading state
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  // If there's an error fetching the data
  if (error) {
    return <h2>Something went wrong!</h2>;
  }

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          {userData.username ? (
            <h1>Viewing {userData.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md='4'>
                <Card key={book.bookId} border='dark'>
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant='top'
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className='btn-block btn-danger'
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
