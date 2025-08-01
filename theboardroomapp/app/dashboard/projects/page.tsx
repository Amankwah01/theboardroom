import { createClient } from '@/lib/supabase/server-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default async function Projects() {
  const supabase = await createClient();
  const { data: projects } = await supabase.from('projects').select('*');

  async function createProject(formData: FormData) {
    'use server';
    const supabase = await createClient();
    const project_name = formData.get('project_name') as string;
    const description = formData.get('description') as string;
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user!.id).single();

    await supabase.from('projects').insert({
      organization_id: profile!.organization_id,
      project_name,
      description,
      status: 'Not Started',
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Projects</h1>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Create New Project</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
          </DialogHeader>
          <form action={createProject} className="space-y-4">
            <div>
              <Label htmlFor="project_name">Project Name</Label>
              <Input id="project_name" name="project_name" required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" />
            </div>
            <Button type="submit">Create</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Card>
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects?.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <Link href={`/dashboard/projects/${project.id}`} className="text-blue-600 hover:underline">
                      {project.project_name}
                    </Link>
                  </TableCell>
                  <TableCell>{project.status}</TableCell>
                  <TableCell>{project.due_date || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}