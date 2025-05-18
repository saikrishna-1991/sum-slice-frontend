"use client"
import { useState, useEffect } from "react"
import { RefreshCw, Settings, Database, Puzzle, Zap } from "lucide-react"
import { Card } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"

export default function ApplicationDashboardPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [animate, setAnimate] = useState(false)
    const [counters, setCounters] = useState({ feeTypes: 0, divisions: 0, dealTypes: 0, performance: 0 })

    // Simulated data refresh
    const refreshData = () => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            // Reset animation to trigger it again
            setAnimate(false)
            setTimeout(() => setAnimate(true), 50)
        }, 1200)
    }

    // Stats data with icons and trends
    const statsCards = [
        {
            title: "Fee Types",
            value: "10",
            icon: Settings,
            trend: "+2",
            trendUp: true,
            color: "from-emerald-500 to-teal-400",
            bgLight: "bg-emerald-50",
        },
        {
            title: "Divisions",
            value: "5",
            icon: Database,
            trend: "+1",
            trendUp: true,
            color: "from-blue-500 to-indigo-500",
            bgLight: "bg-blue-50",
        },
        {
            title: "Deal Types",
            value: "3",
            icon: Puzzle,
            trend: "0",
            trendUp: null,
            color: "from-violet-500 to-purple-500",
            bgLight: "bg-violet-50",
        },
        {
            title: "Performance",
            value: "10",
            icon: Zap,
            trend: "+3",
            trendUp: true,
            color: "from-amber-500 to-orange-400",
            bgLight: "bg-amber-50",
        },
    ]

    // Chart data
    const chartSections = [
        {
            title: "Deals by Fee Types",
            legends: [
                { label: "Admin Fee", color: "bg-blue-500", percentage: 75 },
                { label: "DSA Fee", color: "bg-blue-100", percentage: 25 },
            ],
        },
        {
            title: "Deals by Divisions",
            legends: [
                { label: "Northeast", color: "bg-blue-500", percentage: 70 },
                { label: "Southeast", color: "bg-blue-100", percentage: 30 },
            ],
        },
        {
            title: "Deals by Deal Types",
            legends: [
                { label: "Buy Deal", color: "bg-blue-500", percentage: 65 },
                { label: "Sell Deal", color: "bg-blue-100", percentage: 35 },
            ],
        },
        {
            title: "Deals by Performance",
            legends: [
                { label: "Easter", color: "bg-blue-500", percentage: 70 },
                { label: "ThanksGiving", color: "bg-blue-100", percentage: 30 },
            ],
        },
    ]
    const COLORS = ["#3B82F6", "#DBEAFE"] // blue-500, blue-100

    // Animation effect for counters
    useEffect(() => {
        setAnimate(true)
    }, [])

    useEffect(() => {
        if (animate) {
            const duration = 1500
            const interval = 50
            const steps = duration / interval

            let step = 0
            const timer = setInterval(() => {
                step++
                const progress = step / steps

                setCounters({
                    feeTypes: Math.floor(progress * Number.parseInt(statsCards[0].value)),
                    divisions: Math.floor(progress * Number.parseInt(statsCards[1].value)),
                    dealTypes: Math.floor(progress * Number.parseInt(statsCards[2].value)),
                    performance: Math.floor(progress * Number.parseInt(statsCards[3].value)),
                })

                if (step >= steps) {
                    clearInterval(timer)
                }
            }, interval)

            return () => clearInterval(timer)
        }
    }, [animate])

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-medium">Application Administration Dashboard</h1>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshData}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                    Refresh Data
                </Button>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsCards.map((card, index) => (
                    <Card
                        key={index}
                        className="relative overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px] cursor-pointer p-6 group"
                    >
                        <div
                            className={`absolute top-6 right-6 bg-gradient-to-br ${card.color} text-white p-2 rounded transition-transform group-hover:scale-110`}
                        >
                            <card.icon className="h-5 w-5" />
                        </div>
                        <div className="mb-1 text-gray-600 text-sm">{card.title}</div>
                        <div className="text-3xl font-bold mb-4">{animate ? counters[Object.keys(counters)[index]] : 0}</div>
                        <div
                            className={`flex items-center ${card.trendUp ? "text-emerald-500" : card.trendUp === false ? "text-red-500" : "text-gray-500"} text-sm`}
                        >
                            {card.trendUp ? (
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-1"
                                >
                                    <path d="M8 4L12 8H9V12H7V8H4L8 4Z" fill="currentColor" />
                                </svg>
                            ) : card.trendUp === false ? (
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-1"
                                >
                                    <path d="M8 12L4 8H7V4H9V8H12L8 12Z" fill="currentColor" />
                                </svg>
                            ) : (
                                <span className="mr-1">—</span>
                            )}
                            {card.trend} from last month
                        </div>
                    </Card>
                ))}
            </div>

            {/* Charts - Matching the image */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-24">
                {chartSections.map((section, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <div className="w-32 h-32 mb-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={section.legends}
                                        dataKey="percentage"
                                        nameKey="label"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={60}
                                        fill="#8884d8"
                                    >
                                        {section.legends.map((entry, idx) => (
                                            <Cell key={`cell-${idx}`} fill={entry.color === "bg-blue-500" ? COLORS[0] : COLORS[1]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <h3 className="text-sm font-medium text-center mb-2">{section.title}</h3>
                        <Card className="w-full p-3 bg-gray-50">
                            {section.legends.map((legend, idx) => (
                                <div key={idx} className="flex items-center mb-1 last:mb-0">
                                    <div className={`w-4 h-4 rounded-full ${legend.color} mr-2`}></div>
                                    <span className="text-xs">{legend.label}</span>
                                </div>
                            ))}
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    )
}
