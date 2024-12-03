import { useRouter } from "next/router";
import React from "react";
import TaskCard from '@/components/organism/TaskData';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import AdminLayout from "@/layouts/_layout";
import useMiddleware from "@/hooks/useMiddleware";
import { Role } from "@/utils/enums";
import { IsLoading } from "@/components/molecules/Loading/isLoading";

const TasksProject = () => {
  const router = useRouter();
  const { id } = router.query; // Extrae el parámetro `id` de la URL

  const user = useMiddleware(Role.USER);

  if (!user) {
    return <IsLoading />;
  }

  if (!id) {
    return <p>Cargando...</p>;
  }

  return (
    <AdminLayout user={user}>
      <div className="w-4/5 mx-auto">
        {/* Título estilizado */}
        <h1 className="text-3xl font-bold tracking-tight text-blue-500">
          Gestión de tareas.
        </h1>
        <Button className={`${user.role === 'ADMIN' ? 'm-4' : 'hidden'}`} asChild>
          <Link href={{ pathname: "/admin/tasks/create/[id]", query: { id: id } }}>
            <Plus /> Agregar una tarea
          </Link>
        </Button>
        <TaskCard id={id as string} />
      </div>
    </AdminLayout>
  );
};

export default TasksProject;
