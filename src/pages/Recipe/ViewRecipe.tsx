import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import { RecipeItem } from "@/components/Recipe/RecipeItem";
import { useRecipeData } from "@/hooks/useRecipeData";
import { useRecipe } from "@/hooks/useRecipe";

export function ViewRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { recipe, isLoading, recipeError } = useRecipe(id!);
  const { recipeTypes, userSavedRecipeIds, toggleSavedRecipe, deleteRecipe, createRecipeComment, deleteRecipeComment } =
    useRecipeData();

  useEffect(() => {
    if (!isLoading && !recipe) {
      navigate("/not-found");
    }
  }, [isLoading, recipe, navigate]);

  if (isLoading) return null;
  if (!recipe) return null;

  return (
    <div className="mt-4">
      <RecipeItem
        recipe={recipe}
        recipeTypes={recipeTypes}
        savedRecipeIds={userSavedRecipeIds}
        onRecipeComment={createRecipeComment}
        onRecipeSaved={toggleSavedRecipe}
        onRecipeDelete={deleteRecipe}
        onDeleteComment={deleteRecipeComment}
        standalone={true}
      />
    </div>
  );
}
