import { Create, SimpleForm, TextInput, required } from 'react-admin';

export const RestaurantCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput label="Nom" source="name" validate={[required()]} fullWidth />
      <TextInput label="Adresse" source="address" validate={[required()]} fullWidth />
      <TextInput label="Code Postal" source="zipcode" validate={[required()]} fullWidth />
      <TextInput label="Ville" source="city" validate={[required()]} fullWidth />
      <TextInput label="Téléphone" source="phone_number" fullWidth />
      <TextInput label="Site internet" source="website" fullWidth />
      <TextInput label="Latitude" source="latitude" fullWidth />
      <TextInput label="Longitude" source="longitude" fullWidth />
      <TextInput label="Heures d'ouverture" source="opening_hours" fullWidth />
      <TextInput label="Lien Google maps" source="google_maps_link" fullWidth />
    </SimpleForm>
  </Create>
);
