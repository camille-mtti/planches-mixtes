import React, { useEffect, useState } from 'react'
import { Button, Card, Form, Input, InputNumber, Select, Space, Typography, message } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { graphqlRequest, fetchPlancheImages, updatePlancheImages } from '../../api/graphql'
import { ImageUpload } from '../../components/ImageUpload/ImageUpload'

const { Option } = Select

const FETCH_QUERY = `
  query FetchPlanche($id: Int!) {
    planches_by_pk(id: $id) {
      id
      name
      price
      number_people
      restaurant_id
      category_id
    }
  }
`

const UPDATE_MUTATION = `
  mutation UpdatePlanche($id: Int!, $set: planches_set_input!) {
    update_planches_by_pk(pk_columns: { id: $id }, _set: $set) { id }
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

export const PlancheEditPage: React.FC = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [restaurants, setRestaurants] = useState<{ id: number, name: string }[]>([])
  const [categories, setCategories] = useState<{ id: number, name: string }[]>([])

  const [images, setImages] = useState<string[]>([])
  const [primaryImage, setPrimaryImage] = useState<string | null>(null)
  const [existingImages, setExistingImages] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const r = await graphqlRequest<{ restaurants: { id: number, name: string }[] }>(RESTAURANTS_QUERY)
        const c = await graphqlRequest<{ planche_categories: { id: number, name: string }[] }>(CATEGORIES_QUERY)
        setRestaurants(r.restaurants)
        setCategories(c.planche_categories)

        const res = await graphqlRequest(FETCH_QUERY, { id: Number(id) }) as any
        form.setFieldsValue(res.planches_by_pk)

        const imgs = await fetchPlancheImages(Number(id))
        setExistingImages(imgs)
        setImages(imgs.map((i: any) => i.url))
        const def = imgs.find((i: any) => i.is_default)
        setPrimaryImage(def ? def.url : null)
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
      await updatePlancheImages(Number(id), images, primaryImage, existingImages)
      message.success('Planche mise à jour')
      navigate('/planches')
    } catch (e) {
      message.error('Mise à jour impossible')
    }
  }

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
      <Card style={{ width: 720 }} loading={loading}>
        <Typography.Title level={3}>Modifier la Planche</Typography.Title>
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

export default PlancheEditPage
