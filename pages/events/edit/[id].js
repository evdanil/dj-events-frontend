import Layout from '@/components/Layout'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { API_URL } from '@/config/index'
import styles from '@/styles/Form.module.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Image from 'next/image'
import { FaImage } from 'react-icons/fa'
import Modal from '@/components/Modal'
import ImageUpload from '@/components/ImageUpload'
import { parseCookies } from '@/helpers/index'

function EditEventPage({ evt, token }) {
  const router = useRouter()

  const [values, setValues] = useState({
    name: evt.name,
    perfomers: evt.perfomers,
    venue: evt.venue,
    address: evt.address,
    date: evt.date,
    time: evt.time,
    description: evt.description,
  })

  const [imagePreview, setImagePreview] = useState(
    evt.image ? evt.image.url : null
  )

  const [showModal, setShowModal] = useState(false)

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
    const res = await fetch(`${API_URL}/api/events/${evt.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: body,
    })
    // console.log(res)
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        toast.error('No token included or unauthorized')
        return
      }
      toast.error('Something went wrong')
    } else {
      const evt = await res.json()
      // console.log(evt)
      router.push(`/events/${evt.data.attributes.slug}`)
    }
  }

  const imageUploaded = async (e) => {
    const res = await fetch(`${API_URL}/api/events/${evt.id}?populate=*`)
    const data = await res.json()
    // console.log(data)
    setImagePreview(
      data.data.attributes.image.data.attributes.formats.thumbnail.url
    )
    setShowModal(false)
  }

  return (
    <Layout title='Edit Event'>
      <Link href='/events'>Go Back</Link>
      <h1>Edit Event</h1>
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
          value='Update Event'
          className='btn'
        />
      </form>
      <h2>Event Image</h2>
      {imagePreview ? (
        <Image
          src={imagePreview}
          alt={imagePreview}
          height={100}
          width={170}
        />
      ) : (
        <div>
          <p>No Image uploaded</p>
        </div>
      )}

      <div>
        <button
          onClick={() => setShowModal(true)}
          className='btn-secondary'
        >
          <FaImage />
          Set Image
        </button>
      </div>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
      >
        <ImageUpload
          evtId={evt.id}
          imageUploaded={imageUploaded}
          token={token}
        />
      </Modal>
    </Layout>
  )
}

export async function getServerSideProps({ params: { id }, req }) {
  const { token } = parseCookies(req)
  const res = await fetch(`${API_URL}/api/events/${id}?populate=*`)
  const evt = await res.json()
  // console.log(evt)
  let result = {}
  if (res.ok) {
    result = {
      id: evt.data.id,
      description: evt.data.attributes.description[0].children[0].text,
      name: evt.data.attributes.name,
      slug: evt.data.attributes.slug,
      venue: evt.data.attributes.venue,
      address: evt.data.attributes.address,
      date: evt.data.attributes.date
        ? evt.data.attributes.date.slice(0, 10)
        : new Date.now().toString(),
      time: evt.data.attributes.time,
      perfomers: evt.data.attributes.perfomers,
      createdAt: evt.data.attributes.createdAt,
      image: {
        // ...evt.image,
        url: evt.data.attributes.image.data
          ? evt.data.attributes.image.data.attributes.formats.thumbnail.url
          : '/images/event-default.png',
        name: evt.data.attributes.image.data
          ? evt.data.attributes.image.data.attributes.name
          : 'empty_img',
      },
    }
  }
  // console.log(req.headers.cookie)
  return {
    props: {
      token,
      evt: result,
    },
  }
}
export default EditEventPage
