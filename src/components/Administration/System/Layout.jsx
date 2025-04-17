"use client"

import { useState, useEffect } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { Cog, Users, Shield, Layers, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

const isAuthenticated = () => {
    return typeof window !== "undefined" && localStorage.getItem("isLoggedIn") === "true"
}

export default function SystemAdministrationLayout() {
    const navigate = useNavigate()
    const location = useLocation()
    const pathname = location.pathname

    const getActiveTab = () => {
        if (pathname.includes("/users")) return "users"
        if (pathname.includes("/privileges")) return "privileges"
        if (pathname.includes("/roles")) return "roles"
        return "dashboard"
    }

    const [activeTab, setActiveTab] = useState(getActiveTab())

    useEffect(() => {
        setActiveTab(getActiveTab())

        if (!isAuthenticated()) {
            navigate("/")
        }
    }, [navigate, pathname])

    const sidebarItems = [
        {
            title: "Dashboard",
            icon: Cog,
            active: activeTab === "dashboard",
            onClick: () => navigate("/administration/system"),
        },
        {
            title: "Users",
            icon: Users,
            active: activeTab === "users",
            onClick: () => navigate("/administration/system/users"),
        },
        {
            title: "Roles & Privileges",
            icon: Layers,
            active: activeTab === "roles",
            onClick: () => navigate("/administration/system/roles"),
        },
        {
            title: "Privileges",
            icon: Shield,
            active: activeTab === "privileges",
            onClick: () => navigate("/administration/system/privileges"),
        },
    ]

    if (!isAuthenticated()) return null

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
                <div className="flex items-center gap-2">
                    <div className="bg-green-600 text-white p-1">
                        <Cog className="h-5 w-5" />
                    </div>
                    <h1 className="text-xl font-semibold">System Administrator</h1>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => navigate("/administration")}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Admin Console
                </Button>
            </div>

            {/* Green line */}
            <div className="h-1 bg-green-600 w-full"></div>

            <div className="flex flex-grow">
                {/* Sidebar */}
                <div className="w-48 border-r border-r-green-600 flex flex-col">
                    <div className="py-4 pl-4 flex-grow">
                        <div className="  h-full pl-4 flex flex-col gap-6">
                            {sidebarItems.map((item, index) => (
                                <button
                                    key={index}
                                    className={`flex items-center gap-2 text-left transition-colors hover:text-green-600 ${item.active ? "font-semibold text-green-600" : "text-gray-600"
                                        }`}
                                    onClick={item.onClick}
                                >
                                    <item.icon
                                        className={`w-5 h-5 ${item.active ? "text-green-600" : "text-gray-500"
                                            }`}
                                    />
                                    {item.title}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-grow p-6">
                    <Outlet /> {/* This renders the current child route like SystemAdministratorPage */}
                </div>
            </div>
        </div>
    )
}
