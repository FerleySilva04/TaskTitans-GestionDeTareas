import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/molecules/Sidebar/sidebar";
import { Clipboard, BarChart, Users } from "lucide-react";  // Nuevos iconos
import { Role, UserProps } from "@/utils/enums";

interface AdminLayoutProps {
    children: React.ReactNode;
    user: UserProps;
}

// Menu items.
const items = [
    {
        title: "Proyectos y Tareas",
        url: "/admin",
        icon: Clipboard, // Nuevo ícono
        role: Role.USER
    },

    {
        title: "Estadísticas y Análisis",
        url: "/admin/data",
        icon: BarChart, // Nuevo ícono
        role: Role.USER // Asignado el rol USER aquí
    },
    {
        title: "Administrar Usuarios",
        url: "/admin/users",
        icon: Users, // Nuevo ícono
        role: Role.ADMIN
    }
]

const props = {
    items: items,
    withFooter: true,
}

export default function AdminLayout({ children, user }: AdminLayoutProps) {
    return (
        <SidebarProvider>
            <AppSidebar props={props} user={user}/>
            <main className={"w-full"}>
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    );
};
