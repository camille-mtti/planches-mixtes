import { List, Datagrid, TextField, ReferenceField, FunctionField } from "react-admin"
import { useListContext } from "react-admin"

export const PlancheList = () => {
  return (
    <List >
      <Datagrid rowClick="edit">
        <TextField source="id" />
        {/* <FunctionField
          label="Image"
          render={(record: any) => {
            console.log('record',{record})
            // Show the primary image if available
            const primaryImage = record.planche_images?.find((img: any) => img.is_default)
            return primaryImage ? (
              <img
                src={primaryImage.url}
                alt={record.name}
                style={{
                  width: '60px',
                  height: '60px',
                  objectFit: 'cover',
                  borderRadius: '4px'
                }}
              />
            ) : (
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#999'
              }}>
                No Image
              </div>
            )
          }}
        /> */}
        <TextField source="name" />
        <ReferenceField source="restaurant_id" reference="restaurants" label="Restaurant" />
        <TextField source="price" />
        <TextField source="number_people" label="People" />
      </Datagrid>
    </List>
  )
}