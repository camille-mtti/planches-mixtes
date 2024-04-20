import { Page } from "~/components/Layout/Page"
import { Spin } from "antd"
import { LoadingOutlined } from '@ant-design/icons';

export const LoadingPage = () => {
  return (
    <Page>
      <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 24 }} alt="loader" />} />
    </Page>
  )
}