"use client";

import AdminLayout from "@/layouts/_layout";
import UserEditForm from "@/components/organism/UserEdit";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { GET_USER_QUERY } from "@/utils/graphql/queries/users";
import useMiddleware from "@/hooks/useMiddleware";
import { IsLoading } from "@/components/molecules/Loading/isLoading";
import { Role } from "@/utils/enums";

const EditUserPage: React.FC = () => {
    const user = useMiddleware(Role.ADMIN);

    const router = useRouter();
    const { id } = router.query;

    const { data, loading, error } = useQuery(GET_USER_QUERY, {
        variables: { id },
        skip: !id,
    });

    const handleBack = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        router.back();
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const userData = data?.user;

    if (!user) {
        return <IsLoading />;
    }

    return (
        <AdminLayout user={user}>
            <div className="w-4/5 mx-auto">
                <h1 className="text-3xl font-bold tracking-tight text-blue-500 text-center">
                    Editar usuario.
                </h1>
                {/* Ajustado el margen superior del formulario para acercarlo aún más */}
                {userData && <UserEditForm user={userData} />}
                {/* Botón Regresar debajo del formulario, manteniendo el espaciado adecuado */}
                <Button variant="secondary" className="mt-4" onClick={handleBack}>
                    <Undo2 className="mr-2" /> Regresar
                </Button>
            </div>
        </AdminLayout>
    );
};

export default EditUserPage;
