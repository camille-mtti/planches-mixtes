import Layout, { Content } from 'antd/es/layout/layout'
import React from 'react'
import { Header } from './Header'
import { contentStyle, footerStyle, layoutStyle } from './page.style'
import { Footer } from './Footer'

type PageProps = {
  children: React.ReactNode
}
export const Page = ({ children }: PageProps) => {
  return (
    <Layout style={layoutStyle}>
      <Header />
      {children}
      <Footer />
    </Layout>
  )
}
