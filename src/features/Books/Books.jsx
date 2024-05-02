import { useEffect } from 'react';
import { useState } from 'react';
import Container from '../../components/Container/Container';
import { useAuthContext } from '../Auth/AuthContext';
import BooksGrid from './BooksGrid';
import { useBookApi } from './useBookApi';

import './Books.css'

export function Books(){
    // const { user } = useAuthContext();
    // console.log("userrr", user)
    const { data: books } = useBookApi();
    

    useEffect(() => {
        // GetBooks().then((newBooks) => setBooks(newBooks));
        console.log("books", books)
    },[]);


    return (
        <div className='big-container'>
            <h1 className='title'>The Books from your library</h1>
            <Container>
                
                {/* <label htmlFor="searchBooks"></label> */}
                {/* <input type="search" id="searchBooks" /> */}
                

                <BooksGrid books = {books}/>
            </Container>
        </div>
    )
}