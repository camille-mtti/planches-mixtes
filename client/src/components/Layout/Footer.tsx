import {Footer as OriginalFooter} from 'antd/es/layout/layout'
import { footerStyle } from './page.style'
import { Affix } from 'antd'

export const Footer = ()=>{
  return (
    <Affix offsetBottom={0}>
    <OriginalFooter style={footerStyle}>
      <div>Projet de Camille Marchetti et Henry Matheisen</div>
      <div>planches-mixtes.com ou le site qui recense les planches mixtes parisiennes</div>
      <div>Planches végétariennes à venir ...</div>
    </OriginalFooter>
    </Affix>
  )
}