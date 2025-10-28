import React, { useEffect, useState } from 'react'
import { Button, Card, Form, Input, Space, Typography, message } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { graphqlRequest } from '../../api/graphql'
import { AddressAutocomplete } from '../../components/AddressAutocomplete/AddressAutocomplete'

const FETCH_QUERY = `
  query FetchRestaurant($id: Int!) {
    restaurants_by_pk(id: $id) {
      id
      name
      address
      city
      zipcode
      phone_number
      website
      latitude
      longitude
      opening_hours
      google_maps_link
    }
  }
`

const UPDATE_MUTATION = `
  mutation UpdateRestaurant($id: Int!, $set: restaurants_set_input!) {
    update_restaurants_by_pk(pk_columns: { id: $id }, _set: $set) { id }
  }
`

export const RestaurantEditPage: React.FC = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [addressText, setAddressText] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await graphqlRequest(FETCH_QUERY, { id: Number(id) }) as any
        form.setFieldsValue(res.restaurants_by_pk)
      } catch (e) {
        message.error('Chargement impossible')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const onFinish = async (values: any) => {
    try {
      await graphqlRequest(UPDATE_MUTATION, { id: Number(id), set: values })
      message.success('Restaurant mis à jour')
      navigate('/restaurants')
    } catch (e) {
      message.error("Mise à jour impossible")
    }
  }

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
      <Card style={{ width: 720 }} loading={loading}>
        <Typography.Title level={3}>Modifier le Restaurant</Typography.Title>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item label="Nom" name="name" rules={[{ required: true, message: 'Nom requis' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Recherche d'adresse">
            <AddressAutocomplete
              value={addressText}
              onChange={setAddressText}
              onSelect={({ address, city, zipcode, latitude, longitude }) => {
                form.setFieldsValue({ address, city, zipcode, latitude, longitude })
              }}
            />
          </Form.Item>

          <Form.Item label="Adresse" name="address">
            <Input />
          </Form.Item>
          <Form.Item label="Ville" name="city">
            <Input />
          </Form.Item>
          <Form.Item label="Code Postal" name="zipcode">
            <Input />
          </Form.Item>
          <Form.Item label="Téléphone" name="phone_number">
            <Input />
          </Form.Item>
          <Form.Item label="Site internet" name="website">
            <Input />
          </Form.Item>
          <Form.Item label="Latitude" name="latitude" rules={[{ required: true, message: 'Latitude requise' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Longitude" name="longitude" rules={[{ required: true, message: 'Longitude requise' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Heures d'ouverture" name="opening_hours">
            <Input />
          </Form.Item>
          <Form.Item label="Lien Google maps" name="google_maps_link">
            <Input />
          </Form.Item>

          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={() => navigate('/restaurants')}>Annuler</Button>
            <Button type="primary" htmlType="submit">Enregistrer</Button>
          </Space>
        </Form>
      </Card>
    </div>
  )
}

export default RestaurantEditPage
