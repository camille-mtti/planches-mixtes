import { Datagrid, List, ReferenceField, TextField } from "react-admin";

export const IngredientList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="name" />
        <ReferenceField source="type_id" reference="ingredients_type" label="Type" />
      </Datagrid>
    </List>
  )
};