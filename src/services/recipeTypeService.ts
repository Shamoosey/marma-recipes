import * as recipeTypeRepo from "@/apis/recipeTypeRepo";

export async function fetchRecipeTypes(sessionToken: string) {
  const recipeTypes = await recipeTypeRepo.getRecipeTypes(sessionToken);
  return recipeTypes;
}

// export async function createNewRecipeType(recipeType: RecipeType) {
//   return await recipeTypeRepo.createRecipeType(recipeType);
// }

// export async function updateRecipe(recipeType: RecipeType) {
//   return await recipeTypeRepo.updateRecipeTypes(recipeType);
// }
