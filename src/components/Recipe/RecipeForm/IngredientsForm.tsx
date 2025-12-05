import { useState } from "react";
import { RemovableFormList } from "./RemovableFormList";
import { Button, Textarea } from "@/components/ui";

interface IngredientsFormProps {
  ingredients: string[];
  setIngredients: (val: string[]) => void;
  error?: string;
}

export function IngredientsForm({ ingredients, setIngredients, error }: IngredientsFormProps) {
  const [newIngredient, setNewIngredient] = useState<string>("");

  const onAddIngredient = () => {
    const trimmed = newIngredient.trim();
    if (trimmed != "") {
      const newItems = trimmed
        .split("\n")
        .map((item) => item.trim())
        .map((item) => item.replace(/^[*•▢◻▪▫■□●○◦⦿⦾]+\s*/, ""))
        .filter((item) => item !== "");

      setIngredients([...ingredients, ...newItems]);
      setNewIngredient("");
    }
  };

  const onRemoveIngredient = (index: number) => {
    const data = [...ingredients];
    data.splice(index, 1);
    setIngredients(data);
  };

  const onKeyDown = (e: any) => {
    if (e.key.toLowerCase() == "enter" && e.ctrlKey) {
      e.preventDefault();
      onAddIngredient();
    }
  };

  const buttonDisabled = newIngredient.trim() == "";

  return (
    <section className="flex flex-col w-100">
      <span>Ingredients</span>

      <div className="flex flex-col gap-1 mb-4">
        <Textarea
          placeholder="Add ingredients"
          name="recipeIngredients"
          resizeable={true}
          value={newIngredient}
          onKeyDown={(e) => onKeyDown(e)}
          onChange={(e) => setNewIngredient(e.target.value)}
        />
        <Button className="text-stone-100 mt-2" type="button" variant="gray" disabled={buttonDisabled} onClick={() => onAddIngredient()}>
          Add Ingredients
        </Button>
        {error && <span className="text-red-500 font-semibold">{error}</span>}
      </div>
      <RemovableFormList data={ingredients} onTrashClick={onRemoveIngredient} onReorder={setIngredients} />
    </section>
  );
}
