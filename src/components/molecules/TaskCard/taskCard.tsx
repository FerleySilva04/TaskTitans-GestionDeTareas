import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Task } from "@/types/tasks";
import { useEffect, useState } from "react";
import { MdDelete, MdEdit, MdAssignment } from "react-icons/md"; // Nuevos íconos de Material Design
import DeleteTaskPopup from "@/components/molecules/DeleteTaskPopup/deleteTaskPopup";
import EditTaskPopup from "@/components/molecules/EditTaskPopup/editTaskPopup";
import { handleShowStatus } from "@/utils/helpers";
import useMiddleware from "@/hooks/useMiddleware";
import { Role } from "@/types/users";

interface TaskCardProps {
  task: Task;
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

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const user = useMiddleware(Role.USER);
  const [isAdmin, setIsAdmin] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    if (user?.role === Role.ADMIN) {
      setIsAdmin(true);
    }
  }, [user]);

  const handleDateFormated = (timestamp: string): string => {
    const date = new Date(Number(timestamp));
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  };

  const progress = task.status === "COMPLETED" ? 100 : task.status === "IN_PROGRESS" ? 50 : 0;

  const canEdit = task.assignee?.id === user?.id; // Verificar si el usuario es el asignado
  const canDelete = isAdmin; // Solo ADMIN puede eliminar

  return (
    <div className="max-w-sm mx-auto">
      <Card className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden transition-all hover:scale-105 hover:shadow-xl">
        {/* Header con título de la tarea */}
        <CardHeader className="p-4 bg-gradient-to-r from-blue-300 to-blue-500 text-white">
          <div className="flex justify-center items-center space-x-2">
            <MdAssignment className="text-white w-6 h-6" />
            <h2 className="text-xl font-semibold">{task.title}</h2>
          </div>
        </CardHeader>

        {/* Contenido con descripción de la tarea */}
        <div className="p-6">
          <p className="text-gray-800 text-sm leading-relaxed">
            {task.description || "No description available."}
          </p>

          {/* Barra de progreso circular */}
          <div className="flex justify-center mt-6">
            <CircleProgress progress={progress} />
          </div>

          {/* Texto con progreso */}
          <p className="text-center text-sm text-gray-600 font-medium mt-2">
            Progress: {task.status === "COMPLETED" ? "Completed" : task.status === "IN_PROGRESS" ? "In Progress" : "Pending"}
          </p>
        </div>

        {/* Footer con botones de acción */}
        <CardFooter className="p-4 flex justify-between items-center border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-4">
            {/* Botón para abrir el popup de eliminación, solo visible para ADMIN */}
            {canDelete && (
              <Button
                className="flex items-center justify-center p-2 rounded-md border border-red-500 text-red-500 hover:bg-red-100"
                onClick={() => setOpenDelete(true)}
              >
                <MdDelete className="w-5 h-5" />
              </Button>
            )}

            {/* Botón para abrir el popup de edición, visible solo si la tarea está asignada al usuario o si es ADMIN */}
            {(canEdit || isAdmin) && (
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

      {/* Popups */}
      <DeleteTaskPopup open={openDelete} setOpen={setOpenDelete} task={task} />
      <EditTaskPopup open={openEdit} setOpen={setOpenEdit} task={task} />
    </div>
  );
};
