import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

import styles from './Nav.module.css';
import { useAuthContext } from '../../features/Auth/AuthContext';

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
      <menu>
        <li>
          <BrandNavLink to="/">Home</BrandNavLink>
        </li>
        <li>
          <BrandNavLink to="books">See books</BrandNavLink>
        </li>
        <li>
          <BrandNavLink to="addbook">New book</BrandNavLink>
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