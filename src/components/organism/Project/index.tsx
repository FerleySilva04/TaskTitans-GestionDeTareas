import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_PROJECT } from "@/utils/graphql/mutations/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, Snackbar } from "@mui/material";
import { GET_PROJECTS } from "@/utils/graphql/queries/projects";
import { FaPlus, FaInfoCircle } from "react-icons/fa"; // Importando iconos de react-icons

const CreateProjectPage: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [openInfo, setOpenInfo] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [createProject, { loading }] = useMutation(CREATE_PROJECT);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, errors } = await createProject({
      variables: {
        name,
        description,
      },
      refetchQueries: [
        {
          query: GET_PROJECTS
        }
      ],
    });

    if (data) {
      setOpenInfo(true);
    }

    if (errors) {
      setOpenError(true);
      setOpenInfo(true);
    }
  };

  return (
    <div className="container mx-auto p-8 flex flex-col max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nombre del Proyecto</Label>
          <div className="flex items-center border border-gray-300 rounded-md">
            <FaPlus className="text-gray-500 mx-3" /> {/* Icono de Plus */}
            <Input
              id="name"
              name="name"
              placeholder="Introduce el nombre del proyecto"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="description" className="text-sm font-medium text-gray-700">Descripción</Label>
          <div className="flex items-center border border-gray-300 rounded-md">
            <FaInfoCircle className="text-gray-500 mx-3" /> {/* Icono de Info */}
            <Textarea
              id="description"
              name="description"
              placeholder="Introduce una breve descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto mt-4 text-white bg-blue-600 hover:bg-blue-700 flex items-center">
            {loading ? (
              <>
                <span className="animate-spin">🔄</span> Creando proyecto...
              </>
            ) : (
              <>
                <FaPlus className="mr-2" /> Crear proyecto
              </>
            )}
          </Button>
        </div>
      </form>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={openInfo}
        autoHideDuration={3000}
        onClose={() => setOpenInfo(false)}
        key={"bottomright"}
      >
        {openError ? (
          <Alert severity="error" variant="filled" className="text-sm">Error al crear el proyecto</Alert>
        ) : (
          <Alert severity="success" variant="filled" className="text-sm">Proyecto creado exitosamente</Alert>
        )}
      </Snackbar>
    </div>
  );
};

export default CreateProjectPage;
