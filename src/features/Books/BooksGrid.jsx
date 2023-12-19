import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { BookCard } from './BookCard';


function BooksGrid({books}) {

  return (
    <Row xs={2} md={2} className="g-4">
      {books?.map((book, idx) => (
        <Col key={book.id}>
          <BookCard book={book}/>
        </Col>
      ))}
    </Row>
  );
}

export default BooksGrid;