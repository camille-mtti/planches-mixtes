import { Footer as OriginalFooter } from 'antd/es/layout/layout'
import { Typography } from 'antd'
import { COLORS } from '~/libs/style/foundations'

const footerStyle: React.CSSProperties = {
  backgroundColor: COLORS.PRIMARY_COLOR,
  color: 'white',
  textAlign: 'center',
  padding: '40px 48px',
  borderTop: `3px solid ${COLORS.ACCENT_COLOR}`,
}

export const Footer = () => {
  return (
    <OriginalFooter style={footerStyle}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Typography.Title level={4} style={{ color: 'white', marginBottom: '16px' }}>
          Planches Mixtes Parisiennes
        </Typography.Title>
        <div style={{ marginBottom: '12px', opacity: 0.9 }}>
          Projet de Camille Marchetti et Henry Matheisen
        </div>
        <div style={{ marginBottom: '12px', opacity: 0.9 }}>
          Le site qui recense les meilleures planches mixtes de Paris
        </div>
        <div style={{ opacity: 0.7 }}>
          Planches végétariennes à venir... 🥬
        </div>
      </div>
    </OriginalFooter>
  )
}