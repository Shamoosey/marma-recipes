import { Input, Select } from "@/components/ui";
import type { Recipe } from "@/types/Recipe";
import type { RecipeType } from "@/types/RecipeType";

interface RecipeListFilterProps {
  recipes: Recipe[];
  recipeTypes: RecipeType[];

  setSearchTerm: (val: string) => void;
  setRecipeType: (val: string) => void;
}

export function RecipeListFilter({ setRecipeType, setSearchTerm, recipeTypes, recipes }: RecipeListFilterProps) {
  return (
    <div>
      <div className="flex justify-between gap-6">
        <Input className="w-full" onChange={(e) => setSearchTerm(e.target.value)} placeholder="Find a recipe" />
        <Select className="w-40" onChange={(e) => setRecipeType(e.target.value)}>
          <option value={undefined} defaultValue={"All"}>
            All
          </option>
          {recipeTypes.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </Select>
      </div>
      <span>{recipes.length} results</span>
    </div>
  );
}
