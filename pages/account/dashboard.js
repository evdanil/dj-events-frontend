import Layout from '@/components/Layout'
import { API_URL } from '@/config/index'
import { parseCookies } from '@/helpers/index'

function DashboardPage({ events }) {
  console.log(events)
  return (
    <Layout>
      <h1>Dashboard</h1>
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
    props: { events },
  }
}
