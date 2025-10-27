import React, { useState, useMemo } from 'react'
import { Page } from '~/components/Layout/Page'
import { useQuery } from '@apollo/client'
import { fetchPlanchesWithIngredients } from '~/api/database/planches'
import { PlancheCard } from '~/components/PlancheCard/PlancheCard'
import { Input, Select, Row, Col, Typography, Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { LoadingPage } from '../LoadingPage/LoadingPage'
import { PLANCHE_CATEGORY_MAP, PlancheCategoryKeys } from '~/api/database/plancheCategory.mapper'

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
      <div style={{ padding: '20px' }}>
        <Title level={1} style={{ textAlign: 'center', marginBottom: '40px' }}>
          Liste des Planches
        </Title>

        {/* Search and Filter Section */}
        <div style={{ 
          marginBottom: '40px', 
          padding: '20px', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '8px' 
        }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <label>Rechercher par nom :</label>
                <Input
                  placeholder="Nom de la planche ou restaurant"
                  prefix={<SearchOutlined />}
                  value={nameSearch}
                  onChange={(e) => setNameSearch(e.target.value)}
                  allowClear
                />
              </Space>
            </Col>
            
            <Col xs={24} sm={12} md={8}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <label>Rechercher par ingrédient :</label>
                <Select
                  placeholder="Sélectionner un ingrédient"
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
              </Space>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <label>Filtrer par catégorie :</label>
                <Select
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
              </Space>
            </Col>
          </Row>
        </div>

        {/* Results Section */}
        <div>
          <Title level={3}>
            {filteredPlanches.length} planche{filteredPlanches.length !== 1 ? 's' : ''} trouvée{filteredPlanches.length !== 1 ? 's' : ''}
          </Title>

          {filteredPlanches.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Title level={4}>Aucune planche ne correspond à vos critères de recherche</Title>
            </div>
          ) : (
            <Row gutter={[20, 20]}>
              {filteredPlanches.map((planche) => {
              // Find primary image or use first image
              const primaryImage = planche.planche_images?.find(img => img.is_default) || planche.planche_images?.[0]
              const imageUrl = primaryImage?.url || '/img/logo.png'
              
              return (
                <Col key={planche.id} xs={24} sm={12} md={8} lg={6}>
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
