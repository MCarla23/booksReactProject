import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

import styles from './Nav.module.css';
import { useAuthContext } from '../../features/Auth/AuthContext';
import sigla from '../../images/sigla.svg'

function BrandNavLink({ children, ...props }) {
  return (
    <NavLink
      {...props}
      className={({ isActive }) =>
        clsx(styles.navLink, { [styles.active]: isActive })
      }
    >
      {children}
    </NavLink>
  );
}

export function Nav() {
  const { user, logout } = useAuthContext();
  return (
    <nav className={styles.mainMenu}>
      <img src={sigla} className={styles.sigla}/>
      <menu>
        <li>
          <BrandNavLink to="/">Pricing</BrandNavLink>
        </li>
        <li>
          <BrandNavLink to="books">Books</BrandNavLink>
        </li>
        <li>
          <BrandNavLink to="addbook">About Us</BrandNavLink>
        </li>
        
        {user === null && (
          <>
            <li className={styles.pushRight}>
              <BrandNavLink to="login">Login</BrandNavLink>
            </li>
            <li>
              <BrandNavLink to="register">Register</BrandNavLink>
            </li>
          </>
        )}

        

        {user && (
          <li className={styles.pushRight}>
            Welcome,<BrandNavLink to="profile">{user.firstName}!</BrandNavLink>{' '}
            <a
              href="#"
              className={styles.navLink}
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}
            >
              Logout
            </a>
          </li>
        )}
      </menu>
    </nav>
  );
}