import Menu, { MenuProps } from 'antd/es/menu/menu'
import React, { useEffect, useState } from 'react'
import { Header as AntdHeader } from 'antd/es/layout/layout'
import { Typography } from 'antd'
import { titleStyle } from '~/libs/style/global.styles'
import { useNavigate, useLocation } from 'react-router-dom'
import { ROUTES } from '~/resources/routes-constants'
import { COLORS } from '~/libs/style/foundations'
import './Header.css'


export const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingLeft: '48px',
  paddingRight: '48px',
  backgroundColor: 'white',
  width: '100%',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  borderBottom: `2px solid ${COLORS.PRIMARY_COLOR}`,
};


type routesKeys =  'planches' | 'request'
const tabs: {label: string, key: routesKeys}[] = [
  {
    label: 'Planches',
    key: 'planches',
  },
  {
    label: 'Proposer une planche',
    key: 'request',
  },
]

const routesMapper = {
  home: ROUTES.HOMEPAGE_ROUTE,
  planches: ROUTES.PLANCHES_ROUTE,
  request: ROUTES.REQUEST_ROUTE,
}

const routeToKey = (path: string): routesKeys => {
  if (path === ROUTES.PLANCHES_ROUTE) return 'planches'
  if (path === ROUTES.REQUEST_ROUTE) return 'request'
  return 'planches'
}

export const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [currentTab, setCurrentTab] = useState<routesKeys>('planches')

  // Update current tab when route changes
  useEffect(() => {
    setCurrentTab(routeToKey(location.pathname))
  }, [location.pathname])

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrentTab(e.key as routesKeys)
    navigate(routesMapper[e.key as routesKeys])
  }

  return (
    <AntdHeader style={headerStyle}>
      <div
        style={{
          width: '300px', 
          display: 'flex', 
          justifyContent: 'flex-start', 
          alignItems: 'center', 
          gap: 12, 
          cursor: 'pointer',
          paddingLeft: '8px'
        }}
        onClick={() => {
          navigate('/')
        }}
      >
        <img src='/img/logo.png' alt='logo' style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
        <Typography.Text strong style={{ fontSize: '18px', color: COLORS.PRIMARY_COLOR }}>
          Planches Mixtes
        </Typography.Text>
      </div>

      <Menu 
        onClick={onClick} 
        selectedKeys={[currentTab]} 
        mode="horizontal" 
        items={tabs}
        className="custom-header-menu"
        style={{
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: 'transparent',
          border: 'none',
          lineHeight: '64px',
          width: '100%',
        }}
        theme="light"
      />
      <div style={{ width: '300px' }} />
    </AntdHeader>
  )
}
