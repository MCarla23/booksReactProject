import { Card } from 'react-bootstrap';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { useNavigate, useParams } from 'react-router-dom';
import Container from '../../components/Container/Container';
import { useAuthContext } from '../Auth/AuthContext';
import { useBookApi } from './useBookApi';
import Button from 'react-bootstrap/Button';
import { BookCard } from './BookCard';
import { useState } from 'react';

function BreadcrumbPage({title}) {
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/books">All books</Breadcrumb.Item>
      <Breadcrumb.Item active>{title}</Breadcrumb.Item>
    </Breadcrumb>
  );
}


export function BookDetails(){
    const { id } = useParams();
    const { data: book, related, deleteBook } = useBookApi(id);
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [edit, setEdit] = useState(false);

    async function handleDelete() {
        await deleteBook();
        navigate('/books');
      }

      if (!book) {
        return <strong>Loading ...</strong>;
      }

    return (
        <>
            <BreadcrumbPage title={book.title}/>
            <Container classNames='book-details'>
                <BookCard book={book}/>
                { edit == false &&
                    <div className='buttons-container'>
                        <Button variant="success" onClick={() => setEdit(!edit)}>Edit book</Button>
                        <Button variant="danger">Delete book</Button>
                    </div>
                }
                
                { edit == true &&
                    <div className='buttons-container'>
                        <Button variant="success" onClick={() => setEdit(!edit)}>Save Changes</Button>
                        <Button variant="danger" onClick={() => setEdit(!edit)}>Cancel</Button>
                    </div>
                }
            </Container>
        </>
        
        
    );
}