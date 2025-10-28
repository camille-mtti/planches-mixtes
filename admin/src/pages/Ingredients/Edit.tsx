import React, { useEffect, useState } from 'react'
import { Button, Card, Form, Input, Select, Space, Typography, message } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { graphqlRequest } from '../../api/graphql'

const { Option } = Select

const FETCH_QUERY = `
  query FetchIngredient($id: Int!) {
    ingredients_by_pk(id: $id) {
      id
      name
      type_id
    }
  }
`

const UPDATE_MUTATION = `
  mutation UpdateIngredient($id: Int!, $set: ingredients_set_input!) {
    update_ingredients_by_pk(pk_columns: { id: $id }, _set: $set) { id }
  }
`

const TYPES_QUERY = `
  query IngredientTypes {
    ingredients_type { id name }
  }
`

export const IngredientEditPage: React.FC = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [types, setTypes] = useState<{ id: number, name: string }[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const t = await graphqlRequest<{ ingredients_type: { id: number, name: string }[] }>(TYPES_QUERY)
        setTypes(t.ingredients_type)
        const res = await graphqlRequest(FETCH_QUERY, { id: Number(id) }) as any
        form.setFieldsValue(res.ingredients_by_pk)
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
      message.success('Ingrédient mis à jour')
      navigate('/ingredients')
    } catch (e) {
      message.error('Mise à jour impossible')
    }
  }

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
      <Card style={{ width: 720 }} loading={loading}>
        <Typography.Title level={3}>Modifier l'Ingrédient</Typography.Title>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item label="Nom" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Type" name="type_id">
            <Select allowClear>
              {types.map(t => <Option key={t.id} value={t.id}>{t.name}</Option>)}
            </Select>
          </Form.Item>

          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={() => navigate('/ingredients')}>Annuler</Button>
            <Button type="primary" htmlType="submit">Enregistrer</Button>
          </Space>
        </Form>
      </Card>
    </div>
  )
}

export default IngredientEditPage
