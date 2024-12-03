"use client";

import * as React from "react";
import { useMutation } from "@apollo/client";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LOGIN_MUTATION } from "@/utils/graphql/mutations/auth";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { FiClipboard } from "react-icons/fi";

export function UserAuthForm({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [login] = useMutation(LOGIN_MUTATION);
    const [wrongPassword, setWrongPassword] = React.useState<string | null>(null);
    const router = useRouter();

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        setIsLoading(true);
        setWrongPassword(null); // Resetea el mensaje de error.

        const formData = new FormData(event.target as HTMLFormElement);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const { data, errors } = await login({
                variables: { email, password },
            });

            if (data?.login) {
                localStorage.setItem("token", data.login.token);
                await router.push('/admin');
            } else if (errors) {
                setWrongPassword("Usuario o contraseña incorrectos.");
                toast.error("Usuario o contraseña incorrectos", {
                    icon: false, 
                });
            }
        } catch (error: any) {
            console.error("Error inesperado:", error);
            setWrongPassword("Ocurrió un problema al iniciar sesión. Inténtalo más tarde.");
            toast.error("Error inesperado, por favor intenta de nuevo.", {
                icon: false, 
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={cn("grid gap-6 bg-gray-50 p-6 rounded-md shadow-md", className)} {...props}>
            <div className="flex flex-col items-center space-y-2 text-center">
                <FiClipboard className="h-10 w-10 text-blue-400" />
                <h1 className="text-3xl font-bold tracking-tight text-blue-500">
                    Bienvenido a TaskManager
                </h1>
                <p className="text-sm text-gray-500">
                    Organiza tus tareas de manera sencilla y eficiente
                </p>
            </div>
            <form onSubmit={onSubmit}>
                <div className="grid gap-3">
                    <div className="grid gap-2">
                        <Label className="sr-only" htmlFor="email">
                            Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            placeholder="name@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label className="sr-only" htmlFor="password">
                            Contraseña
                        </Label>
                        <Input
                            id="password"
                            name="password"
                            placeholder="contraseña"
                            type="password"
                            disabled={isLoading}
                        />
                    </div>
                    {wrongPassword && (
                        <p className="text-red-500 text-center">{wrongPassword}</p>
                    )}
                    <Button
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                        disabled={isLoading}
                    >
                        {isLoading && (
                            <svg
                                className="mr-2 h-4 w-4 animate-spin"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C6.477 0 0 6.477 0 12h4zm2 5.291A7.964 7.964 0 014 12H0c0 2.42.878 4.646 2.329 6.357l1.671-1.066z"
                                />
                            </svg>
                        )}
                        Iniciar sesión
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default UserAuthForm;
