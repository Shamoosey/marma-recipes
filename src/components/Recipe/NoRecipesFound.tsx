import { Button } from "../ui";

interface NoRecipeFoundProps {
  setRecipeType: (val: string) => void;
}

export function NoRecipesFound({ setRecipeType }: NoRecipeFoundProps) {
  return (
    <div className="flex flex-col text-xl gap-4 mt-8">
      <div>
        <span>No recipes found</span>
      </div>
      <div>
        <Button onClick={() => setRecipeType("All")}>
          <span className="text-sky-600 hover:underline">View all recipes</span>
        </Button>
      </div>
    </div>
  );
}
