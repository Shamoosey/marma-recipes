import { useEffect, useState } from "react";
import * as RecipeService from "@/services/recipeService";
import * as ValidateRecipeService from "@/services/validateRecipeService";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";
import type { CreateUpdateRecipe } from "@/types/CreateUpdateRecipe";

const DEFAULT_RECIPE = {
  name: "",
  description: "",
  recipeTypeId: "",
  cookTime: undefined,
  prepTime: undefined,
  servings: undefined,
  ovenTemp: undefined,
  ingredients: [],
  steps: [],
  id: undefined,
} as CreateUpdateRecipe;

export function useRecipeForm() {
  const { getToken } = useAuth();
  const [recipeData, setRecipeData] = useState<CreateUpdateRecipe>(DEFAULT_RECIPE);
  const [errors, setErrors] = useState<Map<string, string>>(new Map());
  const [steps, setSteps] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);

  useEffect(() => {
    if (steps.length > 0) {
      clearFieldError("steps");
    }
    if (ingredients.length > 0) {
      clearFieldError("ingredients");
    }
  }, [ingredients, steps]);

  const clearFieldError = (field: string) => {
    setErrors((prev) => {
      const newErrors = new Map(prev);
      newErrors.delete(field);
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setErrors(new Map());
  };

  const handleFormChange = (field: string, value: unknown) => {
    clearFieldError(field);
    setRecipeData({
      ...recipeData,
      [field]: value,
    });
  };
  const onReset = () => {
    setRecipeData(DEFAULT_RECIPE);
    setIngredients([]);
    setSteps([]);
    clearAllErrors();
  };

  const onSubmitForm = async (formMode: "create" | "edit") => {
    let sessionToken = (await getToken()) ?? null;

    if (!sessionToken) {
      throw new Error("Unauthorized");
    }
    const recipeErrors = await ValidateRecipeService.validateRecipe(recipeData, ingredients, steps);
    setErrors(recipeErrors);
    if (recipeErrors.size == 0) {
      const recipe = {
        ...recipeData,
        ingredients,
        steps,
      };
      if (formMode == "create") {
        const newRecipe = await RecipeService.createNewRecipe(recipe, sessionToken);
        recipe.id = newRecipe.id;
      } else {
        await RecipeService.updateRecipe(recipe, sessionToken);
      }
      //display a toast message for a successful update/create
      const toastMessage = `Successfully ${formMode == "create" ? "created new" : "updated"}  recipe ${recipe.name}!`;
      toast(toastMessage, {
        position: "bottom-center",
        theme: "light",
        hideProgressBar: true,
        closeButton: false,
        autoClose: 2500,
      });
      onReset();
      return recipe;
    }
    return null;
  };

  return { recipeData, steps, ingredients, errors, onReset, handleFormChange, clearAllErrors, setIngredients, setSteps, setRecipeData, onSubmitForm };
}
