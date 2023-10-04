import Layout from '@/components/Layout'
import Link from 'next/link'
import Image from 'next/image'
import { FaPencilAlt, FaTimes } from 'react-icons/fa'
import { API_URL } from '@/config/index'
import styles from '@/styles/Event.module.css'

function EventPage({ evt }) {
  const deleteEvent = (e) => {
    console.log('delete')
  }
  return (
    <Layout>
      <div className={styles.event}>
        <div className={styles.controls}>
          <Link
            href={`/events/edit/${evt.id}`}
            legacyBehavior
          >
            <a>
              <FaPencilAlt /> Edit Event
            </a>
          </Link>
          <a
            href='#'
            className={styles.delete}
            onClick={deleteEvent}
          >
            <FaTimes /> Delete Event
          </a>
        </div>
        <span>
          {new Date(evt.date).toLocaleDateString('en-AU')} at {evt.time}
        </span>
        <h1>{evt.name}</h1>
        {evt.image.url && (
          <div className={styles.image}>
            <Image
              alt={evt.image.name}
              src={evt.image.url}
              width={960}
              height={600}
              priority={true}
            />
          </div>
        )}
        <h3>Performers</h3>
        <p>{evt.perfomers}</p>
        <h3>Description</h3>
        <p>{evt.description}</p>
        <h3>Venue: {evt.venue}</h3>
        <p>{evt.address}</p>
        <Link
          href='/events'
          legacyBehavior
        >
          <a className={styles.back}>{'<'} Go Back</a>
        </Link>
      </div>
    </Layout>
  )
}

export async function getStaticPaths() {
  const res = await fetch(`${API_URL}/api/events?populate=*`)
  const data = await res.json()
  const events = data.data.map((evt) => {
    return {
      ...evt.attributes,
      id: evt.id,
    }
  })
  const paths = events.map((evt) => ({
    params: { slug: evt.slug },
  }))
  return {
    paths,
    fallback: true,
  }
}
export async function getStaticProps({ params: { slug } }) {
  const res = await fetch(
    `${API_URL}/api/events?filters[slug][$eq]=${slug}&populate=*`
  )
  const data = await res.json()
  const events = data.data.map((evt) => {
    return {
      id: evt.id,
      description: evt.attributes.description[0].children[0].text,
      name: evt.attributes.name,
      slug: evt.attributes.slug,
      venue: evt.attributes.venue,
      address: evt.attributes.address,
      date: evt.attributes.date,
      time: evt.attributes.time,
      perfomers: evt.attributes.perfomers,
      createdAt: evt.attributes.createdAt,
      image: {
        url: evt.attributes.image.data.attributes.formats.medium.url,
        name: evt.attributes.image.data.attributes.name,
      },
    }
  })

  return {
    props: {
      evt: events[0],
    },
    revalidate: 1,
  }
}

// export async function getServerSideProps({ query: { slug } }) {
//   const res = await fetch(`${API_URL}/api/events/${slug}`)
//   const events = await res.json()
//   return {
//     props: { evt: events[0] },
//   }
// }
export default EventPage
