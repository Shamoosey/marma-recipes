import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui";
import { Trash, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";

export function SortableItem({
  id,
  index,
  children,
  onTrashClick,
}: {
  id: string;
  index: number;
  children: React.ReactNode;
  onTrashClick: (index: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between p-1.5 border bg-stone-200 rounded cursor-move">
      <div className="flex items-center gap-2">
        <GripVertical width={16} height={16} className="text-stone-500" />
        <span>{children}</span>
      </div>
      <Button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onTrashClick(index);
        }}
        onPointerDown={(e) => e.stopPropagation()}>
        <Trash width={16} height={16} />
      </Button>
    </div>
  );
}
