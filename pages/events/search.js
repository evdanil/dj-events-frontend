import Layout from '@/components/Layout'
import { API_URL } from '@/config/index'
import EventItem from '@/components/EventItem'
import qs from 'qs'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function SearchPage({ events }) {
  const router = useRouter()
  return (
    <Layout title='Search Results'>
      <Link href='/events'>Go Back</Link>
      <h1>Search Results for {router.query.term}</h1>
      {events.length === 0 && <h3>No events to show</h3>}
      {events.map((evt) => (
        <EventItem
          key={evt.id}
          evt={evt}
        />
      ))}
    </Layout>
  )
}

export async function getServerSideProps({ query: { term } }) {
  const query = qs.stringify({
    sort: ['date:ASC'],
    populate: '*',
    encodeValuesOnly: true,
    filters: {
      $or: [
        {
          name: {
            $containsi: term,
          },
        },
        {
          description: {
            $containsi: term,
          },
        },
        {
          slug: {
            $containsi: term,
          },
        },
        {
          address: {
            $containsi: term,
          },
        },
        {
          venue: {
            $containsi: term,
          },
        },
        {
          perfomers: {
            $containsi: term,
          },
        },
      ],
    },
  })
  // console.log(query)
  const res = await fetch(`${API_URL}/api/events?${query}`)
  const data = await res.json()
  const events = data.data.map((evt) => {
    return {
      ...evt.attributes,
      id: evt.id,
    }
  })
  return {
    props: { events },
    // revalidate: 1,
  }
}
