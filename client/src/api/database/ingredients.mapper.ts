
type Ingredient =  {
  name: string,
ingredient_type: {  name: string
}}
export const formatIngredientsListByType = (ingredients?: {ingredient: Ingredient}[] ): Record<string, string[]> => 
  ingredients?.reduce((acc, {ingredient}) => {
    if (!acc[ingredient.ingredient_type.name]) {
      return {
        ...acc,
        [ingredient.ingredient_type.name]: [ingredient.name],
      }
    }

    return {...acc,
      [ingredient.ingredient_type.name]: [...acc[ingredient.ingredient_type.name], ingredient.name],
    }
  }, {} as Record<string, string[]>) || {}

