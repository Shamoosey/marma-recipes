import { RecipeList } from "@/components/Recipe/RecipeList";
import { useFilteredRecipes } from "@/hooks/useFilteredRecipes";
import { useRecipeData } from "@/hooks/useRecipeData";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router";

export function MyRecipes() {
  const recipeData = useRecipeData();
  const { user } = useUser();
  const { filteredRecipes, setRecipeType, setSearchTerm } = useFilteredRecipes(recipeData.recipes, [], (recipe) => recipe.userId == user?.id);

  let navigate = useNavigate();
  if (!user) {
    navigate("/not-found");
  }

  return (
    <div className="lg:px-16 pt-8">
      <RecipeList
        recipes={filteredRecipes}
        recipeTypes={recipeData.recipeTypes}
        savedRecipeIds={recipeData.userSavedRecipeIds}
        loadingRecipes={recipeData.loadingRecipes}
        recipesError={recipeData.recipesError}
        onRecipeDelete={recipeData.deleteRecipe}
        onRecipeSaved={recipeData.toggleSavedRecipe}
        onRecipeComment={recipeData.createRecipeComment}
        onDeleteComment={recipeData.deleteRecipeComment}
        setRecipeType={setRecipeType}
        setSearchTerm={setSearchTerm}
      />
    </div>
  );
}
