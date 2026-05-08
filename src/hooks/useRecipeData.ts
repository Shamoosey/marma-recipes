import { useRecipes } from "./useRecipes";
import { useRecipeTypes } from "./useRecipeTypes";

export function useRecipeData() {
  const {
    recipes,
    userSavedRecipeIds,
    loadingRecipes,
    recipesError,
    toggleSavedRecipe,
    deleteRecipe,
    createRecipeComment,
    deleteRecipeComment,
  } = useRecipes();
  const { data: recipeTypes = [] } = useRecipeTypes();

  return {
    recipes,
    recipeTypes,
    userSavedRecipeIds,
    loadingRecipes,
    recipesError,
    toggleSavedRecipe,
    deleteRecipe,
    createRecipeComment: (recipeId: string, text: string) => createRecipeComment({ recipeId, text }),
    deleteRecipeComment: (recipeId: string, commentId: string) => deleteRecipeComment({ recipeId, commentId }),
  };
}
