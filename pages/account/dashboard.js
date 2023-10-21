import Layout from '@/components/Layout'
import { API_URL } from '@/config/index'
import { parseCookies } from '@/helpers/index'
import DashboardEvent from '@/components/DashboardEvent'
import styles from '@/styles/Dashboard.module.css'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/router'

function DashboardPage({ events, token }) {
  const router = useRouter()
  const deleteEvent = async (id) => {
    if (confirm('Are you sure?')) {
      const res = await fetch(`${API_URL}/api/events/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      // console.log(res)
      try {
        // const data = await res.json()
        if (!res.ok) {
          toast.error(res.statusText)
          // console.log('NOT OK!')
        } else {
          router.reload()
        }
      } catch (error) {
        toast.error(error)
      }
    }
  }

  return (
    <Layout title='User Dashboard'>
      <div className={styles.dash}>
        <h1>Dashboard</h1>
        <h3>My Events</h3>

        {events.map((evt) => (
          <>
            {/* {console.log(evt)} */}
            <DashboardEvent
              key={evt.id}
              evt={evt}
              handleDelete={deleteEvent}
            />
          </>
        ))}
      </div>
    </Layout>
  )
}

export default DashboardPage

export async function getServerSideProps({ req }) {
  const { token } = parseCookies(req)

  const res = await fetch(`${API_URL}/api/me/events`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const events = await res.json()

  return {
    props: { events, token },
  }
}
