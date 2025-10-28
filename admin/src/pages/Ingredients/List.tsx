import React, { useEffect, useState } from 'react'
import { Button, Space, Table, Typography, Popconfirm, message } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import { graphqlRequest } from '../../api/graphql'

type Ingredient = {
  id: number
  name: string
  type_id?: number
  ingredient_type?: { name: string }
}

const LIST_QUERY = `
  query ListIngredients {
    ingredients(order_by: {id: desc}) {
      id
      name
      type_id
      ingredient_type { name }
    }
  }
`

const DELETE_MUTATION = `
  mutation DeleteIngredient($id: Int!) {
    delete_ingredients_by_pk(id: $id) { id }
  }
`

export const IngredientsList: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Ingredient[]>([])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await graphqlRequest<{ ingredients: Ingredient[] }>(LIST_QUERY)
      setData(res.ingredients)
    } catch (e) {
      message.error('Erreur lors du chargement des ingrédients')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleDelete = async (id: number) => {
    try {
      await graphqlRequest(DELETE_MUTATION, { id })
      message.success('Ingrédient supprimé')
      fetchData()
    } catch (e) {
      message.error('Suppression impossible')
    }
  }

  const columns: ColumnsType<Ingredient> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Nom', dataIndex: 'name', key: 'name' },
    { title: 'Type', key: 'type', render: (_, r) => r.ingredient_type?.name || '-' },
    {
      title: 'Actions', key: 'actions', width: 220,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => navigate(`/ingredients/${record.id}/edit`)}>Modifier</Button>
          <Popconfirm title="Supprimer cet ingrédient ?" onConfirm={() => handleDelete(record.id)}>
            <Button danger type="link">Supprimer</Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>Ingrédients</Typography.Title>
        <Button type="primary" onClick={() => navigate('/ingredients/create')}>Nouvel ingrédient</Button>
      </Space>
      <Table rowKey="id" loading={loading} columns={columns} dataSource={data} />
    </div>
  )
}

export default IngredientsList
