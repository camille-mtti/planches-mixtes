import { gql } from '@apollo/client'
import { PlancheCategoryKeys } from './plancheCategory.mapper'

export const fetchPlanches = () => gql`
query fetchPlanches {
  planches {
    id
    planche_category {
      name
    }
    restaurant {
      address
      city
      name
    }
    name
    visit_date
    price
    number_people
    planche_images(where: {is_default: {_eq: true}}) {
      url
    }
  }
}
`

export const fetchPlanchesWithIngredients = () => gql`
query fetchPlanchesWithIngredients {
  planches {
    id
    name
    price
    number_people
    visit_date
    planche_category {
      name
    }
    restaurant {
      name
      city
      address
    }
    planche_images(where: {is_default: {_eq: true}}) {
      url
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
}
`

type FetchPlancheByIdParams = { id?: number }
export type FetchPlancheByIdResponse = {
  planches: {
    category: string
    visit_date: string
    id: number
    name: string
    price: number
    number_people: number
    planche_category: {
      name: PlancheCategoryKeys
    }
    planches_ingredients: {
      ingredient: {
        name: string
        ingredient_type: {
          name: string
        }
      }
    }[]
    restaurant: {
      address: string
      city: string
      google_maps_link: string
      id: number
      latitude: number
      longitude: number
      name: string
      opening_hours: string
      phone_number: string
      website?: string
      zipcode: number
    }
  }[]
}

export const fetchPlancheById = ({ id }: FetchPlancheByIdParams) => gql`
query MyQuery {
  planches(where: {id: {_eq: ${id}}}, limit: 1) {
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
        ingredient_type {
          name
        }
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
      website
      zipcode
    }
  }
}
`


