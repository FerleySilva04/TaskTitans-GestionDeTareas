"use client";

import AdminLayout from "@/layouts/_layout";
import UserCreationForm from "@/components/organism/Register";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import { useRouter } from "next/router";
import { IsLoading } from "@/components/molecules/Loading/isLoading";
import useMiddleware from "@/hooks/useMiddleware";
import { Role } from "@/utils/enums";
import { FiUserPlus } from "react-icons/fi"; // Icono de React Icons

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
                        <FiUserPlus className="text-primary-500 text-6xl mb-4" />
                        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
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
