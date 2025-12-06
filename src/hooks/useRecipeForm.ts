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

  const handleImageChange = async (file: File | null) => {
    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      clearFieldError("image");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => new Map(prev).set("image", "Image must be less than 10MB"));
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => new Map(prev).set("image", "Only image files are allowed"));
      return;
    }

    setImageFile(file);
    clearFieldError("image");

    const resizedBase64 = await resizeImage(file);
    setImagePreview(resizedBase64);
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
        const newRecipe = await RecipeService.createNewRecipe(recipe, sessionToken, imagePreview);
        recipe.id = newRecipe.id;
        recipe.imageUrl = newRecipe.imageUrl;
        recipe.cloudinaryId = newRecipe.cloudinaryId;
      } else {
        if (!imagePreview) {
          recipe.imageUrl = undefined;
        }
        const updatedRecipe = await RecipeService.updateRecipe(recipe, sessionToken, imagePreview);
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

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          const maxWidth = 1200;
          const maxHeight = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL("image/jpeg", 0.85));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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
