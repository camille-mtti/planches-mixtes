import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import { ROUTES } from './resources/routes-constants'
import ConfigProvider from 'antd/es/config-provider'
import { COLORS, DEFAULT_FONT_FAMILY } from './libs/style/foundations'
import { PlancheDetail } from './pages/PlancheDetail/PlancheDetail'

const RootComponent: React.FC = () => {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorBgBase: COLORS.BACKGROUND_COLOR,
                    colorPrimary: COLORS.PRIMARY_COLOR,
                    fontFamily: DEFAULT_FONT_FAMILY
                }
            }}
        >
            <Router>
                <Routes>
                    <Route path="*" element={<NotFoundPage />} />
                    <Route path={ROUTES.HOMEPAGE_ROUTE} element={<HomePage />} />
                    <Route path={ROUTES.PLANCHE_DETAIL_ROUTE} element={<PlancheDetail />} />
                </Routes>
            </Router>
        </ConfigProvider>
    )
}

export default RootComponent
