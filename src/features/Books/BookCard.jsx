import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';


export function BookCard({book}){
    return (
    <Card bg="#ceaaa0">
        <Card.Img variant="top" src={book.cover} height="450px"/>
        
        <Card.Body>
            <Card.Title>{book.title}</Card.Title>
            <Card.Subtitle>by {book.author}</Card.Subtitle>
            <hr/>
            <Card.Text style={{height: '100px', ['overflow-y']: 'scroll'}}>
                {book.description}
            </Card.Text>
            <hr/>
            <Link to={`${book.id}`}>
                View Book
            </Link>
        </Card.Body>
    </Card>)
}