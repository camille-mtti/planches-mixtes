import Menu, { MenuProps } from 'antd/es/menu/menu';
import React, { useEffect, useState } from 'react';
import { Header as AntdHeader } from 'antd/es/layout/layout'
import { headerStyle, navigationMenuStyle } from './page.style';
import { Typography } from 'antd';
import { titleStyle } from '~/libs/style/global.styles';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '~/resources/routes-constants';


const tabs = [
  {
    label: 'Accueil',
    key: 'home',
  },
  {
    label: 'Planches',
    key: 'planches',
  },
  {
    label: 'Contact',
    key: 'contact',
  },
]

type routesKeys = 'home' | 'planches' | 'contact';
const routesMapper = {
  home: ROUTES.HOMEPAGE_ROUTE,
  planches: ROUTES.PLANCHES_ROUTE,
  contact: ROUTES.CONTACT_ROUTE,
}

export const Header = () => {
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState<routesKeys>('home');

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrentTab(e.key as routesKeys);
    navigate(routesMapper[e.key as routesKeys]);
  };



  return (
    <AntdHeader style={headerStyle}>
      <div onClick={() => { navigate('/') }}>
        <Typography.Title level={3} style={titleStyle}>planches-mixtes.com</Typography.Title>
      </div>

      <Menu style={navigationMenuStyle} onClick={onClick} selectedKeys={[currentTab]} mode="horizontal" items={tabs} />

    </AntdHeader >);
}