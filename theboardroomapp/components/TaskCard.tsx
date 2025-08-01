// components/TaskCard.tsx
import { useDraggable } from "@dnd-kit/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@/lib/types";

export function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: String(task.id), // Unique ID for the draggable item
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Card className="m-2">
        <CardHeader>
          <CardTitle>{task.task_title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Status:</strong> {task.status}
          </p>
          <p>
            <strong>Due Date:</strong> {task.due_date || "N/A"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
