"use client"

import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Network, Building2, BarChart3, Puzzle, Cloud, CreditCard, FileText } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { Header } from "@/components/header"

// This is a placeholder for your actual authentication check
const isAuthenticated = () => {
    // Replace this with your actual authentication check
    return localStorage.getItem("isLoggedIn") === "true"
}

export default function DashboardPage() {
    const navigate = useNavigate()
    const userName = "John Doe" // This should come from your authentication state

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate("/")
        }
    }, [navigate])

    const menuItems = [
        {
            title: "Partner Portal",
            icon: Network,
            bgColor: "bg-gray-200",
            iconClass: "text-green-700",
            tooltip: "Access partner-related information and tools",
            to: "/partner-portal",
        },
        {
            title: "Administration",
            icon: Building2,
            bgColor: "bg-gray-200",
            iconClass: "text-green-700",
            tooltip: "Manage administrative tasks and settings",
            to: "/administration",
        },
        {
            title: "Rebate Workbench",
            icon: BarChart3,
            bgColor: "bg-gray-200",
            iconClass: "text-green-700",
            tooltip: "Handle rebate calculations and processing",
            to: "/rebate",
        },
        {
            title: "Accrual Workbench",
            icon: Puzzle,
            bgColor: "bg-gray-200",
            iconClass: "text-green-700",
            tooltip: "Manage accruals and related tasks",
            to: "/accrual",
        },
        {
            title: "Integrations",
            icon: Cloud,
            bgColor: "bg-gray-200",
            iconClass: "text-green-700",
            tooltip: "Set up and manage system integrations",
            to: "/integrations",
        },
        {
            title: "Payment Workbench",
            icon: CreditCard,
            bgColor: "bg-gray-200",
            iconClass: "text-green-700",
            tooltip: "Process and manage payments",
            to: "/payment",
        },
        {
            title: "Reporting",
            icon: FileText,
            bgColor: "bg-gray-200",
            iconClass: "text-green-700",
            tooltip: "Generate and view various reports",
            to: "/reporting",
        },
    ]

    if (!isAuthenticated()) {
        return null // or a loading spinner
    }

    return (
        <TooltipProvider>
            <div className="min-h-screen bg-white flex flex-col justify-between">
                {/* <Header userName={userName} /> */}

                {/* Main Content */}
                <div className="flex-grow flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8">
                    <div className="w-full max-w-7xl">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {menuItems.map((item, index) => (
                                <Tooltip key={index}>
                                    <TooltipTrigger>
                                        <Link to={item.to}>
                                            <Card
                                                className={`${item.bgColor} w-full h-40 flex flex-col items-center justify-center border border-gray-400 shadow-md cursor-pointer transition-transform hover:scale-105`}
                                            >
                                                <item.icon className={`w-12 h-12 mb-4 ${item.iconClass}`} />
                                                <p className="text-center text-green-700 text-sm">
                                                    {item.title.split(" ").map((word, i) => (
                                                        <span key={i} className="block">
                                                            {word}
                                                        </span>
                                                    ))}
                                                </p>
                                            </Card>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{item.tooltip}</p>
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="py-4 text-center bg-gray-100">
                    <p className="text-green-700 font-semibold">Sumslice® Company, Inc.</p>
                </div>
            </div>
        </TooltipProvider>
    )
}

