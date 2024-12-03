import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Project } from "@/types/projects";
import { Task } from "@/types/tasks";
import { useQuery } from "@apollo/client";
import { GET_PROJECTS } from "@/utils/graphql/queries/projects";
import { useState } from "react";
import { IsLoading } from "@/components/molecules/Loading/isLoading";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Alert } from "@mui/material";

export const BarData = () => {
    const { data, loading: projectsLoading } = useQuery(GET_PROJECTS);
    const projects = data?.projects || [];
    const [selectedProjectId, setSelectedProjectId] = useState<string>("all");

    const generateRandomColor = () => {
        const hue = Math.floor(Math.random() * 360);
        const saturation = Math.floor(Math.random() * 40) + 60; // 60% - 100%
        const lightness = Math.floor(Math.random() * 30) + 50; // 50% - 80%
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    const filteredProjects: Project[] =
        selectedProjectId === "all"
            ? projects
            : projects.filter((project: Project) => project.id === selectedProjectId);

    const chartData: { name: string; totalCompleted: number; fill: string }[] = [];
    const chartConfig: ChartConfig = {};

    filteredProjects.forEach((project: Project) => {
        const totalTasks = project.tasks.length;
        const completedTasks = project.tasks.filter((task: Task) => task.status === "COMPLETED").length;
        const completedPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        const color = generateRandomColor();

        chartData.push({
            name: project.name,
            totalCompleted: completedPercentage,
            fill: color,
        });

        chartConfig[project.name] = {
            label: project.name,
        };
    });

    return (
        <Card className="shadow-lg rounded-xl overflow-hidden bg-white border border-gray-200">
            <CardHeader className="text-center p-4 bg-gradient-to-r from-blue-300 to-blue-500 text-white">
                <CardTitle className="text-2xl font-semibold">
                    Porcentaje de Tareas Completadas
                </CardTitle>
                <CardDescription className="mt-2 text-sm font-light">
                    Visualiza el progreso de cada proyecto
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center">
                {projectsLoading && <IsLoading />}
                <div className="w-full max-w-md mb-6">
                    <Select onValueChange={setSelectedProjectId} defaultValue="all">
                        <SelectTrigger className="w-full border-gray-300 shadow-sm">
                            <SelectValue placeholder="Selecciona un proyecto" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los proyectos</SelectItem>
                            {projects.map((project: Project) => (
                                <SelectItem key={project.id} value={project.id}>
                                    {project.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {filteredProjects.length === 1 && filteredProjects[0].tasks.length === 0 ? (
                    <Alert severity="info" className="w-full text-center">
                        El proyecto aún no tiene tareas finalizadas o asignadas
                    </Alert>
                ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="w-full max-w-4xl bg-gray-50 rounded-lg p-4"
                    >
                        <BarChart
                            data={chartData}
                            layout="vertical"
                            margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
                        >
                            <YAxis
                                dataKey="name"
                                type="category"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value: string) =>
                                    String(chartConfig[value as keyof typeof chartConfig]?.label || "")
                                }
                            />
                            <XAxis
                                dataKey="totalCompleted"
                                type="number"
                                domain={[0, 100]}
                                tickLine={false}
                                axisLine={true}
                                tickFormatter={(value: number) => `${value}%`}
                            />
                            <ChartTooltip
                                cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar
                                dataKey="totalCompleted"
                                layout="vertical"
                                radius={10}
                                barSize={20}
                            />
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
            <CardFooter className="flex flex-col items-center p-4 bg-gradient-to-r from-blue-300 to-blue-500 text-white">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <TrendingUp size={16} className="mr-1 text-green-500" />
                    Progreso general
                </div>
                <p className="text-sm text-gray-500">
                    Mantente al tanto del rendimiento de los proyectos.
                </p>
            </CardFooter>
        </Card>
    );
};
