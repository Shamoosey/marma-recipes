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

  const onEditStep = (index: number) => {
    const data = [...steps];
    const edited = data.splice(index, 1)[0];
    setNewStep(edited);
    setSteps(data);
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
    <section className="flex flex-col w-full lg:w-100 lg:flex-1">
      <span className="mb-1">Recipe Steps</span>
      <div className="flex flex-col gap-1 mb-4">
        <Textarea
          placeholder="Add steps"
          name="recipeIngredients"
          value={newStep}
          resizeable={true}
          className="min-h-[80px]"
          onKeyDown={(e) => onKeyDown(e)}
          onChange={(e) => setNewStep(e.target.value)}
        />
        <Button
          className="mt-2 w-full sm:w-auto"
          type="button"
          variant="gray"
          disabled={buttonDisabled}
          onClick={() => onAddStep()}>
          Add Steps
        </Button>
        {error && <span className="text-red-500 font-semibold text-sm mt-1">{error}</span>}
      </div>
      <RemovableFormList
        data={steps}
        numbered={true}
        onTrashClick={onRemoveStep}
        onEditClick={onEditStep}
        onReorder={setSteps}
      />
    </section>
  );
}
