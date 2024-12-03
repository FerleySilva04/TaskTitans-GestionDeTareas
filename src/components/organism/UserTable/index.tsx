import { Button } from "@/components/ui/button";
import { FaPenSquare, FaTrashAlt } from "react-icons/fa";
import { useMutation } from "@apollo/client";
import { DELETE_USER_MUTATION } from "@/utils/graphql/mutations/users";
import { useRouter } from "next/router";
import { UserProps } from "@/utils/enums";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Icons } from "@/components/ui/icons";
import * as React from "react";

interface UsersTableProps {
    users: UserProps[];
    refetch: () => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({ users, refetch }) => {
    const [deleteUser] = useMutation(DELETE_USER_MUTATION);
    const [deletingId, setDeletingId] = React.useState<string | null>(null);
    const router = useRouter();

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        await deleteUser({ variables: { id } });
        refetch();
        setDeletingId(null);
    };

    const handleEdit = (id: string) => {
        router.push(`/admin/editUser?id=${id}`);
    };

    return (
        <Table className="border-collapse w-full table-auto">
            <TableHeader className="bg-gray-200 text-left">
                <TableRow>
                    <TableHead className="p-3 text-sm font-medium text-gray-600">Nombre</TableHead>
                    <TableHead className="p-3 text-sm font-medium text-gray-600">Email</TableHead>
                    <TableHead className="p-3 text-sm font-medium text-gray-600">Role</TableHead>
                    <TableHead className="p-3 text-sm font-medium text-gray-600">Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow 
                        key={user.id} 
                        className="hover:bg-gray-100 border-b border-gray-300 transition duration-200"
                    >
                        <TableCell className="p-3 text-sm text-gray-800">{user.name}</TableCell>
                        <TableCell className="p-3 text-sm text-gray-800">{user.email}</TableCell>
                        <TableCell className="p-3 text-sm text-gray-800">{user.role}</TableCell>
                        <TableCell className="p-3 space-x-3">
                            <Button
                                variant="secondary"
                                onClick={() => handleEdit(user.id)}
                                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            >
                                <FaPenSquare className="w-4 h-4" />
                            </Button>
                            <Button
                                onClick={() => handleDelete(user.id)}
                                disabled={deletingId === user.id}
                                variant="destructive"
                                className="text-red-600 hover:text-red-800 transition-colors duration-200"
                            >
                                {deletingId === user.id ? (
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <FaTrashAlt className="w-4 h-4" />
                                )}
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
export default UsersTable;