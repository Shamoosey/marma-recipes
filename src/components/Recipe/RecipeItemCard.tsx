import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui";
import { useState } from "react";

interface RecipeItemCardProps {
  title: string;
  data: string[];
  ordered?: boolean;
  defaultExpand?: boolean;
}

export function RecipeItemCard({ data, title, ordered = false, defaultExpand = false }: RecipeItemCardProps) {
  const [expanded, setExpanded] = useState(defaultExpand);
  return (
    <div
      className="border rounded flex-grow p-4 min-w-60 bg-stone-200 print:bg-stone-100 print:border-gray-300 cursor-pointer select-none"
      onClick={() => setExpanded(!expanded)}>
      <div className="flex justify-between item-center">
        <span className="text-lg">{title}</span>
        <Button variant="stone" className="print:hidden pointer-events-none">
          {expanded ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>
      {expanded ? (
        <ul className="text-sm mt-4 flex flex-col gap-2 print:mt-1 print:gap-1 print:block print:columns-2">
          {data.map((x, i) => (
            <li key={i} className="mb-1 print:break-inside-avoid">
              {ordered ? `${i + 1}. ${x}` : `- ${x}`}
            </li>
          ))}
        </ul>
      ) : (
        <ul className="hidden print:block text-sm mt-4 gap-2 print:mt-1 print:gap-1 print:columns-2">
          {data.map((x, i) => (
            <li key={i} className="mb-1 print:break-inside-avoid">
              {ordered ? `${i + 1}. ${x}` : `- ${x}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
