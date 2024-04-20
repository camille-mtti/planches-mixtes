import { gql } from '@apollo/client';


export const fetchPlanches = gql`
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

/***
 * query MyQuery {
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
  planches_ingredients {
    ingredient {
      name
      ingredient_type {
        name
      }
    }
  }
}

*/