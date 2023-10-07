import Link from 'next/link'
import { PER_PAGE } from '../config'

function Pagination({ page, total }) {
  const lastPage = Math.ceil(total / PER_PAGE)
  return (
    <>
      {page > 1 && (
        <Link
          legacyBehavior
          href={`/events?page=${page - 1}`}
        >
          <a className='btn-secondary'>Prev</a>
        </Link>
      )}
      {page < lastPage && (
        <Link
          legacyBehavior
          href={`/events?page=${page + 1}`}
        >
          <a className='btn-secondary'>Next</a>
        </Link>
      )}
    </>
  )
}

export default Pagination
