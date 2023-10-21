import Image from 'next/image'
import { useState, useEffect } from 'react'
// import ReactMapGl, { Marker } from 'react-map-gl'
import Map, { Marker } from 'react-map-gl'
// import maplibregl from 'maplibre-gl'
// import 'maplibre-gl/dist/maplibre-gl.css'

import 'mapbox-gl/dist/mapbox-gl.css'
import {
  setKey,
  setDefaults,
  setLanguage,
  setRegion,
  fromAddress,
  fromLatLng,
  fromPlaceId,
  setLocationType,
  geocode,
  RequestType,
} from 'react-geocode'

function EventMap({ evt }) {
  const [lat, setLat] = useState(null)
  const [lng, setLng] = useState(null)
  const [loading, setLoading] = useState(true)
  const [viewport, setViewport] = useState({
    latitude: 37.5777,
    longitude: -122.4,
    // width: '100%',
    // height: '500px',
    zoom: 12,
  })

  useEffect(() => {
    fromAddress(evt.address).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location
        setLat(lat)
        setLng(lng)
        setViewport({ ...viewport, latitude: lat, longitude: lng })
        setLoading(false)
      },
      (error) => {
        console.log(error)
      }
    )
  }, [])

  setKey(process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY)
  if (loading) return false
  // console.log(lat, lng)
  console.log(viewport)
  // console.log(process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN)
  return (
    <Map
      // maplib={maplibregl}
      initialViewState={{
        ...viewport,
      }}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
      // onViewportChange={(vp) => setViewport(vp)}
      style={{ width: '100%', height: 500 }}
      mapStyle='mapbox://styles/mapbox/satellite-streets-v12'
    >
      <Marker
        key={evt.id}
        latitude={lat}
        longitude={lng}
      >
        <Image
          src='/images/pin.svg'
          width={30}
          height={30}
        />
      </Marker>
    </Map>
  )
}

export default EventMap
