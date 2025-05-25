"use client"

import { useState, useEffect } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import {
    ChevronLeft,
    Puzzle,
    DollarSign,
    Building,
    BarChart,
    BarChart3,
    FileText,
    Layers,
    Map
} from "lucide-react"
import { Button } from "@/components/ui/button"

const isAuthenticated = () => {
    return typeof window !== "undefined" && localStorage.getItem("isLoggedIn") === "true"
}

export default function ApplicationAdministrationLayout() {
    const navigate = useNavigate()
    const location = useLocation()
    const pathname = location.pathname

    const getActiveTab = () => {
        if (pathname.includes("/fee-type")) return "fee-type"
        if (pathname.includes("/division-setup")) return "division-setup"
        if (pathname.includes("/performance")) return "performance"
        if (pathname.includes("/deal-type")) return "deal-type"
        if (pathname.includes("/volume-tier-setups")) return "volume-tier-setups"
        if (pathname.includes("/territories")) return "territories"
        return "dashboard"
    }

    const [activeTab, setActiveTab] = useState(getActiveTab())

    useEffect(() => {
        setActiveTab(getActiveTab())
        if (!isAuthenticated()) {
            navigate("/")
        }
    }, [pathname, navigate])

    const sidebarItems = [
        { title: "Dashboard", id: "dashboard", icon: BarChart3, path: "/administration/application" },
        { title: "Fee Type", id: "fee-type", icon: DollarSign, path: "/administration/application/fee-type" },
        { title: "Division Setup", id: "division-setup", icon: Building, path: "/administration/application/division-setup" },
        { title: "Performance", id: "performance", icon: BarChart, path: "/administration/application/performance" },
        { title: "Deal Type", id: "deal-type", icon: FileText, path: "/administration/application/deal-type" },
        { title: "Volume Tier Setups", id: "volume-tier-setups", icon: Layers, path: "/administration/application/volume-tier-setups" },
        { title: "Territories", id: "territories", icon: Map, path: "/administration/application/territories" },
    ]

    if (!isAuthenticated()) return null

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
                <div className="flex items-center gap-2">
                    <div className="bg-green-600 text-white p-1">
                        <Puzzle className="h-5 w-5" />
                    </div>
                    <h1 className="text-xl font-semibold">Application Administrator</h1>
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

            {/* Layout */}
            <div className="flex flex-grow">
                {/* Sidebar */}
                <div className="w-48 border-r border-r-green-600 flex flex-col">
                    <div className="py-4 pl-4 flex-grow">
                        <div className="h-full pl-2 flex flex-col gap-6">
                            {sidebarItems.map((item, index) => (
                                <button
                                    key={index}
                                    className={`flex items-center gap-2 text-left transition-colors hover:text-green-600 ${activeTab === item.id ? "font-semibold text-green-600" : "text-gray-600"
                                        }`}
                                    onClick={() => navigate(item.path)}
                                >
                                    <item.icon
                                        className={`w-5 h-5 ${activeTab === item.id ? "text-green-600" : "text-gray-500"}`}
                                    />
                                    {item.title}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-grow p-6 bg-gray-50">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
