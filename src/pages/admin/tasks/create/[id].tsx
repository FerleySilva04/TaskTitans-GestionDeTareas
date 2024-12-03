import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_TASK } from '@/utils/graphql/mutations/tasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TaskStatus } from '@/types/tasks';
import { GET_ALL_USERS_QUERY } from '@/utils/graphql/queries/users';
import { AllUsers, Role } from '@/types/users';
import useMiddleware from '@/hooks/useMiddleware';
import AdminLayout from '@/layouts/_layout';
import { IsLoading } from '@/components/molecules/Loading/isLoading';
import { Undo2, CheckSquare, User, FileText, Calendar } from 'lucide-react';
import { GET_TASKS_BY_PROJECT } from '@/utils/graphql/queries/tasks';
import { Alert, Snackbar } from '@mui/material';
import { useState } from 'react';

const CreateTaskPage: React.FC = () => {
  const user = useMiddleware(Role.ADMIN);
  const router = useRouter();
  const { id } = router.query;
  const [openInfo, setOpenInfo] = useState(false);
  const [openError, setOpenError] = useState(false);

  const [createTask, { loading }] = useMutation(CREATE_TASK);
  const { data } = useQuery<AllUsers>(GET_ALL_USERS_QUERY);
  const users = data?.users || [];

  const handleBack = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    router.back();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    const title = data.title as string;
    const description = data.description as string;
    const assignee = data.assignee as string;
    const dueDate = new Date(data.dueDate as string);

    const { data: result, errors } = await createTask({
      variables: {
        assigneeId: assignee,
        title,
        description,
        status: TaskStatus.PENDING,
        dueDate,
        projectId: id,
      },
      refetchQueries: [
        {
          query: GET_TASKS_BY_PROJECT,
          variables: { projectId: id },
        },
      ],
    });

    if (result) {
      setOpenInfo(true);
    }

    if (errors) {
      setOpenInfo(true);
      setOpenError(true);
    }
  };

  if (!user) {
    return <IsLoading />;
  }

  return (
    <AdminLayout user={user}>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex flex-col justify-between h-full">
          {/* Icono y título */}
          <div className="text-center mb-6">
            <CheckSquare className="mx-auto text-5xl text-primary mb-2" />
            <h1 className="text-3xl font-bold tracking-tight text-blue-500">Nueva Tarea</h1>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col w-full items-center">
              {/* Título de la tarea */}
              <div className="space-y-3 w-1/2">
                <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
                  <FileText className="text-blue-500" />
                  Título de la tarea
                </Label>
                <Input
                  id="title"
                  type="text"
                  name="title"
                  placeholder="Ingresa el título"
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Responsable */}
              <div className="space-y-3 w-1/2">
                <Label htmlFor="assignee" className="text-sm font-medium flex items-center gap-2">
                  <User className="text-blue-500" />
                  Responsable
                </Label>
                <select
                  name="assignee"
                  id="assignee"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                >
                  <option value="">Seleccionar Responsable</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Descripción */}
              <div className="space-y-3 w-1/2">
                <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                  <FileText className="text-blue-500" />
                  Descripción
                </Label>
                <Textarea
                  id="description"
                  placeholder="Añadir una descripción"
                  name="description"
                  rows={4}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Fecha de vencimiento */}
              <div className="space-y-3 w-1/2">
                <Label htmlFor="dueDate" className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="text-blue-500" />
                  Fecha de vencimiento
                </Label>
                <Input
                  id="dueDate"
                  type="datetime-local"
                  name="dueDate"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none "
                />
              </div>

              {/* Botón de envío */}
              <div className="flex mt-8 justify-center w-1/2">
                <Button
                  type="submit"
                  disabled={loading}
                  className={`w-fit py-3 rounded-lg text-white font-semibold ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                  {loading ? "Creando tarea..." : "Crear tarea"}
                </Button>
              </div>
            </div>
          </form>

          {/* Botón Regresar */}
          <div className="flex justify-start mt-4">
            <Button variant="secondary" className="mb-2" onClick={handleBack}>
              <Undo2 /> Regresar
            </Button>
          </div>
        </div>

        {/* Notificaciones */}
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={openInfo}
          autoHideDuration={3000}
          onClose={() => setOpenInfo(false)}
          key={"bottomright"}
        >
          {openError ? <Alert severity="error" variant="filled">Error al crear la tarea</Alert> :
            <Alert severity="success" variant="filled">Tarea creada exitosamente</Alert>}
        </Snackbar>
      </div>
    </AdminLayout>
  );
};

export default CreateTaskPage;
