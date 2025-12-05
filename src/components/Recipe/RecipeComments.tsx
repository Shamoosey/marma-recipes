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
        <div className="space-y-3">
          {comments.map((x) => (
            <div className="flex gap-3 px-2" key={x.id}>
              <img
                src={x.userProfileUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(x.username)}&background=random`}
                alt={`${x.username}'s profile`}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex flex-col flex-grow min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{x.username}</span>
                  <span className="text-sm text-gray-600">{formatDate(x.createdAt.toString(), "short")}</span>
                  {user?.id == x.userId && (
                    <Button variant="text" icon onClick={() => onDeleteComment(x.id)} className="ml-auto">
                      <Trash className="w-4 h-4 text-red-600" />
                    </Button>
                  )}
                </div>
                <span className="text-sm mt-1 break-words">{x.text}</span>
              </div>
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
