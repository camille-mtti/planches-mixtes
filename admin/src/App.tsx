import { useState, useEffect } from 'react';
import buildHasuraProvider from 'ra-data-hasura';
import { Admin, DataProvider, Resource } from 'react-admin';
import { ingredients } from './Ingredient';
import { restaurants } from './Restaurant';
import { planches } from './Planche';
import { AuthGuard } from './auth/AuthGuard';
import { authProvider } from './auth/authProvider';

export const App = () => {
  const [dataProvider, setDataProvider] = useState<DataProvider | null>(null);

  useEffect(() => {
    const buildDataProvider = async () => {
      const dataProvider = await buildHasuraProvider({
        clientOptions: {
          uri: import.meta.env.VITE_HASURA_GRAPHQL_URL,
          headers: {
            'x-hasura-admin-secret': import.meta.env.VITE_HASURA_GRAPHQL_ADMIN_SECRET,
          }
        },
      });
      setDataProvider(() => dataProvider);
    };
    buildDataProvider();
  }, []);

  if (!dataProvider) return <p>Loading...</p>;

  return (
    <AuthGuard>
      <Admin dataProvider={dataProvider} authProvider={authProvider}>
        <Resource
          name="restaurants"
          recordRepresentation="name"
          {...restaurants}
        />
        <Resource
          name="ingredients"
          recordRepresentation="name" 
          {...ingredients}
        />
        <Resource name="ingredients_type" recordRepresentation="name" />
        <Resource name="planche_categories" recordRepresentation="name" />

        <Resource name="planches" 
        {...planches} />
      </Admin>
    </AuthGuard>
  );
};

export default App;