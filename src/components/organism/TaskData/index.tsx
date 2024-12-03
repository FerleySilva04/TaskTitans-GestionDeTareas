import { GET_TASKS_BY_PROJECT } from "@/utils/graphql/queries/tasks";
import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";

import { Task, TaskByProject } from "@/types/tasks";
import { TaskCard } from "@/components/molecules/TaskCard/taskCard";
import useMiddleware from "@/hooks/useMiddleware";
import { Role } from "@/types/users";
import { Alert, CircularProgress } from "@mui/material";

interface TaskDataProps {
  id: string; // ID del proyecto
}

const TaskData: React.FC<TaskDataProps> = ({ id }) => {
  const user = useMiddleware(Role.USER);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  // Consulta GraphQL para obtener las tareas del proyecto
  const { data, loading, error } = useQuery<TaskByProject>(GET_TASKS_BY_PROJECT, {
    variables: { projectId: id },
  });

  // Filtrar tareas solo cuando los datos cambian o el usuario cambia
  useEffect(() => {
    if (data?.tasksByProject && user?.role === Role.USER) {
      const userTasks = data.tasksByProject.filter((task) => task.assignee?.id === user.id);
      setFilteredTasks(userTasks);
    }
  }, [data, user]);

  if (loading) return <div className="flex justify-center items-center"><CircularProgress /></div>; // Spinner cargando
  if (error) return <Alert severity="error">Error al cargar tareas: {error.message}</Alert>; // Error al cargar

  const tasks = user?.role === Role.USER ? filteredTasks : data?.tasksByProject || [];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
      {tasks.length === 0 ? (
        <Alert severity="info">
          {user?.role === Role.USER ? "No tienes tareas asignadas" : "Aún no hay tareas para este Proyecto"}
        </Alert>
      ) : (
        tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))
      )}
    </div>
  );
};

export default TaskData;
