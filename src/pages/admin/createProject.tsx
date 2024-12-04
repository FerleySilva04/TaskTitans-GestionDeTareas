"use client";

import AdminLayout from "@/layouts/_layout";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import { useRouter } from "next/router";
import { IsLoading } from "@/components/molecules/Loading/isLoading";
import useMiddleware from "@/hooks/useMiddleware";
import { Role } from "@/utils/enums";
import ProjectCreationForm from '@/components/organism/Project';
import { Briefcase } from "lucide-react"; // Importa el icono para el proyecto

const CreateItemPage: React.FC = () => {
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
            <div className="w-4/5 mx-auto flex flex-col min-h-screen">
                <div className="mb-4">
                    <div className="text-center mb-4">
                        {/* Icono centrado sobre el título */}
                        <Briefcase className="text-3xl mb-2 mx-auto text-blue-500" />
                        <h1 className="text-3xl font-bold text-primary">Nuevo proyecto</h1>
                    </div>
                    <ProjectCreationForm />
                </div>
                {/* Contenedor para el botón alineado a la izquierda */}
                <div className="mt-4 flex justify-start">
                    <Button 
                        variant="secondary" 
                        className="w-auto py-3 px-6" 
                        onClick={handleBack}>
                        <Undo2 /> Regresar
                    </Button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default CreateItemPage;
