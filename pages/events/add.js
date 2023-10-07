import Layout from '@/components/Layout'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { API_URL } from '@/config/index'
import styles from '@/styles/Form.module.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function AddEventPage() {
  const [values, setValues] = useState({
    name: '',
    perfomers: '',
    venue: '',
    address: '',
    date: '',
    time: '',
    description: '',
  })

  const router = useRouter()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    const hasEmptyFields = Object.values(values).some(
      (element) => element === ''
    )
    if (hasEmptyFields) {
      toast.error('Please fill in all fields')
      return
    }
    const body = JSON.stringify({
      data: {
        ...values,
        description: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: values.description,
              },
            ],
          },
        ],
      },
    })
    // console.log('BODY:' + body)
    const res = await fetch(`${API_URL}/api/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    })
    console.log(res)
    if (!res.ok) {
      toast.error('Something went wrong')
    } else {
      const evt = await res.json()
      console.log(evt)
      router.push(`/events/${evt.data.attributes.slug}`)
    }
  }

  return (
    <Layout title='Add New Event'>
      <Link href='/events'>Go Back</Link>
      <h1>Add Event</h1>
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className={styles.form}
      >
        <div className={styles.grid}>
          <div>
            <label htmlFor='name'>Event Name</label>
            <input
              type='text'
              id='name'
              name='name'
              value={values.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='perfomers'>Performers</label>
            <input
              type='text'
              name='perfomers'
              id='perfomers'
              value={values.perfomers}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='venue'>Venue</label>
            <input
              type='text'
              name='venue'
              id='venue'
              value={values.venue}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='address'>Address</label>
            <input
              type='text'
              name='address'
              id='address'
              value={values.address}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='date'>Date</label>
            <input
              type='date'
              name='date'
              id='date'
              value={values.date}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='time'>Time</label>
            <input
              type='text'
              name='time'
              id='time'
              value={values.time}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor='description'>Event Description</label>
          <textarea
            name='description'
            id='description'
            type='text'
            value={values.description}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <input
          type='submit'
          value='Add Event'
          className='btn'
        />
      </form>
    </Layout>
  )
}

export default AddEventPage
