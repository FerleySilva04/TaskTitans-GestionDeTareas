"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, User, Mail, Lock } from "lucide-react"; // Cambié el ícono de Plus por Save
import { useMutation } from "@apollo/client";
import { UPDATE_USER_MUTATION } from "@/utils/graphql/mutations/users";
import { UserProps } from "@/utils/enums";
import { Icons } from "@/components/ui/icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, Snackbar } from '@mui/material';
import { useState } from "react";
import { GET_ALL_USERS_QUERY } from "@/utils/graphql/queries/users";

interface UserEditFormProps {
    user: UserProps;
}

export const UserEditForm: React.FC<UserEditFormProps> = ({ user }) => {
    const [updateUser, { loading }] = useMutation(UPDATE_USER_MUTATION);
    const [openInfo, setOpenInfo] = useState<boolean>(false);
    const [openError, setOpenError] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const role = formData.get('role') as string;

        const { data, errors } = await updateUser({
            variables: {
                id: user.id,
                name,
                email,
                password,
                role,
            },
            refetchQueries: [{ query: GET_ALL_USERS_QUERY }]
        });

        if (data) {
            setOpenInfo(true);
            form.reset();
        }

        if (errors) {
            setOpenInfo(true);
            setOpenError(true);
        }
    }

    return (
        <div className="flex items-center justify-center w-full bg-gradient-to-r from-blue-300 to-blue-500 px-2">
            <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-lg w-full max-w-xs mt-8 mb-6">
                <div className="text-center mb-4">
                    <h2 className="text-2xl font-bold text-blue-500">Editar Usuario</h2>
                </div>

                <div className="relative mb-3">
                    <Input type='text'
                        name='name'
                        id='name'
                        placeholder='Ingrese el nombre'
                        defaultValue={user.name}
                        className='pl-10'
                        required />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                </div>

                <div className="relative mb-3">
                    <Input type='email'
                        name='email'
                        id='email'
                        placeholder='Ingrese el email'
                        defaultValue={user.email}
                        className='pl-10'
                        required />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                </div>

                <div className="relative mb-3">
                    <Input type='password'
                        name='password'
                        id='password'
                        placeholder='Ingrese la contraseña'
                        className='pl-10'
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                </div>

                <div className="relative mb-4">
                    <Select name='role' required>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona un Rol" defaultValue={user.role} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="USER">USER</SelectItem>
                            <SelectItem value="ADMIN">ADMIN</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Button type='submit' className='w-full bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg transition duration-200 ease-in-out transform hover:scale-105' disabled={loading}>
                        {loading ? (
                            <><Icons.spinner className="mr-2 h-4 w-4 animate-spin" />Actualizando...</>
                        ) : (
                            <><Save className="mr-2 h-4 w-4" />Guardar Cambios</>
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
                {openError ? <Alert severity="error" variant="filled">Hubo un error al actualizar el usuario</Alert> :
                    <Alert severity="success" variant="filled">Usuario actualizado exitosamente</Alert>}
            </Snackbar>
        </div>
    );
};

export default UserEditForm;
