import Layout from '@/components/Layout'
import { API_URL } from '@/config/index'
import EventItem from '@/components/EventItem'
import Link from 'next/link'

export default function HomePage({ events }) {
  // console.log(events)
  // const events = props
  return (
    <Layout>
      <h1>Upcoming Events</h1>
      {events.length === 0 && <h3>No events to show</h3>}
      {events.map((evt) => (
        <EventItem
          key={evt.id}
          evt={evt}
        />
      ))}
      {events.length > 0 && (
        <Link
          legacyBehavior
          href='/events'
        >
          <a className='btn-secondary'>View All</a>
        </Link>
      )}
    </Layout>
  )
}

export async function getServerSideProps() {
  const res = await fetch(
    `${API_URL}/api/events?_sort=date:ASC&_limit=5&populate=*`
  )
  const data = await res.json()

  // const events = ''
  // console.log(data)
  const events = data.data.map((evt) => {
    return {
      ...evt.attributes,
      id: evt.id,
    }
  })
  // console.log(events)
  return {
    props: {
      events: events ? events : [],
    },
    // revalidate: 1,
  }
}
