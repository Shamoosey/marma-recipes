import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as RecipeService from "@/services/recipeService";
import type { Recipe } from "@/types/Recipe";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";

const toastOptions = {
  position: "bottom-center" as const,
  theme: "light" as const,
  hideProgressBar: true,
  closeButton: false,
  autoClose: 2500,
};

export function useRecipes() {
  const { getToken, isSignedIn } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: recipes = [],
    isLoading: loadingRecipes,
    error,
  } = useQuery({
    queryKey: ["recipes"],
    queryFn: async () => {
      return RecipeService.fetchRecipes();
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
  });

  const recipesError = error ? "Unable to fetch recipes due to an unexpected error" : null;

  const { mutate: deleteRecipe } = useMutation({
    mutationFn: async (recipeId: string) => {
      const res = window.confirm("Are you sure you'd like to delete this recipe? This cannot be undone.");
      if (!res) return null;
      const sessionToken = await getToken();
      if (!sessionToken) throw new Error("Unauthorized");
      await RecipeService.deleteRecipe(recipeId, sessionToken);
      return recipeId;
    },
    onSuccess: (recipeId) => {
      if (!recipeId) return;
      queryClient.setQueryData<Recipe[]>(["recipes"], (prev) => (prev ? prev.filter((r) => r.id !== recipeId) : []));
      queryClient.removeQueries({ queryKey: ["recipe", recipeId] });
      toast("Recipe has been deleted", toastOptions);
    },
    onError: () => toast("Unable to delete recipe due to an unexpected error", toastOptions),
  });

  const { mutate: toggleSavedRecipe } = useMutation({
    mutationFn: async (recipe: Recipe) => {
      const sessionToken = await getToken();
      if (!sessionToken) throw new Error("Unauthorized");
      const isSaved = userSavedRecipeIds.includes(recipe.id);
      await RecipeService.toggleSavedRecipe(recipe.id, sessionToken);
      return { recipeId: recipe.id, isSaved };
    },
    onSuccess: ({ recipeId, isSaved }) => {
      queryClient.setQueryData<string[]>(["savedRecipes"], (prev) =>
        isSaved ? (prev ?? []).filter((id) => id !== recipeId) : [...(prev ?? []), recipeId],
      );
      toast(isSaved ? "Removed item from saved recipes" : "Added new item to saved recipes", toastOptions);
    },
    onError: () => toast("Unable to save recipe due to an unexpected error", toastOptions),
  });

  const { mutate: createRecipeComment } = useMutation({
    mutationFn: async ({ recipeId, text }: { recipeId: string; text: string }) => {
      const sessionToken = await getToken();
      if (!sessionToken) throw new Error("Unauthorized");
      return RecipeService.createRecipeComment(recipeId, sessionToken, text);
    },
    onSuccess: (updatedRecipe) => {
      queryClient.setQueryData<Recipe[]>(["recipes"], (prev) =>
        prev ? prev.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r)) : [],
      );
      queryClient.setQueryData<Recipe>(["recipe", updatedRecipe.id], updatedRecipe);
    },
    onError: () => toast("Unable to create recipe comment due to an unexpected error", toastOptions),
  });

  const { mutate: deleteRecipeComment } = useMutation({
    mutationFn: async ({ recipeId, commentId }: { recipeId: string; commentId: string }) => {
      const res = window.confirm("Are you sure you'd like to delete your comment?");
      if (!res) return null;
      const sessionToken = await getToken();
      if (!sessionToken) throw new Error("Unauthorized");
      await RecipeService.deleteRecipeComment(commentId, sessionToken);
      return { recipeId, commentId };
    },
    onSuccess: (result) => {
      if (!result) return;
      const { recipeId, commentId } = result;
      const filterComments = (r: Recipe) => ({
        ...r,
        comments: r.comments.filter((c) => c.id !== commentId),
      });
      queryClient.setQueryData<Recipe[]>(["recipes"], (prev) =>
        prev ? prev.map((r) => (r.id === recipeId ? filterComments(r) : r)) : [],
      );
      queryClient.setQueryData<Recipe>(["recipe", recipeId], (prev) => (prev ? filterComments(prev) : prev));
      toast("Comment has been deleted", toastOptions);
    },
    onError: () => toast("Unable to delete recipe comment due to an unexpected error", toastOptions),
  });

  return {
    recipes,
    userSavedRecipeIds,
    loadingRecipes,
    recipesError,
    toggleSavedRecipe,
    deleteRecipe,
    createRecipeComment,
    deleteRecipeComment,
  };
}
