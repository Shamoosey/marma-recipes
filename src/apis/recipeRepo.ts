import type { BaseResponse } from "@/types/BaseResponse";
import type { CreateUpdateRecipe } from "@/types/CreateUpdateRecipe";
import type { Recipe } from "@/types/Recipe";

//Setup the base url with the route prefix using the VITE_API_BASE_URL variable defined in the .env file
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1`;

export async function getRecipes(sessionToken: string) {
  const recipeResponse: Response = await fetch(`${BASE_URL}/recipes`, {
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  if (!recipeResponse.ok) {
    throw new Error("Failed to fetch recipes");
  }

  const json: BaseResponse<Recipe[]> = await recipeResponse.json();
  return json.data;
}

export async function getUserSavedRecipes(sessionToken: string) {
  const recipeResponse: Response = await fetch(`${BASE_URL}/user-saved-recipes`, {
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  if (!recipeResponse.ok) {
    throw new Error("Failed to fetch recipes");
  }

  const json: BaseResponse<string[]> = await recipeResponse.json();
  return json.data;
}

export async function getRecipeById(recipeId: string, sessionToken: string): Promise<Recipe> {
  const recipeResponse: Response = await fetch(`${BASE_URL}/recipes/${recipeId}`, {
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  if (!recipeResponse.ok) {
    throw new Error(`Failed to fetch recipe with id ${recipeId}`);
  }

  const json: BaseResponse<Recipe> = await recipeResponse.json();
  return json.data;
}

export async function createRecipe(recipe: CreateUpdateRecipe, sessionToken: string) {
  const createResponse: Response = await fetch(`${BASE_URL}/recipes`, {
    method: "POST",
    body: JSON.stringify({ ...recipe }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  if (!createResponse.ok) {
    throw new Error(`Failed to create recipe`);
  }

  const json: BaseResponse<Recipe> = await createResponse.json();
  return json.data;
}

export async function updateRecipe(recipe: CreateUpdateRecipe, sessionToken: string) {
  const updateResponse: Response = await fetch(`${BASE_URL}/recipes/${recipe.id}`, {
    method: "PUT",
    body: JSON.stringify({ ...recipe }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  if (!updateResponse.ok) {
    throw new Error(`Failed to update recipe with id ${recipe.id}`);
  }

  const json: BaseResponse<Recipe> = await updateResponse.json();
  return json.data;
}

export async function deleteRecipe(recipeId: string, sessionToken: string): Promise<void> {
  const recipeResponse: Response = await fetch(`${BASE_URL}/recipes/${recipeId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  if (!recipeResponse.ok) {
    throw new Error(`Failed to delete recipe with id ${recipeId}`);
  }
}

export async function toggleUserSavedRecipe(recipeId: string, sessionToken: string): Promise<void> {
  const recipeResponse: Response = await fetch(`${BASE_URL}/user-saved-recipes/${recipeId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  if (!recipeResponse.ok) {
    throw new Error(`Failed to save recipe with id ${recipeId}`);
  }
}

export async function createRecipeComment(recipeId: string, sessionToken: string, text: string) {
  const createResponse: Response = await fetch(`${BASE_URL}/recipe-comment`, {
    method: "POST",
    body: JSON.stringify({ recipeId, text }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  if (!createResponse.ok) {
    throw new Error(`Failed to create recipe comment`);
  }

  const json: BaseResponse<Recipe> = await createResponse.json();
  return json.data;
}

export async function deleteRecipeComment(commentId: string, sessionToken: string): Promise<void> {
  const recipeResponse: Response = await fetch(`${BASE_URL}/recipe-comment/${commentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  if (!recipeResponse.ok) {
    throw new Error(`Failed to delete recipe comment with id ${commentId}`);
  }
}
