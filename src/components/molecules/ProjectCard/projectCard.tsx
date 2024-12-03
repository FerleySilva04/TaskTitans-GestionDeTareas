import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Project } from "@/types/projects";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MdDelete, MdEdit } from "react-icons/md"; // Nuevos íconos de Material Design
import useMiddleware from "@/hooks/useMiddleware";
import { Role } from "@/types/users";
import { useEffect, useState } from "react";
import DeleteProjectPopup from "@/components/molecules/DeleteProjectPopup/deleteProjectPopup";
import EditProjectPopup from "@/components/molecules/EditProjectPopup/editProjectPopup";

interface ProjectCardProps {
  project: Project;
}

const CircleProgress = ({ progress }: { progress: number }) => {
  const radius = 36; // Radio del círculo
  const stroke = 8; // Grosor del borde
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg width="100" height="100" className="transform rotate-90">
      <circle
        cx="50"
        cy="50"
        r={radius}
        stroke="#e2e8f0" // Color de fondo
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx="50"
        cy="50"
        r={radius}
        stroke="url(#gradBlue)" // Gradiente azul
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="gradBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const user = useMiddleware(Role.USER);
  const [isAdmin, setIsAdmin] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  // Verificar si el usuario es administrador
  useEffect(() => {
    if (user?.role === Role.ADMIN) {
      setIsAdmin(true);
    }
  }, [user]);

  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;
  const progressPercentage =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="max-w-sm mx-auto">
      <Card className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden transition-all hover:scale-105 hover:shadow-xl">
        {/* Header con título del proyecto */}
        <CardHeader className="p-4 bg-gradient-to-r from-blue-300 to-blue-500 text-white">
          <h2 className="text-xl font-semibold">{project.name}</h2>
        </CardHeader>

        {/* Contenido con descripción del proyecto */}
        <div className="p-6">
          <p className="text-gray-800 text-sm leading-relaxed">
            {project.description || "No description available."}
          </p>

          {/* Barra de progreso circular */}
          <div className="flex justify-center mt-6">
            <CircleProgress progress={progressPercentage} />
          </div>

          {/* Texto con progreso */}
          <p className="text-center text-sm text-gray-600 font-medium mt-2">
            Progress: {completedTasks} / {totalTasks} tasks completed
          </p>
        </div>

        {/* Footer con enlace y botones */}
        <CardFooter className="p-4 flex justify-between items-center border-t border-gray-200 bg-gray-50">
          {/* Enlace "View Tasks" */}
          <Link
            href={{
              pathname: "/admin/tasks/[id]",
              query: { id: project.id },
            }}
            className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline transition duration-200"
          >
            View Tasks
          </Link>

          <div className="flex space-x-4">
            {/* Botón para abrir el popup de eliminación */}
            {isAdmin && (
              <Button
                className="flex items-center justify-center p-2 rounded-md border border-red-500 text-red-500 hover:bg-red-100"
                onClick={() => setOpenDelete(true)}
              >
                <MdDelete className="w-5 h-5" />
              </Button>
            )}

            {/* Botón para abrir el popup de edición */}
            {isAdmin && (
              <Button
                className="flex items-center justify-center p-2 rounded-md border border-blue-500 text-blue-500 hover:bg-blue-100"
                onClick={() => setOpenEdit(true)}
              >
                <MdEdit className="w-5 h-5" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      <DeleteProjectPopup
        open={openDelete}
        setOpen={setOpenDelete}
        project={project}
      />
      <EditProjectPopup
        open={openEdit}
        setOpen={setOpenEdit}
        project={project}
      />
    </div>
  );
};
