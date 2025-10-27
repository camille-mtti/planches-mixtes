import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import { ROUTES } from './resources/routes-constants'
import ConfigProvider from 'antd/es/config-provider'
import { COLORS, DEFAULT_FONT_FAMILY } from './libs/style/foundations'
import { PlancheDetail } from './pages/PlancheDetail/PlancheDetail'
import { PlancheRequestPage } from './pages/PlancheRequestPage/PlancheRequestPage'
import { PlancheList } from './pages/PlancheList/PlancheList'

const RootComponent: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: COLORS.PRIMARY_COLOR,
          fontFamily: DEFAULT_FONT_FAMILY,
        },
      }}
    >
      <Router>
        <Routes>
          <Route path="*" element={<NotFoundPage />} />
          <Route path={ROUTES.HOMEPAGE_ROUTE} element={<HomePage />} />
          <Route path={ROUTES.PLANCHE_DETAIL_ROUTE} element={<PlancheDetail />} />
          <Route path={ROUTES.REQUEST_ROUTE} element={<PlancheRequestPage />} />
          <Route path={ROUTES.PLANCHES_ROUTE} element={<PlancheList />} />
        </Routes>
      </Router>
    </ConfigProvider>
  )
}

export default RootComponent
