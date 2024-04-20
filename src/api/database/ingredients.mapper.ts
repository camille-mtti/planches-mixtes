
type Ingredient =  {
  name: string
  type: string
}
export const formatIngredientsListByType = (ingredients?: {ingredient: Ingredient}[] ): Record<IngredientTypeKeys, string[]> => 
  ingredients?.reduce((acc, {ingredient}) => {
    if (!acc[ingredient.type]) {
      return {
        ...acc,
        [ingredient.type]: [ingredient.name],
      }
    }

    return {...acc,
      [ingredient.type]: [...acc[ingredient.type], ingredient.name],
    }
  }, {} as Record<string, string[]>) || {}

  export type IngredientTypeKeys = keyof typeof INGREDIENT_MAP
  export const INGREDIENT_MAP = {
    fromage: 'Fromage',
    charcuterie: 'Charcuterie',
    legumes: 'Légumes',
    autres: 'Autres',
    dips: 'Dips et tartinades',
  }