import AdminLayout from "@/layouts/_layout";
import useMiddleware from "@/hooks/useMiddleware";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { IsLoading } from "@/components/molecules/Loading/isLoading";
import { Role } from "@/utils/enums";
import ProjectData from '@/components/organism/ProjectData';
import { useEffect, useState } from "react";

export default function AdminPage() {
    const user = useMiddleware(Role.USER);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (user?.role === Role.ADMIN) {
            setIsAdmin(true);
        }
    }
        , [user]);


    if (!user) {
        return <IsLoading />;
    }

    return (
        <AdminLayout user={user}>
            <div className='w-4/5 mx-auto'>
                <h1 className="text-3xl font-bold tracking-tight text-blue-500 text-center mb-4">
                    Gestión de tareas.
                </h1>
                <Button className={`${isAdmin ? 'm-4' : 'hidden'}`} asChild>
                    <Link href={"/admin/createProject"}>
                        <Plus />Agregar un Proyecto
                    </Link>
                </Button>
                <ProjectData />
            </div>
        </AdminLayout>
    );
};