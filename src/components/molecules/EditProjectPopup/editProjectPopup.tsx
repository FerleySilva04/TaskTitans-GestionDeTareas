import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { Button } from "@/components/ui/button"; // Asegúrate de que sea el botón de Shadcn UI
import { useMutation } from "@apollo/client";
import { UPDATE_PROJECT } from "@/utils/graphql/mutations/project";
import { Project } from "@/types/projects";
import { GET_PROJECTS } from "@/utils/graphql/queries/projects";
import { toast } from "react-toastify";
import { FaEdit, FaRegTimesCircle } from "react-icons/fa"; // Importando iconos de react-icons

interface EditProjectPopupProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  project: Project;
}

const EditProjectPopup: React.FC<EditProjectPopupProps> = ({
  open,
  setOpen,
  project,
}) => {
  const [formData, setFormData] = useState({
    name: project.name || "",
    description: project.description || "",
  });

  const [updateProject, { loading }] = useMutation(UPDATE_PROJECT, {
    refetchQueries: [{ query: GET_PROJECTS }],
    awaitRefetchQueries: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const { data, errors } = await updateProject({
      variables: {
        id: project.id,
        name: formData.name,
        description: formData.description,
      },
    });

    if (data) {
      toast.success("Proyecto actualizado correctamente");
    }
    if (errors) {
      toast.error("Ha ocurrido un error al actualizar el proyecto");
    }

    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>
        <FaEdit style={{ marginRight: 8 }} /> Editar Proyecto
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Nombre"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Descripción"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="secondary" className="flex items-center">
          <FaRegTimesCircle style={{ marginRight: 8 }} /> Cancelar
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          disabled={loading}
          className="flex items-center"
        >
          {loading ? (
            <>
              <span className="animate-spin">🔄</span> Guardando...
            </>
          ) : (
            <>
              <FaEdit style={{ marginRight: 8 }} /> Guardar
            </>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProjectPopup;
