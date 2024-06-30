import Typography from "antd/es/typography/Typography"
import { Page } from "~/components/Layout/Page"
import { Button, Form, Input } from "antd";
import { useState } from "react";

export const PlancheRequestPage = () => {
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState({ email: '', text: '' });

  return (
    <Page>
      <Typography>Proposer une planche</Typography>
      <Form
      layout='horizontal'
      form={form}
      initialValues={{ email: '' , text: ''}}
      onValuesChange={(newValues) => setFormValues(newValues)}
    >
  
      <Form.Item label="Email">
        <Input placeholder="example@email.com" type="email"/>
      </Form.Item>
      <Form.Item label="Description de la planche">
        <Input placeholder="Planche mixte contenant du prosciutto, de la rosette et du saint nectaire" />
      </Form.Item>
      <Form.Item >
        <Button type="primary">Envoyer</Button>
      </Form.Item>
    </Form>
    </Page>
  )
}