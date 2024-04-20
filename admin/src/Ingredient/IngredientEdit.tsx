import { AutocompleteInput, SimpleForm, TextInput, required, ReferenceInput, Edit } from 'react-admin';

export const IngredientEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput label="Nom" source="name" validate={[required()]} fullWidth />
      <ReferenceInput label="Type" source="type_id" reference="ingredients_type" sort={{ field: 'name', order: 'ASC' }} >
        <AutocompleteInput label='name' />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);
