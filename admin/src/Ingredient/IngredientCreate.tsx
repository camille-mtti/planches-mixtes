import { AutocompleteInput, Create, SimpleForm, TextInput, required, ReferenceInput } from 'react-admin';

export const IngredientCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput label="Nom" source="name" validate={[required()]} fullWidth />
      <ReferenceInput label="Type" source="type_id" reference="ingredients_type" sort={{ field: 'name', order: 'ASC' }} >
        <AutocompleteInput label='name' />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);
