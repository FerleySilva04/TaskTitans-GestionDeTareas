import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/molecules/Sidebar/sidebar";
import {ChartCandlestick, User, Album} from "lucide-react";
import {Role, UserProps} from "@/utils/enums";

interface AdminLayoutProps {
    children: React.ReactNode;
    user: UserProps
}

// Menu items.
const items = [
    {
        title: "Gestión de proyectos",
        url: "/admin",
        icon: Album,
        role: Role.USER
    },

    {
        title: "Análisis de datos",
        url: "/admin/data",
        icon: ChartCandlestick,
        role: Role.ADMIN
    },
    {
        title: "Gestion de los usuarios",
        url: "/admin/users",
        icon: User,
        role: Role.ADMIN
    }
]

const props = {
    items: items,
    withFooter: true,
}

export default function AdminLayout({ children, user } : AdminLayoutProps) {
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