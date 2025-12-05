import type { BaseResponse } from "@/types/BaseResponse";
import type { RecipeType } from "@/types/RecipeType";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1`;

export async function getRecipeTypes(sessionToken: string) {
  const recipeTypesResponse: Response = await fetch(`${BASE_URL}/recipeTypes`, {
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  if (!recipeTypesResponse.ok) {
    throw new Error("Failed to fetch recipeTypes");
  }

  const json: BaseResponse<RecipeType[]> = await recipeTypesResponse.json();
  return json.data;
}

// export async function createRecipeType(recipeType: RecipeType) {
//   const createResponse: Response = await fetch(`${BASE_URL}/recipeTypes/${recipeType.id}`, {
//     method: "POST",
//     body: JSON.stringify({ ...recipeType }),
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   if (!createResponse.ok) {
//     throw new Error(`Failed to create recipeType`);
//   }

//   const json: BaseResponse<RecipeType> = await createResponse.json();
//   return json.data;
// }

// export async function updateRecipeTypes(recipeType: RecipeType) {
//   const updateResponse: Response = await fetch(`${BASE_URL}/recipeTypes/${recipeType.id}`, {
//     method: "PUT",
//     body: JSON.stringify({ ...recipeType }),
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   if (!updateResponse.ok) {
//     throw new Error(`Failed to update recipeType with id ${recipeType.id}`);
//   }

//   const json: BaseResponse<RecipeType> = await updateResponse.json();
//   return json.data;
// }

// export async function deleteRecipeType(recipeTypeId: string): Promise<void> {
//   const recipeTypeResponse: Response = await fetch(`${BASE_URL}/recipeTypes/${recipeTypeId}`, {
//     method: "DELETE",
//   });

//   if (!recipeTypeResponse.ok) {
//     throw new Error(`Failed to fetch recipeType with id ${recipeTypeId}`);
//   }
// }
