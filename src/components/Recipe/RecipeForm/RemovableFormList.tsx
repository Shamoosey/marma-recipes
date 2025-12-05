import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortableList } from "@/hooks/useSortableList";
import { SortableItem } from "./SortableItem";

interface RemovableFormListProps {
  data: string[];
  numbered?: boolean;
  onTrashClick: (index: number) => void;
  onReorder: (newData: string[]) => void;
}

export function RemovableFormList({ data, onTrashClick, numbered = false, onReorder }: RemovableFormListProps) {
  const { sensors, handleDragEnd, items } = useSortableList(data, onReorder);

  return (
    <div className="flex flex-col gap-2 flex-grow bg-stone-100 h-100 overflow-auto rounded p-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {data.map((x, i) => (
            <SortableItem key={`${x}-${i}`} id={i.toString()} index={i} onTrashClick={onTrashClick}>
              {numbered ? `${i + 1}. ` : ""}
              {x}
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
