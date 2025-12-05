import { useEffect, useState } from "react";
import * as RecipeTypeService from "@/services/recipeTypeService";
import type { RecipeType } from "@/types/RecipeType";
import { useAuth } from "@clerk/clerk-react";

export function useRecipeTypes(dependencies: unknown[]) {
  const [recipeTypes, setRecipeTypes] = useState<RecipeType[]>([]);
  const { getToken } = useAuth();

  const fetchRecipeTypes = async () => {
    const sessionToken = (await getToken()) ?? null;
    if (sessionToken) {
      const types = await RecipeTypeService.fetchRecipeTypes(sessionToken);
      setRecipeTypes([...types]);
    }
  };

  useEffect(() => {
    fetchRecipeTypes();
  }, [...dependencies]);

  return {
    recipeTypes,
  };
}
