import React, { useState, useMemo } from 'react'
import { Page } from '~/components/Layout/Page'
import { useQuery } from '@apollo/client'
import { fetchPlanchesWithIngredients } from '~/api/database/planches'
import { PlancheCard } from '~/components/PlancheCard/PlancheCard'
import { Input, Select, Row, Col, Typography, Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { LoadingPage } from '../LoadingPage/LoadingPage'
import { PLANCHE_CATEGORY_MAP, PlancheCategoryKeys } from '~/api/database/plancheCategory.mapper'
import { COLORS } from '~/libs/style/foundations'

const { Title } = Typography
const { Option } = Select

type PlancheWithIngredients = {
  id: number
  name: string
  price: number
  number_people: number
  visit_date: string
  planche_category: {
    name: PlancheCategoryKeys
  }
  restaurant: {
    name: string
    city: string
    address: string
  }
  planche_images: {
    url: string
    is_default: boolean
  }[]
  planches_ingredients: {
    ingredient: {
      name: string
      ingredient_type: {
        name: string
      }
    }
  }[]
}

type FetchPlanchesWithIngredientsResponse = {
  planches: PlancheWithIngredients[]
}

export const PlancheList = () => {
  const [nameSearch, setNameSearch] = useState('')
  const [ingredientSearch, setIngredientSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')

  const { loading, error, data } = useQuery<FetchPlanchesWithIngredientsResponse>(fetchPlanchesWithIngredients())

  const filteredPlanches = useMemo(() => {
    if (!data?.planches) return []

    return data.planches.filter((planche) => {
      // Filter by name
      const nameMatch = !nameSearch || 
        planche.name.toLowerCase().includes(nameSearch.toLowerCase()) ||
        planche.restaurant.name.toLowerCase().includes(nameSearch.toLowerCase())

      // Filter by ingredient
      const ingredientMatch = !ingredientSearch ||
        planche.planches_ingredients.some(pi => 
          pi.ingredient.name.toLowerCase().includes(ingredientSearch.toLowerCase())
        )

      // Filter by category
      const categoryMatch = !categoryFilter || 
        planche.planche_category.name === categoryFilter

      return nameMatch && ingredientMatch && categoryMatch
    })
  }, [data?.planches, nameSearch, ingredientSearch, categoryFilter])

  // Get unique ingredients for the ingredient search dropdown
  const allIngredients = useMemo(() => {
    if (!data?.planches) return []
    
    const ingredientSet = new Set<string>()
    data.planches.forEach(planche => {
      planche.planches_ingredients.forEach(pi => {
        ingredientSet.add(pi.ingredient.name)
      })
    })
    
    return Array.from(ingredientSet).sort()
  }, [data?.planches])

  if (loading) {
    return <LoadingPage />
  }

  if (error) {
    return (
      <Page>
        <Title level={2}>Erreur lors du chargement des planches</Title>
      </Page>
    )
  }

  return (
    <Page>
      <div style={{ 
        padding: '40px 20px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Hero Section */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '60px',
          paddingTop: '40px'
        }}>
          <Title level={1} style={{ 
            marginBottom: '16px',
            fontSize: '48px',
            fontWeight: 700,
            color: COLORS.PRIMARY_COLOR
          }}>
            Découvrez les Meilleures Planches Mixtes
          </Title>
          <Typography.Text style={{ 
            fontSize: '20px',
            color: COLORS.SECONDARY_COLOR,
            display: 'block',
            marginBottom: '32px'
          }}>
            Explorez notre collection de planches authentiques dans les meilleurs restaurants
          </Typography.Text>
        </div>

        {/* Search and Filter Section - Improved Design */}
        <div style={{ 
          marginBottom: '50px',
          padding: '32px',
          background: 'linear-gradient(135deg, #3d5913 0%, #5a7a1f 100%)',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(61, 89, 19, 0.2)'
        }}>
          <Title level={3} style={{ 
            color: 'white', 
            marginBottom: '24px',
            fontWeight: 600
          }}>
            🔍 Trouvez votre planche idéale
          </Title>
          
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={8}>
              <Input
                size="large"
                placeholder="Nom de la planche ou restaurant..."
                prefix={<SearchOutlined style={{ color: '#3d5913' }} />}
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)}
                allowClear
                style={{ 
                  borderRadius: '8px',
                  backgroundColor: 'white'
                }}
              />
            </Col>
            
            <Col xs={24} sm={24} md={8}>
              <Select
                size="large"
                placeholder="Rechercher par ingrédient..."
                value={ingredientSearch}
                onChange={setIngredientSearch}
                allowClear
                showSearch
                style={{ width: '100%' }}
                filterOption={(input, option) =>
                  (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                }
              >
                {allIngredients.map(ingredient => (
                  <Option key={ingredient} value={ingredient}>
                    {ingredient}
                  </Option>
                ))}
              </Select>
            </Col>

            <Col xs={24} sm={24} md={8}>
              <Select
                size="large"
                placeholder="Toutes les catégories"
                value={categoryFilter}
                onChange={setCategoryFilter}
                allowClear
                style={{ width: '100%' }}
              >
                {Object.entries(PLANCHE_CATEGORY_MAP).map(([key, value]) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
        </div>

        {/* Results Section - Improved Design */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px'
          }}>
            <Title level={3} style={{ margin: 0, color: COLORS.PRIMARY_COLOR }}>
              {filteredPlanches.length} {filteredPlanches.length !== 1 ? 'planches trouvées' : 'planche trouvée'}
            </Title>
          </div>

          {filteredPlanches.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '80px 40px',
              background: COLORS.BACKGROUND_COLOR,
              borderRadius: '16px'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
              <Title level={3} style={{ color: COLORS.SECONDARY_COLOR, marginBottom: '8px' }}>
                Aucune planche trouvée
              </Title>
              <Typography.Text style={{ color: COLORS.TEXT_COLOR }}>
                Essayez de modifier vos critères de recherche
              </Typography.Text>
            </div>
          ) : (
            <Row gutter={[24, 24]}>
              {filteredPlanches.map((planche) => {
              // Find primary image or use first image
              const primaryImage = planche.planche_images?.find(img => img.is_default) || planche.planche_images?.[0]
              const imageUrl = primaryImage?.url || '/img/logo.png'
              
              return (
                <Col key={planche.id} xs={24} sm={12} md={8} lg={8}>
                  <PlancheCard
                    id={planche.id}
                    title={planche.name}
                    category={PLANCHE_CATEGORY_MAP[planche.planche_category.name]}
                    price={`${planche.price}€`}
                    date={planche.visit_date}
                    image={imageUrl}
                    location={`${planche.restaurant.name}, ${planche.restaurant.city}`}
                  />
                </Col>
              )
            })}
            </Row>
          )}
        </div>
      </div>
    </Page>
  )
}

export default PlancheList
