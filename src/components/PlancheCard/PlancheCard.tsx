import { Image, Typography } from 'antd'
import { titleStyle } from '../Layout/page.style'
import { TYPOGRAPHY } from '~/libs/style/foundations'
import { useNavigate } from 'react-router-dom'

type CardProps = {
    title: string
    category: string
    price: string
    date: string
    image: string
    location: string
    id: number
}
export const PlancheCard = ({ id, title, category, price, date, image, location }: CardProps) => {
    const navigate = useNavigate()
    return (
        <div
            style={{
                gap: '20px',
                height: '650px',
                width: '300px',
                cursor: 'pointer'
            }}
            onClick={() => navigate(`/planches/${id}`)}
            tabIndex={0}
        >
            {' '}
            <div
                style={{
                    width: '350',
                    height: '450',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                }}
            >
                <Image width={350} height={450} src={image} preview={false} />
            </div>
            <h4 style={TYPOGRAPHY.TITLE}>{title}</h4>
            <div style={TYPOGRAPHY.SUB_TITLE}>
                {category}, {price}{' '}
            </div>
            <div style={TYPOGRAPHY.SUB_TITLE}>
                {location} - {date}
            </div>
        </div>
    )
}
