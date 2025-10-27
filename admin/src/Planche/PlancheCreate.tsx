import { AutocompleteArrayInput, AutocompleteInput, Create, DateInput, NumberInput, ReferenceArrayInput, ReferenceInput, SimpleForm, TextInput, required } from "react-admin"
import { useState } from "react"
import { ImageUpload } from "../components/ImageUpload/ImageUpload"

export const PlancheCreate = () => {
  const [images, setImages] = useState<string[]>([])
  const [primaryImage, setPrimaryImage] = useState<string | null>(null)

  return (
    <Create>
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
        <ReferenceArrayInput label="Ingredients" source="ingredients" reference="ingredients">
          <AutocompleteArrayInput label='Ingredients' />
        </ReferenceArrayInput>
        
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
    </Create>
  );
}