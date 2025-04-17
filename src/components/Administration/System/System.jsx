"use client"

import { Card } from "@/components/ui/card"

export default function SystemAdministratorPage() {
    const statsCards = [
        { title: "Roles", value: "10" },
        { title: "Users", value: "5" },
        { title: "Logged User", value: "3" },
        { title: "License", value: "6" },
    ]

    return (
        <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {statsCards.map((card, index) => (
                    <Card key={index} className="flex flex-col items-center justify-center p-6 border-green-600 border-2">
                        <h3 className="text-sm font-medium mb-2">{card.title}</h3>
                        <p className="text-2xl font-bold">{card.value}</p>
                    </Card>
                ))}
            </div>

            {/* Note */}
            <div className="mb-6">
                <p className="text-sm text-gray-600">Note : Change the following Graphs</p>
            </div>

            {/* Graphs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Email Traffic Stats */}
                <Card className="p-4 border">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Email Traffic Stats</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-blue-600">View all reports</span>
                            <select className="text-xs border rounded px-2 py-1">
                                <option>Last 7 days</option>
                                <option>Last 30 days</option>
                                <option>Last 90 days</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-4 mb-2">
                        <div className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-blue-300"></span>
                            <span className="text-xs">Incoming emails</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                            <span className="text-xs">Outgoing emails</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-green-300"></span>
                            <span className="text-xs">Incoming spam</span>
                        </div>
                    </div>

                    {/* Email Traffic Chart */}
                    <div className="h-48 bg-gray-50 mb-4 relative">
                        {/* This is a placeholder for the actual chart */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-full">
                                {/* Simple line chart representation */}
                                <svg viewBox="0 0 400 150" className="w-full h-full">
                                    {/* Blue area for incoming emails */}
                                    <path
                                        d="M0,150 L0,100 C20,80 40,60 60,70 C80,80 100,90 120,70 C140,50 160,60 180,80 C200,100 220,90 240,70 C260,50 280,60 300,80 C320,100 340,90 360,50 C380,10 400,30 400,30 L400,150 Z"
                                        fill="rgba(147, 197, 253, 0.3)"
                                    />
                                    {/* Blue line for incoming emails */}
                                    <path
                                        d="M0,100 C20,80 40,60 60,70 C80,80 100,90 120,70 C140,50 160,60 180,80 C200,100 220,90 240,70 C260,50 280,60 300,80 C320,100 340,90 360,50 C380,10 400,30 400,30"
                                        fill="none"
                                        stroke="#60A5FA"
                                        strokeWidth="2"
                                    />
                                    {/* Green line for spam */}
                                    <path
                                        d="M0,140 C20,138 40,136 60,135 C80,134 100,133 120,132 C140,131 160,130 180,132 C200,134 220,136 240,135 C260,134 280,133 300,134 C320,135 340,136 360,134 C380,132 400,130 400,130"
                                        fill="none"
                                        stroke="#86EFAC"
                                        strokeWidth="2"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Email Stats */}
                    <div className="grid grid-cols-4 text-center">
                        <div className="flex flex-col">
                            <span className="font-bold">100</span>
                            <span className="text-xs text-gray-500">Total emails</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold">84</span>
                            <span className="text-xs text-gray-500">Incoming emails</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold">16</span>
                            <span className="text-xs text-gray-500">Outgoing emails</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold">0</span>
                            <span className="text-xs text-gray-500">Incoming spam</span>
                        </div>
                    </div>
                </Card>

                {/* Organization Users Summary */}
                <Card className="p-4 border">
                    <h3 className="font-medium mb-4">Organization Users Summary</h3>

                    <div className="flex gap-4 mb-4">
                        <div className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                            <span className="text-xs">Active users</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                            <span className="text-xs">Inactive users</span>
                        </div>
                    </div>

                    {/* Donut Chart */}
                    <div className="h-48 flex items-center justify-center mb-4">
                        <div className="relative w-32 h-32">
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                                <circle cx="50" cy="50" r="40" fill="none" stroke="#3B82F6" strokeWidth="20" />
                                {/* Empty center to create donut */}
                                <circle cx="50" cy="50" r="30" fill="white" />
                            </svg>
                        </div>
                    </div>

                    {/* User Stats */}
                    <div className="grid grid-cols-2 text-center">
                        <div className="flex flex-col">
                            <span className="font-bold">5</span>
                            <span className="text-xs text-gray-500">Active users</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold">0</span>
                            <span className="text-xs text-gray-500">Inactive users</span>
                        </div>
                    </div>
                </Card>
            </div>
        </>
    )
}
