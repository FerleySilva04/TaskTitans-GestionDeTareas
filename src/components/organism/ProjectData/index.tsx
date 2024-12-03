import useMiddleware from "@/hooks/useMiddleware";
import { GetProjects, Project } from "@/types/projects";
import { Role } from "@/types/users";
import { GET_PROJECTS } from "@/utils/graphql/queries/projects";
import { useQuery } from "@apollo/client";
import { ProjectCard } from "@/components/molecules/ProjectCard/projectCard";
import { useEffect, useState } from "react";
import { IsLoading } from "@/components/molecules/Loading/isLoading";
import { Alert } from "@mui/material";

export const ProjectData = () => {
  const { data, error, loading } = useQuery<GetProjects>(GET_PROJECTS);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const projects = data?.projects || [];

  const user = useMiddleware(Role.USER);

  useEffect(() => {
    if (user?.role === Role.USER && data?.projects) {
      const userProjects = projects.filter((project) =>
        project.tasks.some((task) => task.assignee?.id === user.id)
      );
      console.log(projects);
      console.log('userprojects', userProjects);
      setFilteredProjects(userProjects);
    }
    console.log(projects);

  }, [data]);

  if (loading) return <p>Cargando Proyectos...</p>;
  if (error) return <p>Error al cargar proyectos: {error.message}</p>;

  if (!user || !projects) {
    return <IsLoading />
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {user?.role === Role.USER && (
        <>
          {filteredProjects.length === 0 ? (
            <Alert severity="info">No tienes proyectos asignados</Alert>
          ) : null
          }
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </>
      )}
      {user?.role === Role.ADMIN && (
        <>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </>
      )}
    </div>
  );
};
export default ProjectData;