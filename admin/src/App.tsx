import { useState, useEffect } from 'react';
import buildHasuraProvider from 'ra-data-hasura';
import { Admin, DataProvider, Resource } from 'react-admin';
import { ingredients } from './Ingredient';
import { restaurants } from './Restaurant';


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
    <Admin dataProvider={dataProvider}>
      <Resource
        name="restaurants"
        {...restaurants}
      />
      <Resource
        name="ingredients"
        {...ingredients}
      />
      <Resource name="ingredients_type" recordRepresentation="name" />

    </Admin>
  );
};

export default App;