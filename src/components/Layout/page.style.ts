import { COLORS } from '~/libs/style/foundations'

export const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 3fr)',
  paddingLeft: '48px',
  paddingRight: '48px',
  backgroundColor: COLORS.BACKGROUND_COLOR,
}

export const navigationMenuStyle: React.CSSProperties = {
  display: 'flex',
  backgroundColor: 'transparent',
  alignItems: 'center',
  placeSelf: 'center stretch',
}

export const titleStyle: React.CSSProperties = {
  margin: '0',
  lineHeight: '64px',
  alignSelf: 'start',
}

export const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: '120vh',
  lineHeight: '120px',
}

export const footerStyle: React.CSSProperties = {
  textAlign: 'center',
}

export const layoutStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
}
