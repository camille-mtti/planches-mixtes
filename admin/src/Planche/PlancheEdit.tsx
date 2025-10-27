import { Edit, SimpleForm, TextInput, NumberInput, required, DateInput, ReferenceInput, AutocompleteInput, useRecordContext, useNotify } from "react-admin";
import { useState, useEffect } from "react"
import { ImageUpload } from "../components/ImageUpload/ImageUpload"
import { fetchPlancheImages, updatePlancheImages } from "../api/graphql"

export const PlancheEditFormContent = () => {
  const record = useRecordContext()
  const notify = useNotify()
  const [images, setImages] = useState<string[]>([])
  const [primaryImage, setPrimaryImage] = useState<string | null>(null)
  const [existingImages, setExistingImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch existing images when component mounts
  useEffect(() => {
    const loadImages = async () => {
      console.log('ici', record)
      if (record?.id) {
        console.log({record} )
        try {
          setLoading(true)
          console.log('coucou', loading)

          const plancheId = typeof record.id === 'number' ? record.id : parseInt(record.id)
          const fetchedImages = await fetchPlancheImages(plancheId)
          console.log({fetchedImages})
          setExistingImages(fetchedImages)
          
          const imageUrls = fetchedImages.map((img: any) => img.url)
          setImages(imageUrls)
          console.log('coucou', imageUrls)
          
          const defaultImage = fetchedImages.find((img: any) => img.is_default)
          if (defaultImage) {
            setPrimaryImage(defaultImage.url)
          }
        } catch (error) {
          console.error('Error fetching images:', error)
          notify('Failed to load existing images', { type: 'warning' })
        } finally {
          setLoading(false)
        }
      }
    }

    loadImages()
  }, [record?.id, notify])

  const handleSave = async () => {
    if (record?.id && images.length > 0) {
      try {
        const plancheId = typeof record.id === 'number' ? record.id : parseInt(record.id)
        await updatePlancheImages(plancheId, images, primaryImage, existingImages)
        notify('Images updated successfully', { type: 'success' })
      } catch (error) {
        console.error('Error updating images:', error)
        notify('Failed to update images', { type: 'error' })
      }
    }
  }

  if (loading) {
    return <div>Loading images...</div>
  }
  return(

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
          <div style={{ marginTop: '16px', textAlign: 'right' }}>
            <button 
              type="button" 
              onClick={handleSave}
              style={{
                padding: '8px 16px',
                backgroundColor: '#1890ff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Save Images
            </button>
          </div>
        </div>
      </SimpleForm>
 
  );
}

export const PlancheEdit = ()=>{
      return (
        <Edit>
          <PlancheEditFormContent />
        </Edit>
    )
}