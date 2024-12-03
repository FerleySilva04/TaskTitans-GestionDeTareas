import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_TASK } from "@/utils/graphql/mutations/tasks";
import { Task, TaskStatus } from "@/types/tasks";
import { Dialog } from "@mui/material";
import { handleShowStatus } from "@/utils/helpers";
import useMiddleware from "@/hooks/useMiddleware";
import { AllUsers, Role } from "@/types/users";
import { GET_ALL_USERS_QUERY } from "@/utils/graphql/queries/users";
import { IsLoading } from "../Loading/isLoading";
import { GET_TASKS_BY_PROJECT } from "@/utils/graphql/queries/tasks";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { MdTitle, MdDescription, MdPerson, MdUpdate, MdCancel } from "react-icons/md";

interface EditTaskPopupProps {
  open: boolean;
  task: Task;
  setOpen: (open: boolean) => void;
}

const EditTaskPopup: React.FC<EditTaskPopupProps> = ({
  open,
  task: { id, title, description, status, dueDate, assignee },
  setOpen,
}) => {

  const user = useMiddleware(Role.USER);  // Verifica si el usuario tiene el rol adecuado
  const [updateTask, { loading, error }] = useMutation(UPDATE_TASK, {
    update(cache, { data: { updateTask } }) {
      cache.modify({
        fields: {
          tasks(existingTasks = []) {
            return existingTasks.map((task: Task) =>
              task.id === updateTask.id ? updateTask : task
            );
          },
        },
      });
    },
  });

  const { data, loading: loadingUsers } = useQuery<AllUsers>(GET_ALL_USERS_QUERY);
  const router = useRouter();
  const { id: projectId } = router.query;
  const users = data?.users || [];
  const [isAdmin, setIsAdmin] = useState(false);

  const possibleStatus = ["PENDING", "IN_PROGRESS", "COMPLETED"];
  const filteredUsers = users.filter((user) => user.id !== assignee?.id);

  const formatDueDate = (timestamp: string): string => {
    const date = new Date(parseInt(timestamp, 10));
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (user?.role === Role.ADMIN) {
      setIsAdmin(true);
    }
  }, [user]);

  if (loadingUsers) return <IsLoading />;

  const filteredStatus = possibleStatus.filter((s) => s !== status);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const { newTitle, newDescription, newStatus, newDueDate, newAssignee } = Object.fromEntries(formData.entries());
    setOpen(false);

    const { data: success, errors } = await updateTask({
      variables: {
        id,
        title: newTitle as string,
        description: newDescription as string,
        status: newStatus as TaskStatus,
        dueDate: new Date(newDueDate as string),
        assigneeId: newAssignee ? parseInt(newAssignee as string) : null,
      },
      refetchQueries: [
        {
          query: GET_TASKS_BY_PROJECT,
          variables: { projectId },
        },
      ],
      awaitRefetchQueries: true,
    });

    if (success) {
      toast.success("Tarea actualizada correctamente");
    } else if (errors) {
      toast.error("Error al actualizar la tarea");
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <div className="bg-white p-8 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
          <MdUpdate className="text-blue-500" />
          <span>Editar Tarea</span>
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <div className="flex items-center space-x-2">
              <MdTitle className="text-gray-500" />
              <Input
                id="newTitle"
                name="newTitle"
                defaultValue={title}
                disabled={!isAdmin}
              />
            </div>
          </div>
          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <div className="flex items-center space-x-2">
              <MdDescription className="text-gray-500" />
              <Textarea
                id="newDescription"
                name="newDescription"
                defaultValue={description}
                disabled={!isAdmin}
              />
            </div>
          </div>
          {/* Asignar Usuario */}
          <div className="space-y-2">
            <Label htmlFor="newAssignee">Asignar a</Label>
            <div className="flex items-center space-x-2">
              <MdPerson className="text-gray-500" />
              <select
                id="newAssignee"
                name="newAssignee"
                className="w-full p-3 border rounded"
                disabled={!isAdmin}
                defaultValue={assignee?.id || ""}
              >
                <option value={assignee?.id || ""}>
                  {assignee?.name || "Sin asignar"}
                </option>
                {filteredUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Estado */}
          <div className="space-y-2">
            <Label htmlFor="newStatus">Estado</Label>
            <select id="newStatus" name="newStatus" className="w-full p-2 border rounded">
              <option value={status}>{handleShowStatus(status)}</option>
              {filteredStatus.map((status) => (
                <option key={status} value={status}>
                  {handleShowStatus(status as TaskStatus)}
                </option>
              ))}
            </select>
          </div>
          {/* Fecha de vencimiento */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Fecha de vencimiento</Label>
            <Input
              id="newDueDate"
              type="datetime-local"
              name="newDueDate"
              defaultValue={formatDueDate(dueDate)}
              disabled={!isAdmin}
            />
          </div>
          {/* Botones */}
          <div className="flex justify-between mt-4">
            <Button
              type="button"
              onClick={() => setOpen(false)}
              className="bg-gray-300 flex items-center space-x-2"
            >
              <MdCancel className="text-gray-500" />
              <span>Cancelar</span>
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <MdUpdate className="text-blue-500" />
              <span>{loading ? "Actualizando..." : "Actualizar Tarea"}</span>
            </Button>
          </div>
        </form>
        {error && <p className="text-red-500 mt-2">{error.message}</p>}
      </div>
    </Dialog>
  );
};

export default EditTaskPopup;
