import Layout from '@/components/Layout'
import { API_URL, PER_PAGE } from '@/config/index'
import EventItem from '@/components/EventItem'
import Pagination from '@/components/Pagination'

export default function EventsPage({ events, page, total }) {
  return (
    <Layout>
      <h1>Events</h1>
      {events.length === 0 && <h3>No events to show</h3>}
      {events.map((evt) => (
        <EventItem
          key={evt.id}
          evt={evt}
        />
      ))}

      <Pagination
        page={page}
        total={total}
      />
    </Layout>
  )
}

export async function getServerSideProps({ query: { page = 1 } }) {
  // Calculate start page
  const start = +page === 1 ? 0 : (+page - 1) * PER_PAGE

  // Fetch events
  const eventRes = await fetch(
    `${API_URL}/api/events?sort=date:ASC&populate=*&pagination[limit]=${PER_PAGE}&pagination[start]=${start}`
  )
  const data = await eventRes.json()
  // console.log(data)
  const total = data.meta.pagination.total
  const events = data.data.map((evt) => {
    return {
      ...evt.attributes,
      id: evt.id,
    }
  })
  // console.log(events)
  return {
    props: { events, page: +page, total },
  }
}
