import Menu, { MenuProps } from 'antd/es/menu/menu';
import React, { useState } from 'react';
import { Header as AntdHeader } from 'antd/es/layout/layout'
import { headerStyle, navigationMenuStyle } from './page.style';
import { Typography } from 'antd';
import { titleStyle } from '~/libs/style/global.styles';


const tabs = [
  {
    label: 'Accueil',
    key: 'accueil',
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

export const Header = () => {

  const [currentTab, setCurrentTab] = useState<string>('accueil');

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrentTab(e.key);
  };

  return (
    <AntdHeader style={headerStyle}>
      <Typography.Title level={3} style={titleStyle}>planches-mixtes.com</Typography.Title>

      <Menu style={navigationMenuStyle} onClick={onClick} selectedKeys={[currentTab]} mode="horizontal" items={tabs} />
      <div />
    </AntdHeader >);
}