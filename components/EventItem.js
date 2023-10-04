import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/EventItem.module.css'

function EventItem({ evt }) {
  return (
    <div className={styles.event}>
      <div className={styles.img}>
        <Image
          alt={evt.image.data.attributes.name}
          src={
            evt.image
              ? evt.image.data.attributes.formats.thumbnail.url
              : '/images/event-default.png'
          }
          width={170}
          height={100}
          priority={false}
        />
      </div>
      <div className={styles.info}>
        <span>
          {new Date(evt.date).toLocaleDateString('en-AU')} at {evt.time}
        </span>
        <h3>{evt.name}</h3>
      </div>
      <div className={styles.link}>
        <Link
          legacyBehavior
          href={`/events/${evt.slug}`}
        >
          <a
            alt='${evt.slug}'
            href=''
            className='btn'
          >
            Details
          </a>
        </Link>
      </div>
    </div>
  )
}

export default EventItem
