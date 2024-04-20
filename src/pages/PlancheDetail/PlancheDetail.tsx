
import { COLORS, TYPOGRAPHY } from "~/libs/style/foundations"
import { cards } from "../HomePage/cards.mock"
import EnvironmentOutlined from "@ant-design/icons/lib/icons/EnvironmentOutlined"
import { CalendarOutlined, LaptopOutlined, PhoneOutlined } from "@ant-design/icons"
import { TileLayer, Marker, MapContainer } from "react-leaflet";
import { Image, Typography } from "antd";

import 'leaflet/dist/leaflet.css';
import { Page } from "~/components/Layout/Page";
import { useQuery } from "@apollo/client";
import { fetchPlancheById } from "~/api/database/planches";
import { useParams } from "react-router-dom";

const card = cards[0]


export const PlancheDetail = () => {
  const { id } = useParams();

  const { loading, data, error } = useQuery(fetchPlancheById({ id: id ? parseInt(id) : undefined }))
  console.log(data)
  const { name, plancheCategory, price, date, image, location, nbPersonnes } = card
  return (
    <Page>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 3fr)',
      }}>
        <div style={{
          backgroundColor: COLORS.PRIMARY_COLOR,
          color: COLORS.TEXT_COLOR_LIGHT,
          ...TYPOGRAPHY.TITLE,
          height: '100%',
          padding: '16px',
        }}>
          <h1>{card.name}</h1>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 6fr)',
            placeItems: 'center',
            justifyItems: 'start',
            gap: '8px',
          }}>

            <EnvironmentOutlined />
            <div style={{ cursor: 'pointer' }} onClick={() => { window.open('https://maps.app.goo.gl/Dkm3uy5ZRCBwbS4N7', '_blank') }}>
              102 rue Blomet <br />
              75015 Paris
            </div>

            <PhoneOutlined />
            <div>09 54 20 66 97</div>

            <LaptopOutlined />
            <div onClick={() => { window.open('https://leblomet-restaurant.fr/', '_blank') }} style={{ cursor: 'pointer' }}>
              https://leblomet-restaurant.fr/
            </div>

            <CalendarOutlined />
            <div>Lun à Sam 7h-23h, Dim 8h-23h</div>


          </div>

          <MapContainer style={{ maxWidth: '25vw', minWidth: '10vw', maxHeight: '50vh', minHeight: '40vh', marginTop: '16px' }} center={[48.84096908569336, 2.300666332244873]} zoom={15} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[48.84096908569336, 2.300666332244873]} />
          </MapContainer>


        </div>

        <div style={{
          backgroundColor: COLORS.BACKGROUND_COLOR,
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          paddingTop: '16px',
          paddingBottom: '16px',
        }}>
          <Image width={450} height={600} src={card.image} preview={false} />
          <h1 style={TYPOGRAPHY.H1}>{name}</h1>
          <div style={TYPOGRAPHY.SUB_TITLE}>{plancheCategory}, {price} pour {nbPersonnes} personnes</div>
          <div>Visité le {date}</div>
          <p>Composition :
            <ul>
              <li>Charcuteries : Jambon blanc, Chorizo, Jambon fumé, Rosette, Terrine de campagne</li>
              <li>Fromages : Cantal, Bleu d’auvergne, Saint Nectaire, Rocamadour</li>
              <li>Cornichons</li>
              <li>Beurre salé</li>
            </ul>
          </p>
        </div>
      </div>
    </Page>
  )
}