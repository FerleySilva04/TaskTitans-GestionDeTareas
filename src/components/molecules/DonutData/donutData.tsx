import { GET_PROJECTS } from "@/utils/graphql/queries/projects";
import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Project } from "@/types/projects";
import { Task } from "@/types/tasks";
import { TaskStatus } from "@/types/tasks";

export const DonutData = () => {
  const { data: projectsData, loading: projectsLoading } = useQuery(GET_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>("all");

  // Obtener tareas según el proyecto seleccionado
  const projectTasks = useMemo(() => {
    if (!projectsData) return [];
    if (selectedProjectId === "all") {
      return projectsData.projects.flatMap((project: Project) => project.tasks);
    } else {
      const selectedProject = projectsData.projects.find(
        (project: Project) => project.id === selectedProjectId
      );
      return selectedProject ? selectedProject.tasks : [];
    }
  }, [selectedProjectId, projectsData]);

  // Contar tareas por estado
  const taskCounts = useMemo(() => {
    const counts = { PENDING: 0, IN_PROGRESS: 0, COMPLETED: 0 };
    projectTasks.forEach((task: Task) => {
      counts[task.status as keyof typeof TaskStatus]++;
    });
    return counts;
  }, [projectTasks]);

  // Colores para cada estado
  const colors = {
    PENDING: "#FFB703",
    IN_PROGRESS: "#219EBC",
    COMPLETED: "#06D6A0",
  };

  // Datos para el gráfico
  const chartData = [
    { name: "Pendientes", value: taskCounts.PENDING, color: colors.PENDING },
    { name: "En Progreso", value: taskCounts.IN_PROGRESS, color: colors.IN_PROGRESS },
    { name: "Completadas", value: taskCounts.COMPLETED, color: colors.COMPLETED },
  ];

  return (
    <Card className="shadow-lg rounded-xl overflow-hidden bg-white border border-gray-200">
      <CardHeader className="text-center p-4 bg-gradient-to-r from-blue-300 to-blue-500 text-white">
        <CardTitle className="text-2xl font-semibold">
          Estado de las Tareas
        </CardTitle>
        <CardDescription className="mt-2 text-sm font-light">
          Selecciona un proyecto para ver el desglose.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 flex flex-col items-center">
        {/* Dropdown para seleccionar proyecto */}
        {projectsLoading ? (
          <p className="text-gray-500">Cargando proyectos...</p>
        ) : (
          <Select onValueChange={setSelectedProjectId} defaultValue="all">
            <SelectTrigger className="w-full border-gray-300 shadow-sm">
              <SelectValue placeholder="Selecciona un proyecto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los proyectos</SelectItem>
              {projectsData?.projects.map((project: Project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Gráfico de Dona */}
        {projectTasks.length > 0 ? (
          <div className="flex flex-col items-center">
            <PieChart width={320} height={320}>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                label={false}
                labelLine={false}
                isAnimationActive={true}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value} tareas`, `${name}`]}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend
                verticalAlign="bottom"
                align="center"
                height={36}
                formatter={(value) => (
                  <span style={{ color: "#555", fontWeight: "bold" }}>{value}</span>
                )}
              />
            </PieChart>
          </div>
        ) : (
          <p className="text-gray-500">
            No hay tareas asignadas para este proyecto.
          </p>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-center p-4 bg-gradient-to-r from-blue-300 to-blue-500 text-white">
        <p className="text-sm text-gray-500">
          Actualiza las tareas para reflejar el progreso en tiempo real.
        </p>
      </CardFooter>
    </Card>
  );
};
