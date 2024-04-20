import { Datagrid, List, TextField } from "react-admin";

export const RestaurantList = (props: any) => {
  console.log(props)
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="id" />
        <TextField source="name" />
      </Datagrid>

    </List>
  )
};