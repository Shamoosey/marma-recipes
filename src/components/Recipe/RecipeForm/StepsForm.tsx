import { useState } from "react";
import { RemovableFormList } from "./RemovableFormList";
import { Button, Textarea } from "@/components/ui";

interface RecipeStepsFormProps {
  steps: string[];
  setSteps: (val: string[]) => void;
  error?: string;
}

export function RecipeStepsForm({ setSteps, steps, error }: RecipeStepsFormProps) {
  const [newStep, setNewStep] = useState<string>("");

  const onAddStep = () => {
    const trimmed = newStep.trim();
    if (trimmed != "") {
      const newItems = trimmed
        .split("\n")
        .map((item) => item.trim())
        .map((item) => item.replace(/^[*•▢◻▪▫■□●○◦⦿⦾]+\s*/, ""))
        .filter((item) => item !== "");

      setSteps([...steps, ...newItems]);
      setNewStep("");
    }
  };

  const onRemoveStep = (index: number) => {
    const data = [...steps];
    data.splice(index, 1);
    setSteps(data);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key.toLowerCase() == "enter" && e.ctrlKey) {
      e.preventDefault();
      onAddStep();
    }
  };

  const buttonDisabled = newStep.trim() == "";

  return (
    <section className="flex flex-col w-100">
      <span>Recipe Steps</span>
      <div className="flex flex-col gap-1 mb-4">
        <Textarea
          placeholder="Add steps"
          name="recipeIngredients"
          value={newStep}
          resizeable={true}
          onKeyDown={(e) => onKeyDown(e)}
          onChange={(e) => setNewStep(e.target.value)}
        />
        <Button className="text-stone-100 mt-2" type="button" variant="gray" disabled={buttonDisabled} onClick={() => onAddStep()}>
          Add Steps
        </Button>
        {error && <span className="text-red-500 font-semibold">{error}</span>}
      </div>
      <RemovableFormList data={steps} numbered={true} onTrashClick={onRemoveStep} onReorder={setSteps} />
    </section>
  );
}
