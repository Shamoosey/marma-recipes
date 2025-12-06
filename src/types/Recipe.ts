import type { RecipeComment } from "./RecipeComment";
import type { User } from "./User";

export interface Recipe {
  id: string;
  name: string;
  description: string;
  recipeTypeId: string;

  ingredients: string[];
  steps: string[];

  servings?: number;
  prepTime?: number; // mins
  cookTime?: number; // mins
  ovenTemp?: number;
  updatedAt: Date;
  createdAt: Date;
  user: User;
  userId: string;

  imageUrl?: string;
  cloudinaryId?: string;

  comments: RecipeComment[];
}
