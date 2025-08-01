'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/browser-client';
import { TaskBoard } from '@/components/TaskBoard';
import { Task } from '@/lib/types';

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchTasks = async () => {
      const { data } = await supabase.from('tasks').select('*');
      setTasks(data || []);
    };

    fetchTasks();

    const channel = supabase
      .channel('tasks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, (payload) => {
        fetchTasks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const updateTaskStatus = async (taskId: number, newStatus: string) => {
    await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Task Board</h1>
      <TaskBoard tasks={tasks} updateTaskStatus={updateTaskStatus} />
    </div>
  );
}