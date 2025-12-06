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
  imageUrl: undefined,
  cloudinaryId: undefined,
} as CreateUpdateRecipe;

export function useRecipeForm() {
  const { getToken } = useAuth();
  const [recipeData, setRecipeData] = useState<CreateUpdateRecipe>(DEFAULT_RECIPE);
  const [errors, setErrors] = useState<Map<string, string>>(new Map());
  const [steps, setSteps] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (steps.length > 0) {
      clearFieldError("steps");
    }
    if (ingredients.length > 0) {
      clearFieldError("ingredients");
    }
  }, [ingredients, steps]);

  useEffect(() => {
    if (recipeData.imageUrl && !imageFile) {
      setImagePreview(recipeData.imageUrl);
    }
  }, [recipeData.imageUrl, imageFile]);

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

  const handleImageChange = (file: File | null) => {
    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      clearFieldError("image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => new Map(prev).set("image", "Image must be less than 5MB"));
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => new Map(prev).set("image", "Only image files are allowed"));
      return;
    }

    setImageFile(file);
    clearFieldError("image");

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onReset = () => {
    setRecipeData(DEFAULT_RECIPE);
    setIngredients([]);
    setSteps([]);
    setImageFile(null);
    setImagePreview(null);
    clearAllErrors();
  };

  const onSubmitForm = async (formMode: "create" | "edit") => {
    const sessionToken = (await getToken()) ?? null;

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
        const newRecipe = await RecipeService.createNewRecipe(recipe, sessionToken, imageFile);
        recipe.id = newRecipe.id;
        recipe.imageUrl = newRecipe.imageUrl;
        recipe.cloudinaryId = newRecipe.cloudinaryId;
      } else {
        const updatedRecipe = await RecipeService.updateRecipe(recipe, sessionToken, imageFile);
        recipe.imageUrl = updatedRecipe.imageUrl;
        recipe.cloudinaryId = updatedRecipe.cloudinaryId;
      }
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

  return {
    recipeData,
    steps,
    ingredients,
    errors,
    imageFile,
    imagePreview,
    onReset,
    handleFormChange,
    handleImageChange,
    clearAllErrors,
    setIngredients,
    setSteps,
    setRecipeData,
    onSubmitForm,
  };
}
