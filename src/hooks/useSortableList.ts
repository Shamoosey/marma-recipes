import { KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

export function useSortableList(data: string[], onReorder: (newData: string[]) => void) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id);
      const newIndex = parseInt(over.id);
      const newData = arrayMove(data, oldIndex, newIndex);
      onReorder(newData);
    }
  }

  const items = data.map((_, i) => i.toString());

  return { sensors, handleDragEnd, items };
}
