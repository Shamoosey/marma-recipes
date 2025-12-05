export interface CreateUpdateRecipe {
  id?: string;
  name: string;
  description: string;
  recipeTypeId: string;

  ingredients: string[];
  steps: string[];

  servings?: number;
  prepTime?: number; // mins
  cookTime?: number; // mins
  ovenTemp?: number;
}
