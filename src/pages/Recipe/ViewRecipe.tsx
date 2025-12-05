import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import { RecipeItem } from "@/components/Recipe/RecipeItem";
import { useRecipeData } from "@/hooks/useRecipeData";

export function ViewRecipe() {
  const recipeData = useRecipeData();

  const { id } = useParams();
  const selectedRecipe = recipeData.recipes.find((x) => x.id == id);
  let navigate = useNavigate();
  useEffect(() => {
    if (!selectedRecipe && recipeData.recipes.length > 0) {
      navigate("/not-found"); //nagivate to 404 when no recipe is found
    }
  }, [selectedRecipe, recipeData.recipes.length, navigate]);

  if (!selectedRecipe) {
    return null;
  }

  return (
    <div className="mt-4">
      <RecipeItem
        recipe={selectedRecipe}
        recipeTypes={recipeData.recipeTypes}
        savedRecipeIds={recipeData.userSavedRecipeIds}
        onRecipeComment={recipeData.createRecipeComment}
        onRecipeSaved={recipeData.toggleSavedRecipe}
        onRecipeDelete={recipeData.deleteRecipe}
        onDeleteComment={recipeData.deleteRecipeComment}
        standalone={true}
      />
    </div>
  );
}
