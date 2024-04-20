import { Datagrid, List, TextField } from "react-admin";

export const RestaurantList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="name" />
      </Datagrid>

    </List>
  )
};