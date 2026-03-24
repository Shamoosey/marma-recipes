import { RecipeList } from "@/components/Recipe/RecipeList";
import { useFilteredRecipes } from "@/hooks/useFilteredRecipes";
import { useRecipeData } from "@/hooks/useRecipeData";
import { useNavigate, useParams } from "react-router";

export function UserRecipes() {
  const recipeData = useRecipeData();
  const { id } = useParams();
  console.log(id);
  const { filteredRecipes, setRecipeType, setSearchTerm } = useFilteredRecipes(
    recipeData.recipes,
    [],
    (recipe) => recipe.userId == id,
  );

  let navigate = useNavigate();
  if (!id) {
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
