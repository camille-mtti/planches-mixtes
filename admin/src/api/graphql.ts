// Simple GraphQL client using fetch (no Apollo Client, no RxJS)
const graphqlEndpoint = import.meta.env.VITE_HASURA_GRAPHQL_URL;
const headers = {
  'Content-Type': 'application/json',
  'x-hasura-admin-secret': import.meta.env.VITE_HASURA_GRAPHQL_ADMIN_SECRET,
};

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export async function graphqlRequest<T>(query: string, variables?: any): Promise<T> {
  const response = await fetch(graphqlEndpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });

  const result: GraphQLResponse<T> = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  if (!result.data) {
    throw new Error('No data returned from GraphQL query');
  }

  return result.data;
}

// Helper function to save images to Hasura
export const savePlancheImages = async (plancheId: number, images: string[], primaryImage: string | null) => {
  try {
    const imageObjects = images.map((url) => ({
      planche_id: plancheId,
      url: url,
      is_default: url === primaryImage,
    }));

    const mutation = `
      mutation InsertPlancheImages($objects: [planche_images_insert_input!]!) {
        insert_planche_images(objects: $objects) {
          affected_rows
          returning {
            id
            url
            is_default
          }
        }
      }
    `;

    const result = await graphqlRequest<any>(mutation, { objects: imageObjects });
    return result.insert_planche_images.returning;
  } catch (error) {
    console.error('Error saving planche images:', error);
    throw error;
  }
};

// Helper function to fetch planche images from Hasura
export const fetchPlancheImages = async (plancheId: number) => {
  try {
    const query = `
      query GetPlancheWithImages($id: Int!) {
        planches_by_pk(id: $id) {
          id
          name
          price
          number_people
          visit_date
          restaurant_id
          category_id
          planche_images {
            id
            url
            is_default
            created_at
          }
        }
      }
    `;

    const result = await graphqlRequest<any>(query, { id: plancheId });
    return result.planches_by_pk?.planche_images || [];
  } catch (error) {
    console.error('Error fetching planche images:', error);
    throw error;
  }
};

// Helper function to update existing images
export const updatePlancheImages = async (
  plancheId: number,
  images: string[],
  primaryImage: string | null,
  existingImages: any[]
) => {
  try {
    // Delete old images that are not in the new list
    const urlsToKeep = images;
    const imagesToDelete = existingImages
      .filter(img => !urlsToKeep.includes(img.url))
      .map(img => img.id);

    if (imagesToDelete.length > 0) {
      const deleteMutation = `
        mutation DeletePlancheImages($ids: [Int!]!) {
          delete_planche_images(where: { id: { _in: $ids } }) {
            affected_rows
          }
        }
      `;
      await graphqlRequest<any>(deleteMutation, { ids: imagesToDelete });
    }

    // Find which existing images are being updated vs newly added
    const existingUrls = existingImages.map(img => img.url);
    const newImages = images.filter(url => !existingUrls.includes(url));

    // Update is_default flag for existing images
    for (const image of existingImages) {
      if (images.includes(image.url)) {
        const shouldBeDefault = image.url === primaryImage;
        const updateMutation = `
          mutation UpdatePlancheImages($id: Int!, $updates: planche_images_set_input!) {
            update_planche_images_by_pk(pk_columns: { id: $id }, _set: $updates) {
              id
              url
              is_default
            }
          }
        `;
        await graphqlRequest<any>(updateMutation, {
          id: image.id,
          updates: { is_default: shouldBeDefault },
        });
      }
    }

    // Add new images
    if (newImages.length > 0) {
      const imageObjects = newImages.map((url) => ({
        planche_id: plancheId,
        url: url,
        is_default: url === primaryImage,
      }));

      const insertMutation = `
        mutation InsertPlancheImages($objects: [planche_images_insert_input!]!) {
          insert_planche_images(objects: $objects) {
            affected_rows
            returning {
              id
              url
              is_default
            }
          }
        }
      `;
      await graphqlRequest<any>(insertMutation, { objects: imageObjects });
    }

    return true;
  } catch (error) {
    console.error('Error updating planche images:', error);
    throw error;
  }
};
