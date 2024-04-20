// Initialize the dataProvider before rendering react-admin resources.
import { useState, useEffect } from 'react';
import buildHasuraProvider from 'ra-data-hasura';
import { Admin, DataProvider, Resource } from 'react-admin';
import { RestaurantList } from './Restaurant/RestaurantList';
import { IngredientList } from './Ingredient/IngredientList';
import { IngredientCreate } from './Ingredient/IngredientCreate';
import { IngredientEdit } from './Ingredient/IngredientEdit';


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
        list={RestaurantList}
      />
      <Resource
        name="ingredients"
        list={IngredientList}
        create={IngredientCreate}
        edit={IngredientEdit}
      />
      <Resource name="ingredients_type" recordRepresentation="name" />

    </Admin>
  );
};

export default App;