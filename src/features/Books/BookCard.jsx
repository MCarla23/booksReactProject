import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

function transformDate(date){
    const newDate = new Date(date);
    const day = newDate.getDate();
    const month = newDate.getMonth() + 1;
    const year = newDate.getFullYear();
  
    return `${day}.${month}.${year}`;
}

export function BookCard({book}){
    return (
    <Card bg="#ceaaa0">
        <Card.Img variant="top" src={book.cover} />
        
        <Card.Body>
            <Card.Title>{book.title} by {book.author}</Card.Title>
            <Card.Text>
                {book.description}
            </Card.Text>
            <hr/>
            {/* <Card.Subtitle>
                ISBN: {book.isbn}
            </Card.Subtitle>
            <Card.Subtitle>
                Published: {transformDate(book.datePublished)}
            </Card.Subtitle> */}
            <Link to={`${book.id}`}>
                View Book
            </Link>
        </Card.Body>
    </Card>)
}