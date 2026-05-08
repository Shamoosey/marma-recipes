import { useQuery } from "@tanstack/react-query";
import * as RecipeTypeService from "@/services/recipeTypeService";
import type { RecipeType } from "@/types/RecipeType";
import { useAuth } from "@clerk/clerk-react";

export function useRecipeTypes() {
  const { getToken } = useAuth();

  return useQuery<RecipeType[]>({
    queryKey: ["recipeTypes"],
    queryFn: async () => {
      return RecipeTypeService.fetchRecipeTypes();
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
