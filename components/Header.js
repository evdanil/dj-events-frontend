import Link from 'next/link'
import Search from './Search'
import styles from '@/styles/Header.module.css'

function Header() {
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
          <li>
            <Link
              href='/events/add'
              legacyBehavior
            >
              <a>Add Event</a>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
