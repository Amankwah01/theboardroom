import { createClient } from '@/lib/supabase/server-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default async function ProjectPage({ params }: { params: { projectId: string } }) {
  const supabase = await createClient();
  const { data: project } = await supabase.from('projects').select('*').eq('id', params.projectId).single();
  const { data: tasks } = await supabase.from('tasks').select('*').eq('project_id', params.projectId);

  async function createTask(formData: FormData) {
    'use server';
    const supabase = await createClient();
    const task_title = formData.get('task_title') as string;
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user!.id).single();

    await supabase.from('tasks').insert({
      organization_id: profile!.organization_id,
      project_id: Number(params.projectId),
      task_title,
      status: 'Open',
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{project?.project_name}</h1>
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Description:</strong> {project?.description || 'N/A'}</p>
          <p><strong>Status:</strong> {project?.status}</p>
          <p><strong>Start Date:</strong> {project?.start_date || 'N/A'}</p>
          <p><strong>Due Date:</strong> {project?.due_date || 'N/A'}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create New Task</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Task</DialogTitle>
              </DialogHeader>
              <form action={createTask} className="space-y-4">
                <div>
                  <Label htmlFor="task_title">Task Title</Label>
                  <Input id="task_title" name="task_title" required />
                </div>
                <Button type="submit">Create</Button>
              </form>
            </DialogContent>
          </Dialog>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks?.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.task_title}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>{task.due_date || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}