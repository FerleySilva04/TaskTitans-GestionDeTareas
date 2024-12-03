import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Button } from "@mui/material";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DELETE_PROJECT } from "@/utils/graphql/mutations/project";
import { Project } from "@/types/projects";
import { GET_PROJECTS } from "@/utils/graphql/queries/projects";

interface DeleteProjectPopupProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  project: Project;
}

const DeleteProjectPopup: React.FC<DeleteProjectPopupProps> = ({
  open,
  setOpen,
  project,
}) => {
  const [deleteProject, { loading }] = useMutation(DELETE_PROJECT, {
    variables: { id: project.id },
    refetchQueries: [{ query: GET_PROJECTS }],
    awaitRefetchQueries: true,
  });

  const handleDelete = async () => {
    try {
      const { data } = await deleteProject({
        variables: {
          id: project.id,
        },
      });

      if (data) {
        toast.success("Proyecto eliminado exitosamente.");
        setOpen(false); // Cerrar el popup después de eliminar el proyecto
      }
    } catch (error) {
      toast.error("Error al eliminar el proyecto. Por favor, intenta nuevamente.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="delete-project-title"
      aria-describedby="delete-project-description"
    >
      <DialogTitle id="delete-project-title">Eliminar Proyecto</DialogTitle>
      <DialogContent>
        <p id="delete-project-description">
          ¿Estás seguro de que quieres eliminar el proyecto{" "}
          <strong>{project.name}</strong>? Esta acción no se puede deshacer.
        </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="primary">
          Cancelar
        </Button>
        <Button
          onClick={handleDelete}
          color="secondary"
          disabled={loading}
          variant="contained"
          sx={{ backgroundColor: "red", color: "white", "&:hover": { backgroundColor: "darkred" } }}
        >
          {loading ? "Eliminando..." : "Eliminar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteProjectPopup;
