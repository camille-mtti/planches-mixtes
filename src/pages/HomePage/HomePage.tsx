import React from 'react'
import { PlancheCard } from '~/components/PlancheCard/PlancheCard'
import { Page } from '~/components/Layout/Page'
import { cards } from './cards.mock'
import { useQuery } from '@apollo/client'
import { fetchPlanches } from '~/api/database/planches'

const HomePage: React.FC = () => {
    const { loading, error, data } = useQuery(fetchPlanches())
    return (
        <Page>
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    margin: '20px'
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        gap: '20px'
                    }}
                >
                    {cards.map(({ id, name, plancheCategory, price, date, image, location }) => (
                        <PlancheCard key={id} id={id} title={name} category={plancheCategory} price={price} date={date} image={image} location={location} />
                    ))}
                </div>
            </div>
        </Page>
    )
}

export default HomePage
