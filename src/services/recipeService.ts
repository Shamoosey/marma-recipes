import * as recipeRepo from "@/apis/recipeRepo";
import type { CreateUpdateRecipe } from "@/types/CreateUpdateRecipe";

export async function fetchRecipes(sessionToken: string) {
  return await recipeRepo.getRecipes(sessionToken);
}

export async function fetchUserSavedRecipes(sessionToken: string) {
  return await recipeRepo.getUserSavedRecipes(sessionToken);
}

export async function createNewRecipe(recipe: CreateUpdateRecipe, sessionToken: string, imagePreview?: string | null) {
  return await recipeRepo.createRecipe(recipe, sessionToken, imagePreview);
}

export async function updateRecipe(recipe: CreateUpdateRecipe, sessionToken: string, imagePreview?: string | null) {
  return await recipeRepo.updateRecipe(recipe, sessionToken, imagePreview);
}

export async function deleteRecipe(recipeId: string, sessionToken: string) {
  return await recipeRepo.deleteRecipe(recipeId, sessionToken);
}

export async function toggleSavedRecipe(recipeId: string, sessionToken: string) {
  return await recipeRepo.toggleUserSavedRecipe(recipeId, sessionToken);
}

export async function createRecipeComment(recipeId: string, sessionToken: string, text: string) {
  return await recipeRepo.createRecipeComment(recipeId, sessionToken, text);
}

export async function deleteRecipeComment(commentId: string, sessionToken: string) {
  return await recipeRepo.deleteRecipeComment(commentId, sessionToken);
}
