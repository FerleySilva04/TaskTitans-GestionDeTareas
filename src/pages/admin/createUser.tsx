"use client";

import AdminLayout from "@/layouts/_layout";
import UserCreationForm from "@/components/organism/Register";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import { useRouter } from "next/router";
import { IsLoading } from "@/components/molecules/Loading/isLoading";
import useMiddleware from "@/hooks/useMiddleware";
import { Role } from "@/utils/enums";
import { AiOutlineUserAdd } from "react-icons/ai"; // Cambié el icono aquí

const CreateUserPage: React.FC = () => {
    const user = useMiddleware(Role.ADMIN);

    const router = useRouter();

    const handleBack = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        router.back();
    };

    if (!user) {
        return <IsLoading />;
    }

    return (
        <AdminLayout user={user}>
            <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-50">
                <div className="bg-white shadow-lg rounded-lg p-8 w-3/4 md:w-1/2 lg:w-1/3">
                    <div className="flex flex-col items-center">
                        <AiOutlineUserAdd className="text-blue-500 text-6xl mb-4" /> {/* Nuevo icono con color azul */}
                        <h1 className="text-3xl font-bold text-blue-500 mb-4 text-center"> {/* Título en azul */}
                            Agregar un Usuario
                        </h1>
                    </div>
                    <UserCreationForm />
                    <Button
                        variant="secondary"
                        className="mt-6 w-full flex items-center justify-center"
                        onClick={handleBack}
                    >
                        <Undo2 className="mr-2" /> Regresar
                    </Button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default CreateUserPage;
