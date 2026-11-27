import { useEffect, useState } from "react";
import * as RecipeService from "@/services/recipeService";
import * as ValidateRecipeService from "@/services/validateRecipeService";
import { uploadImage } from "@/services/uploadService";
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
  imageKey: undefined,
} as CreateUpdateRecipe;

export function useRecipeForm() {
  const { getToken } = useAuth();
  const [recipeData, setRecipeData] = useState<CreateUpdateRecipe>(DEFAULT_RECIPE);
  const [errors, setErrors] = useState<Map<string, string>>(new Map());
  const [steps, setSteps] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<Blob | null>(null); // resized, not yet uploaded
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState<boolean>(false);

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
      // also drop the saved image (edit mode)
      setRecipeData((prev) => ({ ...prev, imageUrl: undefined, imageKey: undefined }));
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

    clearFieldError("image");

    try {
      const resized = await resizeImage(file);
      setImageFile(resized);
      setImagePreview(URL.createObjectURL(resized));
    } catch {
      setErrors((prev) => new Map(prev).set("image", "Could not read that image"));
    }
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
      setFormLoading(true);
      try {
        // Upload only on submit, so abandoned forms don't leave files behind
        if (imageFile) {
          Object.assign(recipe, await uploadImage(imageFile, sessionToken));
        }
        // null (not undefined) so "image removed" survives JSON.stringify
        recipe.imageKey ??= null;
        recipe.imageUrl ??= null;

        if (formMode == "create") {
          const newRecipe = await RecipeService.createNewRecipe(recipe, sessionToken);
          recipe.id = newRecipe.id;
        } else {
          await RecipeService.updateRecipe(recipe, sessionToken);
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to save recipe");
        return null;
      } finally {
        setFormLoading(false);
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

  const resizeImage = (file: File): Promise<Blob> => {
    return new Promise<Blob>((resolve, reject) => {
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
          if (ctx) {
            ctx.fillStyle = "white"; // JPEG has no transparency
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
          }

          canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Resize failed"))), "image/jpeg", 0.85);
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
    formLoading,
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
