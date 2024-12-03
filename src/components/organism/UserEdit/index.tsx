"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Check, Mail, Lock, User, Shield } from "lucide-react";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@apollo/client";
import { UPDATE_USER_MUTATION } from "@/utils/graphql/mutations/users";
import { useRouter } from "next/router";
import { UserProps } from "@/utils/enums";
import { Icons } from "@/components/ui/icons";

const FormSchema = z.object({
    name: z.string().nonempty({
        message: "El nombre no puede estar vacío",
    }),
    email: z.string().email({
        message: "El email no es válido",
    }),
    password: z.string().optional(), // Contraseña es opcional
    role: z.enum(["USER", "ADMIN"], {
        required_error: "El rol es requerido",
    }),
});

interface UserEditFormProps {
    user: UserProps;
}

export const UserEditForm: React.FC<UserEditFormProps> = ({ user }) => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
            password: "",
            role: user.role,
        },
    });

    const router = useRouter();
    const [updateUser] = useMutation(UPDATE_USER_MUTATION);
    const [loading, setLoading] = React.useState<boolean>(false);

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        setLoading(true);
        const { data: success, errors } = await updateUser({
            variables: {
                id: user.id,
                name: data.name,
                email: data.email,
                password: data.password || undefined,
                role: data.role,
            },
        });
        if (success) {
            toast.success("Usuario actualizado exitosamente", {
                icon: false, // Elimina el ícono predeterminado
            });
            setLoading(false);
            router.push({
                pathname: "/admin/users",
                query: { reload: true },
            });
        }
        if (errors) {
            toast.error("Ocurrió un error al actualizar el usuario", {
                icon: false, // Elimina el ícono predeterminado
            });
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center py-12">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 w-full max-w-lg bg-white p-6 shadow rounded-md"
                >
                    {/* Nombre */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <User className="h-5 w-5" /> Nombre
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="John Doe"
                                        {...field}
                                        className="w-full p-2"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Email */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Mail className="h-5 w-5" /> Email
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="john.doe@example.com"
                                        {...field}
                                        className="w-full p-2"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Contraseña */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Lock className="h-5 w-5" /> Contraseña
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="********"
                                        {...field}
                                        className="w-full p-2"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Rol */}
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" /> Rol
                                </FormLabel>
                                <FormControl>
                                    <select
                                        {...field}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="USER">USER</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Botón de actualización */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2"
                    >
                        {loading ? (
                            <>
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                Actualizando...
                            </>
                        ) : (
                            <>
                                <Check className="mr-2 h-4 w-4" />
                                Actualizar
                            </>
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default UserEditForm;
