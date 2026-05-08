import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as RecipeService from "@/services/recipeService";
import type { Recipe } from "@/types/Recipe";
import { useAuth } from "@clerk/clerk-react";

type RecipesCache = {
  recipes: Recipe[];
  userSavedRecipeIds: string[];
};

export function useRecipe(recipeId: string) {
  const { getToken, isSignedIn } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: recipe,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: async () => {
      return RecipeService.fetchRecipeById(recipeId);
    },
    initialData: () => {
      const cached = queryClient.getQueryData<Recipe[]>(["recipes"]);
      return cached?.find((r) => r.id === recipeId);
    },
  });

  const { data: userSavedRecipeIds = [] } = useQuery({
    queryKey: ["savedRecipes"],
    queryFn: async () => {
      const sessionToken = await getToken();
      if (!sessionToken) throw new Error("Unauthorized");
      return RecipeService.fetchUserSavedRecipes(sessionToken);
    },
    enabled: !!isSignedIn,
    initialData: () => {
      const cached = queryClient.getQueryData<string[]>(["savedRecipes"]);
      return cached;
    },
  });

  const recipeError = error ? "Unable to fetch recipe due to an unexpected error" : null;

  return { recipe, isLoading, recipeError, userSavedRecipeIds };
}
