import { useUser } from "@clerk/clerk-react";
import { Edit, Heart, MessageCircle, MessageCircleHeart, Printer, Star, Trash } from "lucide-react";
import { Link, useNavigate } from "react-router";
import type { Recipe } from "@/types/Recipe";
import type { RecipeType } from "@/types/RecipeType";
import { formatDate } from "@/utils/formateDate";
import { Button, ParagraphLink } from "@/components/ui";
import { RecipeItemCard } from "./RecipeItemCard";
import { RecipeComments } from "./RecipeComments";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

interface RecipeItemProps {
  recipe: Recipe;
  recipeTypes: RecipeType[];
  savedRecipeIds: string[];
  standalone?: boolean;

  onRecipeSaved: (recipe: Recipe) => void;
  onRecipeDelete: (recipeId: string) => void;
  onRecipeComment: (recipeId: string, text: string) => void;
  onDeleteComment: (recipeId: string, commentId: string) => void;
}

export function RecipeItem({
  recipe,
  recipeTypes,
  savedRecipeIds,
  standalone = false,
  onRecipeSaved,
  onRecipeDelete,
  onRecipeComment,
  onDeleteComment,
}: RecipeItemProps) {
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();

  function getRecipeTitle() {
    const text = `${recipe.name} - ${recipeTypes.find((x) => x.id == recipe.recipeTypeId)?.name ?? ""}`;
    if (!standalone) {
      return (
        <Link to={`/recipes/${recipe.id}`} className="hover:underline cursor:pointer">
          {text}
        </Link>
      );
    }
    return text;
  }

  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  return (
    <section
      ref={printRef}
      className="recipe-item border p-4 rounded bg-stone-100 print:border-none print:bg-white mb-2">
      <div className="flex flex-col gap-2">
        <div className="flex justify-items-center mt-2 text-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{getRecipeTitle()}</div>
            {recipe.comments && recipe.comments.length > 0 && (
              <div className="flex items-center gap-1 text-sm text-gray-700 font-semibold">
                <MessageCircle size={16} />
                <span>{recipe.comments.length}</span>
              </div>
            )}

            {recipe.likeCount > 0 && (
              <div className="flex items-center gap-1 text-sm text-gray-700 font-semibold">
                <Star size={16} />
                <span>{recipe.likeCount}</span>
              </div>
            )}
          </div>
          <div className="flex gap-2 print:hidden">
            {isSignedIn ? (
              recipe.user.id == user?.id ? (
                <>
                  <Button icon={true} onClick={() => navigate(`/recipes/${recipe.id}/edit`)}>
                    <Edit />
                  </Button>
                  <Button icon={true} onClick={() => onRecipeDelete(recipe.id)}>
                    <Trash />
                  </Button>
                </>
              ) : (
                <Button icon={true} onClick={() => onRecipeSaved(recipe)}>
                  {savedRecipeIds?.includes(recipe.id) ? <Star fill="orange" /> : <Star />}
                </Button>
              )
            ) : (
              <></>
            )}
            <Button icon={true} onClick={handlePrint}>
              <Printer />
            </Button>
          </div>
        </div>
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <span className="text-sm">{formatDate(recipe.createdAt.toString(), "medium")}</span>
            <div className="flex items-center gap-2 text-sm mt-1">
              <img
                src={
                  recipe.user.imageUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(recipe.user.username)}&background=random`
                }
                alt={`${recipe.user.username}'s profile`}
                className="w-8 h-8 rounded-full object-cover"
              />
              <Link to={`/recipes/user-recipes/${recipe.userId}`}>
                <span className="text-base font-medium underline text-blue-950">{recipe.user.username}</span>
              </Link>
            </div>
            <div className="flex flex-col print:flex-row print:flex print:gap-4">
              {recipe.prepTime ? <span>Preptime: {recipe.prepTime} mins</span> : <></>}
              {recipe.cookTime ? <span>Cooktime: {recipe.cookTime} mins</span> : <></>}
              {recipe.ovenTemp ? <span>Oven Preheat: {recipe.ovenTemp}&deg;F</span> : <></>}
              {recipe.servings ? <span>Servings: {recipe.servings}</span> : <></>}
            </div>
            <div className="mb-4 print:my-1 break-words">
              <ParagraphLink>{recipe.description}</ParagraphLink>
            </div>
          </div>
          {recipe.imageUrl && (
            <div className="w-full md:w-64 flex-shrink-0 print:hidden">
              <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-64 object-cover rounded" />
            </div>
          )}
        </div>

        <div className="flex gap-4 flex-col">
          <RecipeItemCard data={recipe.ingredients} title="Ingredients" defaultExpand={standalone} />
          <RecipeItemCard data={recipe.steps} title="Steps" ordered={true} defaultExpand={standalone} />
        </div>
        {standalone ? (
          <RecipeComments
            recipeId={recipe.id}
            onRecipeComment={onRecipeComment}
            onDeleteComment={(comment) => onDeleteComment(recipe.id, comment)}
            comments={recipe.comments}
          />
        ) : (
          <></>
        )}
      </div>
    </section>
  );
}
