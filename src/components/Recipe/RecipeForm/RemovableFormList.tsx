import { Button } from "@/components/ui";
import { Trash, GripVertical } from "lucide-react";
import { useState } from "react";

interface RemovableFormListProps {
  data: string[];
  numbered?: boolean;
  onTrashClick: (index: number) => void;
  onReorder: (newData: string[]) => void;
}

export function RemovableFormList({ data, onTrashClick, numbered = false, onReorder }: RemovableFormListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newData = [...data];
    const [removed] = newData.splice(draggedIndex, 1);
    newData.splice(dropIndex, 0, removed);

    onReorder(newData);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="flex flex-col gap-2 flex-grow bg-stone-100 h-100 overflow-auto rounded p-4">
      {data.map((x, i) => (
        <div
          key={i}
          draggable
          onDragStart={(e) => handleDragStart(e, i)}
          onDragOver={(e) => handleDragOver(e, i)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, i)}
          onDragEnd={handleDragEnd}
          className={`flex items-center justify-between p-1.5 border bg-stone-200 rounded cursor-move transition-all ${
            draggedIndex === i ? "opacity-50" : ""
          } ${dragOverIndex === i ? "border-blue-500 border-2" : ""}`}>
          <div className="flex items-center gap-2">
            <GripVertical width={16} height={16} className="text-stone-500" />
            <span>
              {numbered ? `${i + 1}. ` : ""}
              {x}
            </span>
          </div>
          <Button type="button" onClick={() => onTrashClick(i)}>
            <Trash width={16} height={16} />
          </Button>
        </div>
      ))}
    </div>
  );
}
