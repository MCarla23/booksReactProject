import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { date, object, string } from "yup";
import { useState } from "react";
import { useBookApi } from "./useBookApi";
import Container from "../../components/Container/Container";
import { getApi } from "../../utils/api";
import { useEffect } from "react";


const managementScheme = object({
    title: string().required('Please provide the title of the book.'),
    author: string().required('Please name the authors of the book.'),
    isbn: string().required('The ISBN of the book is required.').min(13,'The ISBN of the book must have 13 characters.').max(13,'The ISBN of the book must have 13 characters.'),
    description: string().required('Please provide the description of the book.').min(50, 'The description is too short.'),
    datePublished: date().typeError('Please select a valid date').required('Please select the date this book was published.'),
    cover: string().required('Please provide the image url.'),
});

const { get: getCategories } = getApi('categories');

export function AddBookForm(){
    const {register, handleSubmit, formState: {errors}, reset} = useForm({resolver: yupResolver(managementScheme)});

    const { addBook } = useBookApi(null, false);

    async function onSubmit(values) {
        console.log("values:", values);
        const data = await addBook(values);
        console.log(data);
    }

    const [categories, setCategories] = useState(null);
    useEffect(() => {
        getCategories().then((data) => setCategories(data));
    }, []);

    
    
    return (
        <Container>
            <h1>Add a book</h1>
            <form className="brandForm" noValidate onSubmit={handleSubmit(onSubmit)}>

                <label htmlFor="isbn">ISBN: </label>
                <input type="text" id="isbn" {...register('isbn')}/>
                {errors.isbn && (
                    <p className="secondColumn fieldError">{errors.isbn.message}</p>
                )}

                <label htmlFor="title">Book title: </label>
                <input type="text" id="title" {...register('title')}/>
                {errors.title && (
                    <p className="secondColumn fieldError">{errors.title.message}</p>
                )}

                <label htmlFor="author">Author: </label>
                <input type="text" id="author" {...register('author')}/>
                {errors.author && (
                    <p className="secondColumn fieldError">{errors.author.message}</p>
                )}

                
                <span>Categories</span>
                <section>
                    {categories?.map((cat) => (
                    <label key={cat.id}>
                        <input type="checkbox" value={cat.id} {...register('categories')} />
                        {cat.name}
                    </label>
                    ))}
                </section>

                <label htmlFor="description">Description: </label>
                <textarea type="text" id="description" {...register('description')}/>
                {errors.description && (
                    <p className="secondColumn fieldError">{errors.description.message}</p>
                )}

                <label htmlFor="cover">Book cover: </label>
                <input type="text" id="cover" {...register('cover')}/>
                {errors.cover && (
                    <p className="secondColumn fieldError">{errors.cover.message}</p>
                )}

                <label htmlFor="datePublished">Date published: </label>
                <input type="date" id="datePublished" {...register('datePublished')}/>
                {errors.datePublished && (
                    <p className="secondColumn fieldError">{errors.datePublished.message}</p>
                )}

                <button type="submit" className="secondColumn defBtn">
                    Add Book
                </button>
            </form>
        </Container>
    )
}