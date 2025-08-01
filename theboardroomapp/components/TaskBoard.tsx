'use client';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { TaskCard } from '@/components/TaskCard';
import { Task } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TaskBoardProps {
  tasks: Task[];
  updateTaskStatus: (taskId: number, newStatus: string) => Promise<void>;
}

export function TaskBoard({ tasks, updateTaskStatus }: TaskBoardProps) {
  const statuses = ['Open', 'In Progress', 'Done'];

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overStatus = over.id as string;

    const task = tasks.find((t) => t.id === Number(activeId));
    if (task && task.status !== overStatus) {
      await updateTaskStatus(task.id, overStatus);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statuses.map((status) => (
          <Card key={status}>
            <CardHeader>
              <CardTitle>{status}</CardTitle>
            </CardHeader>
            <CardContent>
              <SortableContext items={tasks.filter((t) => t.status === status).map((t) => String(t.id))}>
                {tasks
                  .filter((t) => t.status === status)
                  .map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
              </SortableContext>
            </CardContent>
          </Card>
        ))}
      </div>
    </DndContext>
  );
}
