import { List, Datagrid, TextField, ReferenceField } from "react-admin"

export const PlancheList = () => {
  return (
    <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <ReferenceField source="restaurant_id" reference="restaurants" label="Restaurant" />
    </Datagrid>

  </List>
  )
}