import { createClient } from '@/lib/supabase/server-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: projects } = await supabase.from('projects').select('*');

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {projects?.map((project) => (
              <li key={project.id}>
                <Link href={`/dashboard/projects/${project.id}`} className="text-blue-600 hover:underline">
                  {project.project_name} ({project.status})
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/dashboard/projects">
            <button className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
              View All Projects
            </button>
          </Link>
        </CardContent>
      </Card>
      <Link href="/dashboard/tasks">
        <button className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600">
          Manage Tasks
        </button>
      </Link>
    </div>
  );
}
