import Link from 'next/link'
import Search from './Search'
import styles from '@/styles/Header.module.css'
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa'
import AuthContext from '@/context/AuthContext'
import { useContext } from 'react'

function Header() {
  const { user, logout } = useContext(AuthContext)
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href='/'>DJ Events</Link>
      </div>
      <Search />
      <nav>
        <ul>
          <li>
            <Link href='/events'>Events</Link>
          </li>
          {user ? (
            <>
              {/* If logged in we also need to show log out button */}
              <li>
                <Link
                  href='/events/add'
                  legacyBehavior
                >
                  <a>Add Event</a>
                </Link>
              </li>
              {/* Dashboard link */}
              <li>
                <Link
                  href='/account/dashboard'
                  legacyBehavior
                >
                  <a>Dashboard</a>
                </Link>
              </li>
              <li>
                <a
                  className='btn-secondary btn-icon'
                  onClick={() => logout()}
                >
                  <FaSignOutAlt />
                  Logout
                </a>
              </li>
            </>
          ) : (
            <>
              {/* If logged out we show login and dont show add events */}
              <li>
                <Link
                  href='/account/login'
                  legacyBehavior
                >
                  <a className='btn-secondary btn-icon'>
                    <FaSignInAlt />
                    Login
                  </a>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Header
