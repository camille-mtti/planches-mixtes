import React, { useEffect, useState } from 'react'
import { Button, Space, Table, Typography, Popconfirm, message, Image } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import { graphqlRequest } from '../../api/graphql'

type Planche = {
  id: number
  price: number
  number_people: number
  visit_date?: string
  restaurant?: { name: string }
  planche_images?: { url: string }[]
  planche_category?: { name: string }
}

const LIST_QUERY = `
  query ListPlanches {
    planches(order_by: {id: desc}) {
      id
      price
      number_people
      visit_date
      restaurant { name }
      planche_category { name }
      planche_images(where: {is_default: {_eq: true}}) { url }
    }
  }
`

const DELETE_MUTATION = `
  mutation DeletePlanche($id: Int!) {
    delete_planches_by_pk(id: $id) { id }
  }
`

export const PlanchesList: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Planche[]>([])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await graphqlRequest<{ planches: Planche[] }>(LIST_QUERY)
      setData(res.planches)
    } catch (e) {
      message.error('Erreur lors du chargement des planches')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleDelete = async (id: number) => {
    try {
      await graphqlRequest(DELETE_MUTATION, { id })
      message.success('Planche supprimée')
      fetchData()
    } catch (e) {
      message.error('Suppression impossible')
    }
  }

  const columns: ColumnsType<Planche> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    {
      title: 'Image', key: 'image', width: 100,
      render: (_, r) => {
        const url = r.planche_images?.[0]?.url
        return url ? <Image src={url} width={64} height={64} style={{ objectFit: 'cover', borderRadius: 4 }} /> : '-'
      }
    },
    { title: 'Type', key: 'type', render: (_, r) => r.planche_category?.name || '-' },
    { title: 'Prix (€)', dataIndex: 'price', key: 'price', width: 120 },
    { title: 'Personnes', dataIndex: 'number_people', key: 'number_people', width: 140 },
    { title: 'Restaurant', key: 'restaurant', render: (_, r) => r.restaurant?.name || '-' },
    {
      title: 'Actions', key: 'actions', width: 220,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => navigate(`/planches/${record.id}/edit`)}>Modifier</Button>
          <Popconfirm title="Supprimer cette planche ?" onConfirm={() => handleDelete(record.id)}>
            <Button danger type="link">Supprimer</Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>Planches</Typography.Title>
        <Button type="primary" onClick={() => navigate('/planches/create')}>Nouvelle planche</Button>
      </Space>
      <Table rowKey="id" loading={loading} columns={columns} dataSource={data} />
    </div>
  )
}

export default PlanchesList
