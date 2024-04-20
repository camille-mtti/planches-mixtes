import { gql } from '@apollo/client';


export const fetchPlanches = () => gql`
query fetchPlanches {
  planches {
    category
    visit_date
    id
    name
    price
    restaurant {
      address
      city
      google_maps_link
      id
      latitude
      longitude
      name
      opening_hours
      phone_number
    }
  }
}
`

type FetchPlancheByIdParams = { id?: number}
export const fetchPlancheById = ({id}: FetchPlancheByIdParams) => gql`
query MyQuery {
  planches(where: {id: {_eq: ${id}}}) {
    category
    visit_date
    id
    name
    price
    number_people
    planche_category {
      name
    }
    planches_ingredients {
      ingredient {
        name
        type
      }
    }
    restaurant {
      address
      city
      google_maps_link
      id
      latitude
      longitude
      name
      opening_hours
      phone_number
    }
  }
}
`