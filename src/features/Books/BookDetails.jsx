import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuthContext } from '../Auth/AuthContext';
import { useBookApi } from './useBookApi';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { date, object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { getApi } from "../../utils/api";

function transformDate(date){
    const newDate = new Date(date);
    let day = newDate.getDate();
    let month = newDate.getMonth() + 1;
    const year = newDate.getFullYear();
    if(month < 10) month = '0'+month;
    if(day < 10) day = '0'+day;
    return `${year}-${month}-${day}`;
}

function BreadcrumbPage({book, category}) {
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/books">All books</Breadcrumb.Item>
      <Breadcrumb.Item href={`/books${category && '?category='+category?.id}`}>{category?.name}</Breadcrumb.Item>
      <Breadcrumb.Item href={`/books/${book?.id}`}>{book.title}</Breadcrumb.Item>
    </Breadcrumb>
  );
}

const managementScheme = object({
    title: string().required('Please provide the title of the book.'),
    author: string().required('Please name the authors of the book.'),
    isbn: string().required('The ISBN of the book is required.').min(13,'The ISBN of the book must have 13 characters.').max(13,'The ISBN of the book must have 13 characters.'),
    description: string().required('Please provide the description of the book.').min(50, 'The description is too short.'),
    datePublished: date().typeError('Please select a valid date').required('Please select the date this book was published.'),
    cover: string().required('Please provide the image url.'),
});

const { get: getCategories } = getApi('categories');

export function BookDetails(){
    const { id } = useParams();
    const { state } = useLocation();
    const { data: book, related, deleteBook, updateBook } = useBookApi(id);
    const navigate = useNavigate();
    const [edit, setEdit] = useState(false);
    
    async function handleDelete(e) {
        await deleteBook();
        const path = state?.from ?? '/';
        navigate('/books');
    }


    const {register, handleSubmit, formState: {errors}, reset} = useForm({resolver: yupResolver(managementScheme)});
    async function onSubmit(values) {
        const data = await updateBook(values).then(() => setEdit(!edit));
        navigate(path);
    }
    const [categories, setCategories] = useState(null);
    useEffect(() => {
        getCategories().then((data) => setCategories(data));
    }, []);



    if (!book) {
        return <strong>Loading ...</strong>;
    }

    return (
        <div className='center-container'>
            <BreadcrumbPage book={book} category={related?.categories[0]}/>
            <div className='book-details'>
                { edit == false &&
                    <img src={book.cover} width="250px"/>
                }
                

                <div className="details-container">
                    { edit == false &&
                        <>
                            <h1>{book.title}</h1>
                            <h2>by {book.author}</h2>
                            <h3>
                                {related.categories?.length == 1 ? 'Category: ' : 'Categories: '} 
                                {
                                  related.categories.map((categ, index) => {
                                    if(index == related.categories.length - 1)
                                        return categ.name;
                                    return categ.name + ', ';
                                  })
                                }
                            </h3>
                            <Card.Text>
                                {book.description}
                            </Card.Text>
                            <hr/>
                            <Card.Subtitle>
                                ISBN: {book.isbn}
                            </Card.Subtitle>
                            <Card.Subtitle>
                                Published: {transformDate(book.datePublished)}
                            </Card.Subtitle>
                            <div className='buttons-container'>
                                <Button variant="success" onClick={() => setEdit(!edit)}>Edit book</Button>
                                <Button variant="danger" onClick={() => handleDelete()}>Delete book</Button>
                            </div>
                        </>
                    }
                    
                    { edit == true &&
                        <>
                            <h1>Add a book</h1>
                            <form className="brandForm" onSubmit={handleSubmit(onSubmit)}>
                
                                <label htmlFor="isbn">ISBN: </label>
                                <input type="text" id="isbn" {...register('isbn')} defaultValue={book.isbn}/>
                                {errors.isbn && (
                                    <p className="secondColumn fieldError">{errors.isbn.message}</p>
                                )}
                
                                <label htmlFor="title">Book title: </label>
                                <input type="text" id="title" {...register('title')} defaultValue={book.title}/>
                                {errors.title && (
                                    <p className="secondColumn fieldError">{errors.title.message}</p>
                                )}
                
                                <label htmlFor="author">Author: </label>
                                <input type="text" id="author" {...register('author')} defaultValue={book.author}/>
                                {errors.author && (
                                    <p className="secondColumn fieldError">{errors.author.message}</p>
                                )}
                
                                
                                <span>Categories</span>
                                <section>
                                    {categories?.map((cat) => {
                                        const isChecked = related.categories.map(c => c.id).includes(cat.id);
                                        return(
                                            <label key={cat.id}>
                                                { isChecked == true &&
                                                    <input type="checkbox" value={cat.id} {...register('categories')} checked/>
                                                }
                                                { isChecked == false &&
                                                    <input type="checkbox" value={cat.id} {...register('categories')}/>
                                                }
                                                {cat.name}
                                            </label>
                                        )
                                    })}
                                </section>
                
                                <label htmlFor="description">Description: </label>
                                <textarea type="text" id="description" {...register('description')} defaultValue={book.description}/>
                                {errors.description && (
                                    <p className="secondColumn fieldError">{errors.description.message}</p>
                                )}
                
                                <label htmlFor="cover">Book cover: </label>
                                <input type="text" id="cover" {...register('cover')} defaultValue={book.cover}/>
                                {errors.cover && (
                                    <p className="secondColumn fieldError">{errors.cover.message}</p>
                                )}
                
                                <label htmlFor="datePublished">Date published: </label>
                                <input type="date" id="datePublished" {...register('datePublished')} defaultValue={transformDate(book.datePublished)}/>
                                {errors.datePublished && (
                                    <p className="secondColumn fieldError">{errors.datePublished.message}</p>
                                )}
                                <div className='buttons-container'>
                                    <Button variant="success" type="submit" onClick={handleSubmit(onSubmit)}>Save Changes</Button>
                                    <Button variant="danger" onClick={() => setEdit(!edit)}>Cancel</Button>
                                </div>
                            </form>
                            
                        </>
                        
                    }
                </div>
                
                
            </div>
        </div>    
    );
}