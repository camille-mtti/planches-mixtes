import React, { useState } from 'react'
import { Button, Card, Form, Input, InputNumber, Select, Space, Typography, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { graphqlRequest, savePlancheImages } from '../../api/graphql'
import { ImageUpload } from '../../components/ImageUpload/ImageUpload'

const { Option } = Select

const CREATE_MUTATION = `
  mutation CreatePlanche($object: planches_insert_input!) {
    insert_planches_one(object: $object) { id }
  }
`

const RESTAURANTS_QUERY = `
  query Restaurants {
    restaurants { id name }
  }
`

const CATEGORIES_QUERY = `
  query Categories {
    planche_categories { id name }
  }
`

export const PlancheCreatePage: React.FC = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [restaurants, setRestaurants] = useState<{ id: number, name: string }[]>([])
  const [categories, setCategories] = useState<{ id: number, name: string }[]>([])

  const [images, setImages] = useState<string[]>([])
  const [primaryImage, setPrimaryImage] = useState<string | null>(null)

  React.useEffect(() => {
    const load = async () => {
      try {
        const r = await graphqlRequest<{ restaurants: { id: number, name: string }[] }>(RESTAURANTS_QUERY)
        const c = await graphqlRequest<{ planche_categories: { id: number, name: string }[] }>(CATEGORIES_QUERY)
        setRestaurants(r.restaurants)
        setCategories(c.planche_categories)
      } catch (e) {
        message.error('Chargement des référentiels impossible')
      }
    }
    load()
  }, [])

  const onFinish = async (values: any) => {
    try {
      const res = await graphqlRequest<{ insert_planches_one: { id: number } }>(CREATE_MUTATION, { object: values })
      const newId = res.insert_planches_one.id

      if (images.length > 0) {
        await savePlancheImages(newId, images, primaryImage)
      }

      message.success('Planche créée')
      navigate('/planches')
    } catch (e) {
      message.error('Création impossible')
    }
  }

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
      <Card style={{ width: 720 }}>
        <Typography.Title level={3}>Nouvelle Planche</Typography.Title>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item label="Nom" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Prix (€)" name="price">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Nombre de personnes" name="number_people">
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Restaurant" name="restaurant_id">
            <Select allowClear showSearch>
              {restaurants.map(r => <Option key={r.id} value={r.id}>{r.name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="Catégorie" name="category_id">
            <Select allowClear>
              {categories.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
            </Select>
          </Form.Item>

          <div style={{ marginTop: 16 }}>
            <Typography.Title level={5}>Images de la planche</Typography.Title>
            <ImageUpload
              images={images}
              onImagesChange={setImages}
              onPrimaryImageChange={setPrimaryImage}
              primaryImage={primaryImage}
              maxImages={10}
            />
          </div>

          <Space style={{ width: '100%', justifyContent: 'flex-end', marginTop: 16 }}>
            <Button onClick={() => navigate('/planches')}>Annuler</Button>
            <Button type="primary" htmlType="submit">Enregistrer</Button>
          </Space>
        </Form>
      </Card>
    </div>
  )
}

export default PlancheCreatePage
