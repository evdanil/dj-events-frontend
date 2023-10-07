import Layout from '@/components/Layout'
import Link from 'next/link'
import Image from 'next/image'
import { FaPencilAlt, FaTimes } from 'react-icons/fa'
import { API_URL } from '@/config/index'
import styles from '@/styles/Event.module.css'
import { useRouter } from 'next/router'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function EventPage({ evt }) {
  // console.log(evt)
  const router = useRouter()
  const deleteEvent = async (e) => {
    if (confirm('Are you sure?')) {
      const res = await fetch(`${API_URL}/api/events/${evt.id}`, {
        method: 'DELETE',
      })
      // console.log(res)
      try {
        // const data = await res.json()
        if (!res.ok) {
          toast.error(res.statusText)
          // console.log('NOT OK!')
        } else {
          router.push('/events')
        }
      } catch (error) {
        toast.error(error)
      }
    }
  }

  return (
    <Layout>
      {JSON.stringify(evt) !== '{}' && (
        <>
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
            <ToastContainer />
            {evt.image && (
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
        </>
      )}
      {JSON.stringify(evt) === '{}' && (
        <div className={styles.event}>
          <h1>Cannot find event, sorry!</h1>
          <Link
            href='/events'
            legacyBehavior
          >
            <a className={styles.back}>{'<'} Go Back</a>
          </Link>
        </div>
      )}
    </Layout>
  )
}

// export async function getStaticPaths() {
//   const res = await fetch(`${API_URL}/api/events?populate=*`)
//   const data = await res.json()
//   const events = data.data.map((evt) => {
//     return {
//       ...evt.attributes,
//       id: evt.id,
//     }
//   })
//   const paths = events.map((evt) => ({
//     params: { slug: evt.slug },
//   }))
//   return {
//     paths,
//     fallback: true,
//   }
// }
// export async function getStaticProps({ params: { slug } }) {
//   const res = await fetch(
//     `${API_URL}/api/events?filters[slug][$eq]=${slug}&populate=*`
//   )
//   const data = await res.json()
//   const events = data.data.map((evt) => {
//     return {
//       id: evt.id,
//       description: evt.attributes.description[0].children[0].text,
//       name: evt.attributes.name,
//       slug: evt.attributes.slug,
//       venue: evt.attributes.venue,
//       address: evt.attributes.address,
//       date: evt.attributes.date,
//       time: evt.attributes.time,
//       perfomers: evt.attributes.perfomers,
//       createdAt: evt.attributes.createdAt,
//       image: {
//         url: evt.attributes.image.data.attributes.formats.medium.url,
//         name: evt.attributes.image.data.attributes.name,
//       },
//     }
//   })

//   return {
//     props: {
//       evt: events[0],
//     },
//     revalidate: 1,
//   }
// }

export async function getServerSideProps({ params: { slug } }) {
  const res = await fetch(
    `${API_URL}/api/events?filters[slug][$eq]=${slug}&populate=*`
  )
  const data = await res.json()
  let events = []
  // console.log(data.data)
  // console.log('SLUG DATA:' + data.data)

  // if
  // console.log('DATA.len=' + data.data.length)
  if (data.data.length !== 0) {
    events = data.data.map((evt) => {
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
          ...evt.image,
          url: evt.attributes.image.data
            ? evt.attributes.image.data.attributes.formats.medium.url
            : '/images/event-default.png',
          name: evt.attributes.image.data
            ? evt.attributes.image.data.attributes.name
            : 'empty_img',
        },
      }
    })
  } else {
    events[0] = {}
  }
  // console.log('SLUG EVENTS:' + events)

  return {
    props: {
      evt: events[0],
      // evt: [],
    },
  }
}
export default EventPage
