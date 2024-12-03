import AdminLayout from "@/layouts/_layout";
import useMiddleware from "@/hooks/useMiddleware";
import UsersTable from '@/components/organism/UserTable';
import { useQuery } from '@apollo/client';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { GET_ALL_USERS_QUERY } from "@/utils/graphql/queries/users";
import {IsLoading} from "@/components/molecules/Loading/isLoading";
import { Role } from "@/utils/enums";

export default function AdminUsersPage() {
    const user = useMiddleware(Role.ADMIN);

    const { data, refetch } = useQuery(GET_ALL_USERS_QUERY);
    const router = useRouter();
    const { reload } = router.query;

    useEffect(() => {
        if (reload) {
            refetch();
            router.replace(router.pathname, undefined, { shallow: true });
        }
    }, [reload, router, refetch]);

    if (!user) {
        return <IsLoading />;
    }

    return (
        <AdminLayout user={user}>
            <div className={"w-4/5 mx-auto"}>
                <h1 className="text-3xl font-bold tracking-tight text-blue-500 text-center mb-4">
                    Gestión de usuarios.
                </h1>
                <Button className={"m-4"} asChild>
                    <Link href={"/admin/createUser"}>
                        <Plus />Agregar usuario
                    </Link>
                </Button>
                <UsersTable users={data ? data.users : []} refetch={refetch} />
            </div>
        </AdminLayout>
    );
};
