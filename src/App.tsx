import React, { useState } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import RootComponent from './RootComponent'
import { persistor, store } from './store/reducers/store'

import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink } from '@apollo/client'
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev'
import { message } from 'antd'

const env = import.meta.env

const createApolloClient = (authToken: string) => {
  return new ApolloClient({
    link: new HttpLink({
      uri: env.VITE_HASURA_GRAPHQL_URL,
      headers: {
        'x-hasura-admin-secret': `${env.VITE_HASURA_GRAPHQL_ADMIN_SECRET}`,
      },
    }),
    cache: new InMemoryCache(),
  })
}
const App: React.FC = () => {
  if (process.env.NODE_ENV !== 'production') {
    // Adds messages only in a dev environment
    loadDevMessages()
    loadErrorMessages()
  }
  const [client] = useState(createApolloClient('test'))
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RootComponent />
        </PersistGate>
      </Provider>
    </ApolloProvider>
  )
}

export default App
