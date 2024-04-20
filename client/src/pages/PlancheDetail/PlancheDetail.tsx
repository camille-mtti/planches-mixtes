import { COLORS, TYPOGRAPHY } from '~/libs/style/foundations'
import { cards } from '../HomePage/cards.mock'
import EnvironmentOutlined from '@ant-design/icons/lib/icons/EnvironmentOutlined'
import { CalendarOutlined, LaptopOutlined, PhoneOutlined } from '@ant-design/icons'
import { TileLayer, Marker, MapContainer } from 'react-leaflet'
import { Image } from 'antd'

import 'leaflet/dist/leaflet.css'
import { Page } from '~/components/Layout/Page'
import { useQuery } from '@apollo/client'
import { FetchPlancheByIdResponse, fetchPlancheById } from '~/api/database/planches'
import { useNavigate, useParams } from 'react-router-dom'
import { LoadingPage } from '../LoadingPage/LoadingPage'
import { useMemo } from 'react'
import { formatIngredientsListByType } from '~/api/database/ingredients.mapper'
import { PLANCHE_CATEGORY_MAP, PlancheCategoryKeys } from '~/api/database/plancheCategory.mapper'


export const PlancheDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate();

  const { loading, data, error } = useQuery<FetchPlancheByIdResponse>(fetchPlancheById({ id: id ? parseInt(id) : 0 }))

  const currentPlanche = data?.planches[0]
  const ingredients = useMemo(() => formatIngredientsListByType(currentPlanche?.planches_ingredients) || {}, [data])

  if (loading) {
    return <LoadingPage />
  }


  if (error || data === undefined || !currentPlanche) {
    navigate('/');
    return null;
  }

  return (
    <Page>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 3fr)',
        }}
      >

        <div
          style={{
            backgroundColor: COLORS.PRIMARY_COLOR,
            color: COLORS.TEXT_COLOR_LIGHT,
            ...TYPOGRAPHY.TITLE,
            height: '100%',
            padding: '16px',
          }}
        >
          <h1>{currentPlanche.restaurant.name}</h1>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 6fr)',
              placeItems: 'center',
              justifyItems: 'start',
              gap: '8px',
            }}
          >
            <EnvironmentOutlined />
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => {
                window.open('https://maps.app.goo.gl/Dkm3uy5ZRCBwbS4N7', '_blank')
              }}
            >
              {currentPlanche.restaurant.address} <br />
              {currentPlanche.restaurant.zipcode}, {currentPlanche.restaurant.city}
            </div>

            {currentPlanche.restaurant.phone_number && (
              <>
                <PhoneOutlined />
                <div>{currentPlanche.restaurant.phone_number}</div>
              </>)}

            {currentPlanche.restaurant.website && (
              <>
                <LaptopOutlined />
                <div
                  onClick={() => {
                    window.open(currentPlanche.restaurant.website, '_blank')
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {currentPlanche.restaurant.website}
                </div>
              </>
            )
            }{currentPlanche.restaurant.opening_hours && (
              <>
                <CalendarOutlined />
                <div>{currentPlanche.restaurant.opening_hours}</div>
              </>)}
          </div>

          <MapContainer
            style={{ maxWidth: '25vw', minWidth: '10vw', maxHeight: '50vh', minHeight: '40vh', marginTop: '16px' }}
            center={[currentPlanche.restaurant.latitude, currentPlanche.restaurant.longitude]}
            zoom={15}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[currentPlanche.restaurant.latitude, currentPlanche.restaurant.longitude]} />
          </MapContainer>
        </div>

        <div
          style={{
            backgroundColor: COLORS.BACKGROUND_COLOR,
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            paddingTop: '16px',
            paddingBottom: '16px',
          }}
        >
          <Image width={450} height={600} src={cards[0].image} preview={false} />
          <h1 style={TYPOGRAPHY.H1}>{currentPlanche.name || currentPlanche.restaurant.name}</h1>
          <div style={TYPOGRAPHY.SUB_TITLE}>
            {PLANCHE_CATEGORY_MAP[currentPlanche.category as PlancheCategoryKeys]}, {currentPlanche.price} € pour {currentPlanche.number_people} personnes
          </div>
          <div>Visité le {currentPlanche.visit_date}</div>

          <ul>
            Composition :
            {Object.entries(ingredients).map(([ingredientType, ingredients]) => (
              <li key={ingredientType}>
                {ingredientType} : {ingredients.join(', ')}
              </li>
            ))}
          </ul>

        </div>
      </div>
    </Page>
  )
}
