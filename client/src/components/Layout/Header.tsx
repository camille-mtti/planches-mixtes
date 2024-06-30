import Menu, { MenuProps } from 'antd/es/menu/menu'
import React, { useEffect, useState } from 'react'
import { Header as AntdHeader } from 'antd/es/layout/layout'
import { Typography } from 'antd'
import { titleStyle } from '~/libs/style/global.styles'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '~/resources/routes-constants'
import { COLORS } from '~/libs/style/foundations'


export const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingLeft: '48px',
  paddingRight: '48px',
  backgroundColor: COLORS.BACKGROUND_COLOR,
  width: '100%',
};

export const navigationMenuStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center', // Horizontally center the items
  backgroundColor: 'transparent',
  alignItems: 'center',
};

type routesKeys = 'home' | 'planches' | 'request'
const tabs: {label: string, key: routesKeys}[] = [
  {
    label: 'Accueil',
    key: 'home',
  },
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

export const Header = () => {
  const navigate = useNavigate()

  const [currentTab, setCurrentTab] = useState<routesKeys>('home')

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrentTab(e.key as routesKeys)
    navigate(routesMapper[e.key as routesKeys])
  }

  return (
    <AntdHeader style={headerStyle}>
      <div
      style={{width: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, cursor: 'pointer'}}
        onClick={() => {
          navigate('/')
        }}
      >
        <img src='/img/logo.png' alt='logo' style={{ width: '80px' }} />
        <Typography.Text>planches-mixtes.com</Typography.Text>
      </div>

      <Menu style={navigationMenuStyle} onClick={onClick} selectedKeys={[currentTab]} mode="horizontal" items={tabs} />
      <div  style={{width: '300px'}}/>
    </AntdHeader>
  )
}
