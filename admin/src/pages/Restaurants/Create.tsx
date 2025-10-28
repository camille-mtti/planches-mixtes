import React, { useState } from 'react'
import { Button, Card, Form, Input, Space, Typography, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { graphqlRequest } from '../../api/graphql'
import { AddressAutocomplete } from '../../components/AddressAutocomplete/AddressAutocomplete'

const CREATE_MUTATION = `
  mutation CreateRestaurant($object: restaurants_insert_input!) {
    insert_restaurants_one(object: $object) { id }
  }
`

export const RestaurantCreatePage: React.FC = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [addressText, setAddressText] = useState('')

  const onFinish = async (values: any) => {
    try {
      await graphqlRequest(CREATE_MUTATION, { object: values })
      message.success('Restaurant créé')
      navigate('/restaurants')
    } catch (e) {
      message.error("Création impossible")
    }
  }

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
      <Card style={{ width: 720 }}>
        <Typography.Title level={3}>Nouveau Restaurant</Typography.Title>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item label="Nom" name="name" rules={[{ required: true, message: 'Nom requis' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Recherche d'adresse" required>
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

export default RestaurantCreatePage
