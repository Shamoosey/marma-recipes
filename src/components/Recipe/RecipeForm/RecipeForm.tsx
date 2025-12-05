import { useEffect } from "react";
import { useNavigate } from "react-router";
import { IngredientsForm } from "./IngredientsForm";
import { RecipeStepsForm } from "./StepsForm";
import { useRecipes } from "@/hooks/useRecipes";
import { useRecipeForm } from "@/hooks/useRecipeForm";
import { useRecipeTypes } from "@/hooks/useRecipeTypes";
import { Button, Input, Select, Textarea } from "@/components/ui";

interface RecipeFormProps {
  formMode: "edit" | "create";
  recipeId?: string; // edited recipes only
}

export function RecipeForm({ formMode, recipeId }: RecipeFormProps) {
  const { recipes } = useRecipes([]);
  const { ingredients, recipeData, steps, errors, onReset, handleFormChange, setIngredients, setSteps, setRecipeData, onSubmitForm } = useRecipeForm();
  const { recipeTypes } = useRecipeTypes([]);
  const navigate = useNavigate();

  useEffect(() => {
    //When the formMode is "edit" and a recipeId is passed in, find the associated recipe and use that to fill the form fields for an update
    if (formMode == "edit" && recipeId) {
      const editedRecipe = recipes.find((x) => x.id == recipeId);
      if (editedRecipe) {
        const { updatedAt, createdAt, user, userId, ...data } = { ...editedRecipe };
        setRecipeData(data);
        setIngredients(editedRecipe.ingredients);
        setSteps(editedRecipe.steps);
      }
    }
  }, [recipes]);

  const onSubmit = async () => {
    const recipe = await onSubmitForm(formMode);
    if (recipe) {
      navigate(`/recipes/${recipe.id}`);
    }
  };

  return (
    <section className="my-4 py-4 flex flex-col">
      <span className="text-2xl">{formMode == "create" ? "Create" : "Edit"} Recipe</span>
      <form id="form">
        <div className="flex flex-col py-4 gap-4 xl:flex-row">
          <div className="flex flex-col gap-2 flex-grow">
            <div className="flex flex-col">
              <span>Recipe Name</span>
              <Input placeholder="Recipe Name" name="recipeName" value={recipeData.name} onChange={(e) => handleFormChange("name", e.target.value)} />
              {errors.has("name") && <span className="text-red-500 font-semibold">{errors.get("name")}</span>}
            </div>
            <div className="flex flex-col">
              <span>Recipe Description</span>
              <Textarea
                placeholder="Description"
                name="recipeDescription"
                value={recipeData.description}
                onChange={(e) => handleFormChange("description", e.target.value)}
              />
              {errors.has("description") && <span className="text-red-500 font-semibold">{errors.get("description")}</span>}
            </div>
            <div className="flex flex-col">
              <span>Recipe Type</span>
              <Select name="recipeTypeId" value={recipeData.recipeTypeId} onChange={(e) => handleFormChange("recipeTypeId", e.target.value)}>
                <option disabled selected></option>
                {recipeTypes.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name}
                  </option>
                ))}
              </Select>
              {errors.has("recipeTypeId") && <span className="text-red-500 font-semibold">{errors.get("recipeTypeId")}</span>}
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col flex-grow">
                <span>Total Servings</span>
                <Input
                  name="servings"
                  type="number"
                  placeholder="Total servings"
                  value={recipeData.servings ?? ""}
                  onChange={(e) => handleFormChange("servings", Number.parseInt(e.target.value))}
                />
                {errors.has("servings") && <span className="text-red-500 font-semibold">{errors.get("servings")}</span>}
              </div>
              <div className="flex flex-col flex-grow">
                <span>Oven Temp (F)</span>
                <Input
                  name="ovenTemp"
                  type="number"
                  placeholder="Oven Temp"
                  value={recipeData.ovenTemp ?? ""}
                  onChange={(e) => handleFormChange("ovenTemp", Number.parseInt(e.target.value))}
                />
                {errors.has("ovenTemp") && <span className="text-red-500 font-semibold">{errors.get("ovenTemp")}</span>}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col flex-grow">
                <span>Prep Time (Mins)</span>
                <Input
                  name="prepTime"
                  type="number"
                  placeholder="Prep Time (Mins)"
                  value={recipeData.prepTime ?? ""}
                  onChange={(e) => handleFormChange("prepTime", Number.parseInt(e.target.value))}
                />
                {errors.has("prepTime") && <span className="text-red-500 font-semibold">{errors.get("prepTime")}</span>}
              </div>
              <div className="flex flex-col flex-grow">
                <span>Cook Time (Mins)</span>
                <Input
                  name="cookTime"
                  type="number"
                  placeholder="Cook Time (Mins)"
                  value={recipeData.cookTime ?? ""}
                  onChange={(e) => handleFormChange("cookTime", Number.parseInt(e.target.value))}
                />
                {errors.has("cookTime") && <span className="text-red-500 font-semibold">{errors.get("cookTime")}</span>}
              </div>
            </div>
          </div>
          <IngredientsForm ingredients={ingredients} setIngredients={setIngredients} error={errors.get("ingredients")} />
          <RecipeStepsForm steps={steps} setSteps={setSteps} error={errors.get("steps")} />
        </div>
        <div className="flex justify-start gap-4 mt-2">
          <Button type="button" onClick={() => onSubmit()} disabled={errors.values.length > 0} variant="green" className="bg-emerald-600 text-stone-100 w-50">
            {formMode == "create" ? "Create" : "Update"}
          </Button>
          <Button type="button" onClick={() => onReset()} variant="red" className="bg-red-600 text-stone-100 w-50">
            Reset
          </Button>
        </div>
      </form>
    </section>
  );
}
