import { Edit, SimpleForm, TextInput, NumberInput, required, DateInput, ReferenceInput, AutocompleteInput, useGetOne } from "react-admin";
import { useState, useEffect } from "react"
import { ImageUpload } from "../components/ImageUpload/ImageUpload"

export const PlancheEdit = () => {
  const [images, setImages] = useState<string[]>([])
  const [primaryImage, setPrimaryImage] = useState<string | null>(null)

  // Note: You'll need to fetch existing images from your data source
  // This is a placeholder - you'll need to implement the actual data fetching
  // based on your Hasura schema

  return (
    <Edit>
      <SimpleForm>
        <TextInput label="Nom" source="name" fullWidth />
        <NumberInput label="Price" source="price" validate={[required()]} fullWidth />
        <DateInput label="Visit Date" source="visit_date" validate={[required()]} fullWidth />
        <TextInput label="Number of people" source="number_people" validate={[required()]} fullWidth />
        <ReferenceInput label="Category" source="category_id" reference="planche_categories">
          <AutocompleteInput label='Category' />
        </ReferenceInput>
        <ReferenceInput label="Restaurant" source="restaurant_id" reference="restaurants">
          <AutocompleteInput label='Restaurant' />
        </ReferenceInput>
        
        <div style={{ marginTop: '24px' }}>
          <h3>Planche Images</h3>
          <ImageUpload
            images={images}
            onImagesChange={setImages}
            onPrimaryImageChange={setPrimaryImage}
            primaryImage={primaryImage}
            maxImages={10}
          />
        </div>
      </SimpleForm>
    </Edit>
  );
}