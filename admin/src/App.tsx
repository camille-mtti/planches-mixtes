import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import RestaurantsList from './pages/Restaurants/List'
import RestaurantCreatePage from './pages/Restaurants/Create'
import RestaurantEditPage from './pages/Restaurants/Edit'
import PlanchesList from './pages/Planches/List'
import PlancheCreatePage from './pages/Planches/Create'
import PlancheEditPage from './pages/Planches/Edit'
import IngredientsList from './pages/Ingredients/List'
import IngredientCreatePage from './pages/Ingredients/Create'
import IngredientEditPage from './pages/Ingredients/Edit'
import { AuthGuard } from './auth/AuthGuard'

const { Header, Content } = Layout

const Nav: React.FC = () => {
  const location = useLocation()
  let selected: string[] = []
  if (location.pathname.startsWith('/restaurants')) selected = ['restaurants']
  if (location.pathname.startsWith('/planches')) selected = ['planches']
  if (location.pathname.startsWith('/ingredients')) selected = ['ingredients']

  return (
    <Header style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <Menu mode="horizontal" selectedKeys={selected} style={{ borderBottom: 'none' }}>
        <Menu.Item key="restaurants"><Link to="/restaurants">Restaurants</Link></Menu.Item>
        <Menu.Item key="planches"><Link to="/planches">Planches</Link></Menu.Item>
        <Menu.Item key="ingredients"><Link to="/ingredients">Ingrédients</Link></Menu.Item>
      </Menu>
    </Header>
  )
}

export const App: React.FC = () => {
  return (
    <AuthGuard>
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Nav />
          <Content style={{ padding: 24 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/restaurants" replace />} />
              <Route path="/restaurants" element={<RestaurantsList />} />
              <Route path="/restaurants/create" element={<RestaurantCreatePage />} />
              <Route path="/restaurants/:id/edit" element={<RestaurantEditPage />} />

              <Route path="/planches" element={<PlanchesList />} />
              <Route path="/planches/create" element={<PlancheCreatePage />} />
              <Route path="/planches/:id/edit" element={<PlancheEditPage />} />

              <Route path="/ingredients" element={<IngredientsList />} />
              <Route path="/ingredients/create" element={<IngredientCreatePage />} />
              <Route path="/ingredients/:id/edit" element={<IngredientEditPage />} />

              <Route path="*" element={<Navigate to="/restaurants" replace />} />
            </Routes>
          </Content>
        </Layout>
      </Router>
    </AuthGuard>
  )
}

export default App