import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { Trash } from "lucide-react";
import type { RecipeComment } from "@/types/RecipeComment";
import { formatDate } from "@/utils/formateDate";
import { Button, Input } from "@/components/ui";

export interface RecipeCommentsProps {
  recipeId: string;
  comments: RecipeComment[];
  onRecipeComment: (recipeId: string, text: string) => void;
  onDeleteComment: (commentId: string) => void;
}

export function RecipeComments({ recipeId, comments, onRecipeComment, onDeleteComment }: RecipeCommentsProps) {
  const [commentText, setCommmentText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  const onCreateComment = async () => {
    if (commentText && commentText.trim() != "") {
      const text = commentText;
      setCommmentText("");
      setError(null);
      await onRecipeComment(recipeId, text);
    } else {
      setError("You must proide a value to leave a comment");
    }
  };

  return (
    <div className="flex flex-col rounded border p-4 mt-2 bg-stone-200 print:hidden">
      <h1 className="text-xl mb-2">Comments</h1>
      {comments.length > 0 ? (
        <div>
          {comments.map((x) => (
            <div className="mb-2 px-2" key={x.id}>
              <div className="flex">
                <span>{x.username} - </span>
                <span className="text-sm flex items-center">
                  {""}
                  {formatDate(x.createdAt.toString(), "short")}
                </span>
                {user?.id == x.userId ? (
                  <Button onClick={() => onDeleteComment(x.id)}>
                    <Trash className="ml-2 w-4 h-4" />
                  </Button>
                ) : (
                  <></>
                )}
              </div>
              <span className="ml-2 text-sm">{x.text}</span>
            </div>
          ))}
        </div>
      ) : (
        <span>No comments yet</span>
      )}
      <div className="flex gap-2 pt-2">
        <Input placeholder="Type your comment" className="flex-grow" required value={commentText} onChange={(x) => setCommmentText(x.target.value)} />
        <Button variant="green" onClick={() => onCreateComment()} className="px-4">
          Comment
        </Button>
      </div>
      {error != null && <span className="text-red-500 font-semibold">{error}</span>}
    </div>
  );
}
