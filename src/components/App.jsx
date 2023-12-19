import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { 
  AddBookForm, 
  BookDetails, 
  Books,
  Profile,
  Home,
  Auth,
  AuthContextProvider,
  RequireAuth,
  NotFound
} from '../features';
import { Nav } from './Nav/Nav';
import './App.css';



export function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Auth />} />
          <Route path="register" element={<Auth />} />
          <Route path="profile" element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            />
          <Route path="addbook" element={<AddBookForm />} />
          <Route path="books" element={<Books/>} />
          <Route path="books/:id" element={<BookDetails/>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </AuthContextProvider>
  );
}