import React, { useEffect, useState } from 'react'
import { Button, Space, Table, Typography, Popconfirm, message } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import { graphqlRequest } from '../../api/graphql'

// Minimal Restaurant type for the list
type Restaurant = {
  id: number
  name: string
  address?: string
  city?: string
  zipcode?: string
  phone_number?: string
}

const LIST_QUERY = `
  query ListRestaurants {
    restaurants(order_by: {id: desc}) {
      id
      name
      address
      city
      zipcode
      phone_number
    }
  }
`

const DELETE_MUTATION = `
  mutation DeleteRestaurant($id: Int!) {
    delete_restaurants_by_pk(id: $id) { id }
  }
`

export const RestaurantsList: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Restaurant[]>([])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await graphqlRequest<{ restaurants: Restaurant[] }>(LIST_QUERY)
      setData(res.restaurants)
    } catch (e) {
      message.error("Erreur lors du chargement des restaurants")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      await graphqlRequest(DELETE_MUTATION, { id })
      message.success('Restaurant supprimé')
      fetchData()
    } catch (e) {
      message.error("Suppression impossible")
    }
  }

  const columns: ColumnsType<Restaurant> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Nom', dataIndex: 'name', key: 'name' },
    { title: 'Ville', dataIndex: 'city', key: 'city', width: 160 },
    { title: 'Code Postal', dataIndex: 'zipcode', key: 'zipcode', width: 140 },
    {
      title: 'Actions',
      key: 'actions',
      width: 220,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => navigate(`/restaurants/${record.id}/edit`)}>Modifier</Button>
          <Popconfirm title="Supprimer ce restaurant ?" onConfirm={() => handleDelete(record.id)}>
            <Button danger type="link">Supprimer</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>Restaurants</Typography.Title>
        <Button type="primary" onClick={() => navigate('/restaurants/create')}>Nouveau</Button>
      </Space>
      <Table rowKey="id" loading={loading} columns={columns} dataSource={data} />
    </div>
  )
}

export default RestaurantsList
