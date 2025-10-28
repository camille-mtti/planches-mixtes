import React, { useEffect, useState } from 'react'
import { Button, Card, Form, Input, Select, Space, Typography, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { graphqlRequest } from '../../api/graphql'

const { Option } = Select

const CREATE_MUTATION = `
  mutation CreateIngredient($object: ingredients_insert_input!) {
    insert_ingredients_one(object: $object) { id }
  }
`

const TYPES_QUERY = `
  query IngredientTypes {
    ingredients_type { id name }
  }
`

export const IngredientCreatePage: React.FC = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [types, setTypes] = useState<{ id: number, name: string }[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const r = await graphqlRequest<{ ingredients_type: { id: number, name: string }[] }>(TYPES_QUERY)
        setTypes(r.ingredients_type)
      } catch (e) {
        message.error('Chargement des types impossible')
      }
    }
    load()
  }, [])

  const onFinish = async (values: any) => {
    try {
      await graphqlRequest(CREATE_MUTATION, { object: values })
      message.success('Ingrédient créé')
      navigate('/ingredients')
    } catch (e) {
      message.error('Création impossible')
    }
  }

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
      <Card style={{ width: 720 }}>
        <Typography.Title level={3}>Nouvel Ingrédient</Typography.Title>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item label="Nom" name="name" rules={[{ required: true, message: 'Nom requis' }]}>
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

export default IngredientCreatePage
