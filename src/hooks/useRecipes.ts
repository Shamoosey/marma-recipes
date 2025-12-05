import { useCallback, useEffect, useState } from "react";
import * as RecipeService from "@/services/recipeService";
import type { Recipe } from "@/types/Recipe";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";

export function useRecipes(dependencies: unknown[]) {
  const { getToken, isSignedIn } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [userSavedRecipeIds, setUserSavedRecipeIds] = useState<string[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [recipesError, setRecipesError] = useState<string | null>(null);

  const fetchRecipes = useCallback(async () => {
    setLoadingRecipes(true);
    setRecipesError(null);
    try {
      const sessionToken = (await getToken()) ?? null;
      if (sessionToken) {
        const recipesData = await RecipeService.fetchRecipes(sessionToken);
        setRecipes(recipesData);
        const savedIds = await RecipeService.fetchUserSavedRecipes(sessionToken);
        setUserSavedRecipeIds(savedIds);
      }
    } catch (errorObject) {
      setRecipesError("Unable to fetch recipes due to an unexpected error");
    } finally {
      setLoadingRecipes(false);
    }
  }, [getToken, isSignedIn]);

  const deleteRecipe = useCallback(
    async (recipeId: string) => {
      try {
        const res = window.confirm("Are you sure you'd like to delete this recipe? This cannot be undone.");

        if (res) {
          let sessionToken = (await getToken()) ?? null;

          if (!sessionToken) {
            throw new Error("Unauthorized");
          }
          await RecipeService.deleteRecipe(recipeId, sessionToken);

          setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
          //display a toast message when a recipe has been removed
          toast("Recipe has been deleted", {
            position: "bottom-center",
            theme: "light",
            hideProgressBar: true,
            closeButton: false,
            autoClose: 2500,
          });
        }
      } catch (errorObject) {
        toast("Unable to delete recipe due to an unexpected error", {
          position: "bottom-center",
          theme: "light",
          hideProgressBar: true,
          closeButton: false,
          autoClose: 2500,
        });
      }
    },
    [getToken]
  );

  const toggleSavedRecipe = useCallback(
    async (recipe: Recipe) => {
      try {
        let sessionToken = (await getToken()) ?? null;

        if (!sessionToken) {
          throw new Error("Unauthorized");
        }
        const isSaved = userSavedRecipeIds.includes(recipe.id);
        await RecipeService.toggleSavedRecipe(recipe.id, sessionToken);

        setUserSavedRecipeIds((prev) => (isSaved ? prev.filter((id) => id !== recipe.id) : [...prev, recipe.id]));

        // display a toast message when a recipe has saved / un-saved
        toast(`${isSaved ? "Removed item from saved recipes" : "Added new item to saved recipes"}`, {
          position: "bottom-center",
          theme: "light",
          hideProgressBar: true,
          closeButton: false,
          autoClose: 2500,
        });
      } catch (errorObject) {
        toast("Unable to save recipe due to an unexpected error", {
          position: "bottom-center",
          theme: "light",
          hideProgressBar: true,
          closeButton: false,
          autoClose: 2500,
        });
      }
    },
    [getToken, userSavedRecipeIds]
  );

  const createRecipeComment = useCallback(
    async (recipeId: string, text: string) => {
      try {
        let sessionToken = (await getToken()) ?? null;

        if (!sessionToken) {
          throw new Error("Unauthorized");
        }
        const recipe = await RecipeService.createRecipeComment(recipeId, sessionToken, text);
        setRecipes((prev) => {
          const index = prev.findIndex((x) => x.id === recipe.id);
          if (index === -1) return prev;

          const updated = [...prev];
          updated[index] = recipe;
          return updated;
        });
      } catch (errorObject) {
        toast("Unable to create recipe comment due to an unexpected error", {
          position: "bottom-center",
          theme: "light",
          hideProgressBar: true,
          closeButton: false,
          autoClose: 2500,
        });
      }
    },
    [getToken]
  );

  const deleteRecipeComment = useCallback(
    async (recipeId: string, commentId: string) => {
      try {
        const res = window.confirm("Are you sure you'd like to delete your comment?");

        if (res) {
          let sessionToken = (await getToken()) ?? null;

          if (!sessionToken) {
            throw new Error("Unauthorized");
          }
          await RecipeService.deleteRecipeComment(commentId, sessionToken);

          setRecipes((prev) => {
            const index = prev.findIndex((x) => x.id === recipeId);
            if (index === -1) return prev;

            const updated = [...prev];
            updated[index] = {
              ...updated[index],
              comments: updated[index].comments.filter((comment) => comment.id !== commentId),
            };
            return updated;
          });
          //display a toast message when a recipe comment has been removed
          toast("Comment has been deleted", {
            position: "bottom-center",
            theme: "light",
            hideProgressBar: true,
            closeButton: false,
            autoClose: 2500,
          });
        }
      } catch (errorObject) {
        toast("Unable to delete recipe comment due to an unexpected error", {
          position: "bottom-center",
          theme: "light",
          hideProgressBar: true,
          closeButton: false,
          autoClose: 2500,
        });
      }
    },
    [getToken]
  );

  useEffect(() => {
    console.log("Fetching recipes...");
    fetchRecipes();
  }, [...dependencies]);

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
