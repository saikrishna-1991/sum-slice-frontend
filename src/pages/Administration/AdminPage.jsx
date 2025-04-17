"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Building2, Puzzle, Cloud, Database, Cog } from "lucide-react"

const isAuthenticated = () => {
    return localStorage.getItem("isLoggedIn") === "true"
}

export default function AdministrationPage() {
    const navigate = useNavigate()
    const userName = "John Doe"

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate("/")
        }
    }, [navigate])

    const statsCards = [
        { title: "Roles", value: "10" },
        { title: "Users", value: "5" },
        { title: "Logged User", value: "3" },
        { title: "License", value: "6" },
    ]

    const adminCards = [
        {
            title: "System Administrator",
            icon: Building2,
            color: "text-blue-500",
            href: "/administration/system",
        },
        {
            title: "Application Administrator",
            icon: Puzzle,
            color: "text-green-700",
            href: "/administration/application",
        },
        {
            title: "Functional Administrator",
            icon: Cloud,
            color: "text-green-500",
            href: "/administration/functional",
        },
        {
            title: "Integration Administrator",
            icon: Database,
            color: "text-blue-700",
            href: "/administration/integration",
        },
        {
            title: "Accrual Administrator",
            icon: Cog,
            color: "text-blue-600",
            href: "/administration/accrual",
        },
    ]

    if (!isAuthenticated()) {
        return null
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <div className="flex items-center px-6 py-4 border-b">
                <div className="flex items-center gap-2">
                    <div className="bg-green-600 text-white p-1">
                        <Cog className="h-5 w-5" />
                    </div>
                    <h1 className="text-xl font-semibold">Admin Console</h1>
                </div>
            </div>

            {/* Green line */}
            <div className="h-1 bg-green-600 w-full"></div>

            {/* Main Content */}
            <div className="flex-grow p-6">
                {/* Greeting */}
                <div className="bg-gray-800 text-white px-4 py-2 rounded mb-8 w-fit">
                    <p>Good morning, {userName}</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {statsCards.map((card, index) => (
                        <Card key={index} className="flex flex-col items-center justify-center p-6 border-green-600 border-2">
                            <h3 className="text-sm font-medium mb-2">{card.title}</h3>
                            <p className="text-2xl font-bold">{card.value}</p>
                        </Card>
                    ))}
                </div>

                {/* Admin Role Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {adminCards.map((card, index) => (
                        <Card
                            key={index}
                            className="flex flex-col items-center justify-center p-6 bg-gray-200 hover:bg-gray-300 cursor-pointer transition-colors"
                            onClick={() => navigate(card.href)}
                        >
                            <div className={`mb-4 ${card.color}`}>
                                <card.icon className="h-12 w-12" />
                            </div>
                            <p className="text-sm text-center">{card.title}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
