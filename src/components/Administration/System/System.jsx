"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Users,
    ShieldCheck,
    Key,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Mail,
    MailCheck,
    MailX,
    Shield,
    UserCheck,
    UserX,
    BarChart3,
    PieChart,
    LineChart,
    RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SystemAdministratorPage() {
    const [timeRange, setTimeRange] = useState("7days")
    const [isLoading, setIsLoading] = useState(false)
    const [emailChartHover, setEmailChartHover] = useState(null)

    // Animation states
    const [animate, setAnimate] = useState(false)
    const [counters, setCounters] = useState({ roles: 0, users: 0, loggedUsers: 0, licenses: 0 })

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
            title: "Roles",
            value: "10",
            icon: ShieldCheck,
            trend: "+2",
            trendUp: true,
            color: "from-emerald-500 to-teal-400",
            bgLight: "bg-emerald-50",
        },
        {
            title: "Users",
            value: "5",
            icon: Users,
            trend: "+1",
            trendUp: true,
            color: "from-blue-500 to-indigo-500",
            bgLight: "bg-blue-50",
        },
        {
            title: "Logged Users",
            value: "3",
            icon: Activity,
            trend: "0",
            trendUp: null,
            color: "from-violet-500 to-purple-500",
            bgLight: "bg-violet-50",
        },
        {
            title: "Licenses",
            value: "6",
            icon: Key,
            trend: "-1",
            trendUp: false,
            color: "from-amber-500 to-orange-400",
            bgLight: "bg-amber-50",
        },
    ]

    // Email traffic data
    const emailData = {
        "7days": {
            incoming: [42, 38, 52, 48, 62, 59, 73],
            outgoing: [18, 22, 16, 25, 28, 20, 32],
            spam: [5, 3, 7, 4, 6, 8, 5],
        },
        "30days": {
            incoming: [
                42, 38, 52, 48, 62, 59, 73, 68, 75, 82, 78, 85, 79, 88, 92, 86, 94, 89, 96, 91, 98, 94, 102, 97, 105, 99, 108,
                103, 110, 106,
            ],
            outgoing: [
                18, 22, 16, 25, 28, 20, 32, 27, 35, 30, 38, 33, 40, 36, 42, 38, 45, 40, 48, 43, 50, 46, 52, 48, 55, 50, 58, 53,
                60, 56,
            ],
            spam: [5, 3, 7, 4, 6, 8, 5, 9, 4, 7, 5, 8, 6, 9, 5, 8, 4, 7, 5, 8, 6, 9, 5, 8, 4, 7, 5, 8, 6, 9],
        },
        "90days": {
            incoming: Array.from({ length: 90 }, (_, i) => Math.floor(40 + Math.random() * 70)),
            outgoing: Array.from({ length: 90 }, (_, i) => Math.floor(15 + Math.random() * 45)),
            spam: Array.from({ length: 90 }, (_, i) => Math.floor(2 + Math.random() * 8)),
        },
    }

    // User activity data
    const userActivityData = {
        active: 5,
        inactive: 0,
        lastLogin: [
            { time: "10:25 AM", user: "John Doe" },
            { time: "09:15 AM", user: "Jane Smith" },
            { time: "Yesterday", user: "Robert Johnson" },
        ],
    }

    // System health data
    const systemHealthData = {
        cpu: 32,
        memory: 45,
        disk: 28,
        network: 65,
    }

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
                    roles: Math.floor(progress * Number.parseInt(statsCards[0].value)),
                    users: Math.floor(progress * Number.parseInt(statsCards[1].value)),
                    loggedUsers: Math.floor(progress * Number.parseInt(statsCards[2].value)),
                    licenses: Math.floor(progress * Number.parseInt(statsCards[3].value)),
                })

                if (step >= steps) {
                    clearInterval(timer)
                }
            }, interval)

            return () => clearInterval(timer)
        }
    }, [animate])

    // Generate points for the email traffic chart
    const generateChartPoints = (data, height = 100, width = 400) => {
        if (!data || data.length === 0) return ""

        const max = Math.max(...data) * 1.2
        const points = data.map((value, index) => {
            const x = (index / (data.length - 1)) * width
            const y = height - (value / max) * height
            return `${x},${y}`
        })

        return `M${points.join(" L")}`
    }

    // Generate area under the line for the email traffic chart
    const generateAreaPoints = (data, height = 100, width = 400) => {
        if (!data || data.length === 0) return ""

        const max = Math.max(...data) * 1.2
        const points = data.map((value, index) => {
            const x = (index / (data.length - 1)) * width
            const y = height - (value / max) * height
            return `${x},${y}`
        })

        return `M0,${height} L${points.join(" L")} L${width},${height} Z`
    }

    // Get current email data based on selected time range
    const currentEmailData = emailData[timeRange]

    // Calculate email stats totals
    const totalEmails =
        currentEmailData.incoming.reduce((a, b) => a + b, 0) + currentEmailData.outgoing.reduce((a, b) => a + b, 0)
    const totalIncoming = currentEmailData.incoming.reduce((a, b) => a + b, 0)
    const totalOutgoing = currentEmailData.outgoing.reduce((a, b) => a + b, 0)
    const totalSpam = currentEmailData.spam.reduce((a, b) => a + b, 0)

    return (
        <div className="p-6 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">System Administration Dashboard</h1>
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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((card, index) => (
                    <Card
                        key={index}
                        className="relative overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px] cursor-pointer"
                    >
                        <div className={`absolute inset-0 opacity-10 ${card.bgLight}`}></div>
                        <div className="absolute top-0 right-0 h-24 w-24 -mt-8 -mr-8 rounded-full bg-gradient-to-br opacity-20 blur-xl transform rotate-45 ${card.color}"></div>

                        <div className="p-6 relative z-10">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
                                    <h3 className="text-3xl font-bold">
                                        {animate ? counters[card.title.toLowerCase().replace(" ", "")] : 0}
                                    </h3>
                                </div>
                                <div className={`p-3 rounded-lg bg-gradient-to-br ${card.color} text-white`}>
                                    <card.icon className="h-5 w-5" />
                                </div>
                            </div>

                            {card.trend && (
                                <div className="mt-4 flex items-center">
                                    {card.trendUp === true ? (
                                        <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />
                                    ) : card.trendUp === false ? (
                                        <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                                    ) : (
                                        <span className="h-4 w-4 mr-1">—</span>
                                    )}
                                    <span
                                        className={`text-sm ${card.trendUp === true
                                                ? "text-emerald-500"
                                                : card.trendUp === false
                                                    ? "text-red-500"
                                                    : "text-gray-500"
                                            }`}
                                    >
                                        {card.trend} from last month
                                    </span>
                                </div>
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            {/* Note */}
            <div className="mb-2">
                <p className="text-sm text-gray-600">Dashboard Analytics</p>
            </div>

            {/* Tabs for different analytics views */}
            <Tabs defaultValue="traffic" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="traffic" className="flex items-center gap-2">
                        <LineChart className="h-4 w-4" />
                        Email Traffic
                    </TabsTrigger>
                    <TabsTrigger value="users" className="flex items-center gap-2">
                        <PieChart className="h-4 w-4" />
                        User Activity
                    </TabsTrigger>
                    <TabsTrigger value="system" className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        System Health
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="traffic">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Email Traffic Stats */}
                        <Card className="p-6 border shadow-sm lg:col-span-2 transition-all duration-300 hover:shadow-lg hover:border-blue-100">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-5 w-5 text-blue-500" />
                                    <h3 className="font-medium">Email Traffic Stats</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-blue-600 cursor-pointer hover:underline">View all reports</span>
                                    <Select value={timeRange} onValueChange={setTimeRange}>
                                        <SelectTrigger className="w-[130px] h-8 text-xs">
                                            <SelectValue placeholder="Select period" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="7days">Last 7 days</SelectItem>
                                            <SelectItem value="30days">Last 30 days</SelectItem>
                                            <SelectItem value="90days">Last 90 days</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex gap-4 mb-4">
                                <div className="flex items-center gap-1">
                                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                    <span className="text-xs">Incoming emails</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                                    <span className="text-xs">Outgoing emails</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="w-3 h-3 rounded-full bg-red-400"></span>
                                    <span className="text-xs">Incoming spam</span>
                                </div>
                            </div>

                            {/* Email Traffic Chart */}
                            <div className="h-64 bg-gradient-to-b from-gray-50 to-white mb-6 rounded-lg border relative w-full">
                                <svg
                                    viewBox="0 0 400 200"
                                    className="w-full h-full"
                                    preserveAspectRatio="none"
                                    onMouseLeave={() => setEmailChartHover(null)}
                                >
                                    {/* Grid lines */}
                                    <line x1="0" y1="50" x2="400" y2="50" stroke="#f0f0f0" strokeWidth="1" />
                                    <line x1="0" y1="100" x2="400" y2="100" stroke="#f0f0f0" strokeWidth="1" />
                                    <line x1="0" y1="150" x2="400" y2="150" stroke="#f0f0f0" strokeWidth="1" />

                                    {/* Blue area for incoming emails */}
                                    <path d={generateAreaPoints(currentEmailData.incoming, 180)} fill="rgba(59, 130, 246, 0.1)" />

                                    {/* Indigo area for outgoing emails */}
                                    <path d={generateAreaPoints(currentEmailData.outgoing, 180)} fill="rgba(99, 102, 241, 0.1)" />

                                    {/* Red area for spam */}
                                    <path d={generateAreaPoints(currentEmailData.spam, 180)} fill="rgba(248, 113, 113, 0.1)" />

                                    {/* Blue line for incoming emails */}
                                    <path
                                        d={generateChartPoints(currentEmailData.incoming, 180)}
                                        fill="none"
                                        stroke="#3B82F6"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        className="transition-all duration-300"
                                    />

                                    {/* Indigo line for outgoing emails */}
                                    <path
                                        d={generateChartPoints(currentEmailData.outgoing, 180)}
                                        fill="none"
                                        stroke="#6366F1"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        className="transition-all duration-300"
                                    />

                                    {/* Red line for spam */}
                                    <path
                                        d={generateChartPoints(currentEmailData.spam, 180)}
                                        fill="none"
                                        stroke="#F87171"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        className="transition-all duration-300"
                                    />

                                    {/* Data points for incoming */}
                                    {currentEmailData.incoming.map((value, index) => {
                                        const max = Math.max(...currentEmailData.incoming) * 1.2
                                        const x = (index / (currentEmailData.incoming.length - 1)) * 400
                                        const y = 180 - (value / max) * 180

                                        return (
                                            <g key={`incoming-${index}`}>
                                                <circle
                                                    cx={x}
                                                    cy={y}
                                                    r={emailChartHover === `incoming-${index}` ? 5 : 3}
                                                    fill="#3B82F6"
                                                    stroke="#fff"
                                                    strokeWidth="1"
                                                    className="transition-all duration-200"
                                                    onMouseEnter={() => setEmailChartHover(`incoming-${index}`)}
                                                />

                                                {emailChartHover === `incoming-${index}` && (
                                                    <g>
                                                        <rect x={x - 20} y={y - 30} width="40" height="20" rx="4" fill="#3B82F6" />
                                                        <text x={x} y={y - 17} textAnchor="middle" fill="white" fontSize="10">
                                                            {value}
                                                        </text>
                                                    </g>
                                                )}
                                            </g>
                                        )
                                    })}
                                </svg>

                                {/* X-axis labels */}
                                <div className="flex justify-between px-2 text-xs text-gray-400">
                                    {timeRange === "7days" && (
                                        <>
                                            <span>Mon</span>
                                            <span>Tue</span>
                                            <span>Wed</span>
                                            <span>Thu</span>
                                            <span>Fri</span>
                                            <span>Sat</span>
                                            <span>Sun</span>
                                        </>
                                    )}
                                    {timeRange === "30days" && (
                                        <>
                                            <span>Week 1</span>
                                            <span>Week 2</span>
                                            <span>Week 3</span>
                                            <span>Week 4</span>
                                        </>
                                    )}
                                    {timeRange === "90days" && (
                                        <>
                                            <span>Month 1</span>
                                            <span>Month 2</span>
                                            <span>Month 3</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Email Stats */}
                            <div className="grid grid-cols-4 text-center">
                                <div className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-colors duration-300 hover:scale-105">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 mb-2">
                                        <Mail className="h-5 w-5 text-gray-600" />
                                    </div>
                                    <span className="font-bold text-xl">{totalEmails}</span>
                                    <span className="text-xs text-gray-500">Total emails</span>
                                </div>
                                <div className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-colors duration-300 hover:scale-105">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mb-2">
                                        <MailCheck className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <span className="font-bold text-xl">{totalIncoming}</span>
                                    <span className="text-xs text-gray-500">Incoming emails</span>
                                </div>
                                <div className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-colors duration-300 hover:scale-105">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 mb-2">
                                        <Mail className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <span className="font-bold text-xl">{totalOutgoing}</span>
                                    <span className="text-xs text-gray-500">Outgoing emails</span>
                                </div>
                                <div className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-colors duration-300 hover:scale-105">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 mb-2">
                                        <MailX className="h-5 w-5 text-red-600" />
                                    </div>
                                    <span className="font-bold text-xl">{totalSpam}</span>
                                    <span className="text-xs text-gray-500">Incoming spam</span>
                                </div>
                            </div>
                        </Card>

                        {/* Email Security Stats */}
                        <Card className="p-6 border shadow-sm transition-all duration-300 hover:shadow-lg hover:border-emerald-100">
                            <div className="flex items-center gap-2 mb-6">
                                <Shield className="h-5 w-5 text-emerald-500" />
                                <h3 className="font-medium">Email Security</h3>
                            </div>

                            {/* Security Score */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-500">Security Score</span>
                                    <span className="text-sm font-medium">92/100</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"
                                        style={{ width: "92%" }}
                                    ></div>
                                </div>
                            </div>

                            {/* Security Stats */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                            <MailX className="h-4 w-4 text-red-500" />
                                        </div>
                                        <span className="text-sm">Blocked Spam</span>
                                    </div>
                                    <span className="font-medium">{totalSpam}</span>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                                            <Shield className="h-4 w-4 text-amber-500" />
                                        </div>
                                        <span className="text-sm">Phishing Attempts</span>
                                    </div>
                                    <span className="font-medium">2</span>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                            <Shield className="h-4 w-4 text-emerald-500" />
                                        </div>
                                        <span className="text-sm">Malware Blocked</span>
                                    </div>
                                    <span className="font-medium">0</span>
                                </div>
                            </div>

                            {/* Security Recommendations */}
                            <div className="mt-6 pt-4 border-t">
                                <h4 className="text-sm font-medium mb-3">Recommendations</h4>
                                <div className="text-xs text-gray-600 space-y-2">
                                    <p className="flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                        Enable two-factor authentication
                                    </p>
                                    <p className="flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                                        Review email forwarding rules
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="users">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Organization Users Summary */}
                        <Card className="p-6 border shadow-sm lg:col-span-2 transition-all duration-300 hover:shadow-lg hover:border-blue-100">
                            <div className="flex items-center gap-2 mb-6">
                                <Users className="h-5 w-5 text-blue-500" />
                                <h3 className="font-medium">Organization Users Summary</h3>
                            </div>

                            <div className="flex gap-4 mb-6">
                                <div className="flex items-center gap-1">
                                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                    <span className="text-xs">Active users</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                                    <span className="text-xs">Inactive users</span>
                                </div>
                            </div>

                            {/* User Distribution Chart */}
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                {/* Donut Chart */}
                                <div className="flex items-center justify-center">
                                    <div className="relative w-40 h-40">
                                        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                                            {/* Background circle */}
                                            <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="15" />

                                            {/* Active users segment */}
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="40"
                                                fill="none"
                                                stroke="#3B82F6"
                                                strokeWidth="15"
                                                strokeDasharray={`${(userActivityData.active / (userActivityData.active + userActivityData.inactive || 1)) * 251.2} 251.2`}
                                                className="transition-all duration-1000 ease-out"
                                                style={{
                                                    strokeDashoffset: animate ? "0" : "251.2",
                                                }}
                                            />

                                            {/* Empty center to create donut */}
                                            <circle cx="50" cy="50" r="32" fill="white" />

                                            {/* Percentage text */}
                                            <text
                                                x="50"
                                                y="50"
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                className="text-xl font-bold"
                                                fill="#1F2937"
                                            >
                                                100%
                                            </text>
                                            <text
                                                x="50"
                                                y="62"
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                className="text-xs"
                                                fill="#6B7280"
                                            >
                                                Active
                                            </text>
                                        </svg>
                                    </div>
                                </div>

                                {/* User Role Distribution */}
                                <div>
                                    <h4 className="text-sm font-medium mb-3">User Role Distribution</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span>Administrators</span>
                                                <span>2 (40%)</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 rounded-full" style={{ width: "40%" }}></div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span>Standard Users</span>
                                                <span>3 (60%)</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "60%" }}></div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span>Guest Users</span>
                                                <span>0 (0%)</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-gray-300 rounded-full" style={{ width: "0%" }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* User Stats */}
                            <div className="grid grid-cols-2 text-center">
                                <div className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-300 hover:scale-105">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mb-2">
                                        <UserCheck className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <span className="font-bold text-xl">{userActivityData.active}</span>
                                    <span className="text-xs text-gray-500">Active users</span>
                                </div>
                                <div className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-300 hover:scale-105">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 mb-2">
                                        <UserX className="h-5 w-5 text-gray-600" />
                                    </div>
                                    <span className="font-bold text-xl">{userActivityData.inactive}</span>
                                    <span className="text-xs text-gray-500">Inactive users</span>
                                </div>
                            </div>
                        </Card>

                        {/* Recent User Activity */}
                        <Card className="p-6 border shadow-sm transition-all duration-300 hover:shadow-lg hover:border-violet-100">
                            <div className="flex items-center gap-2 mb-6">
                                <Activity className="h-5 w-5 text-violet-500" />
                                <h3 className="font-medium">Recent User Activity</h3>
                            </div>

                            {/* Last Login */}
                            <div className="mb-6">
                                <h4 className="text-sm font-medium mb-3">Last Login</h4>
                                <div className="space-y-3">
                                    {userActivityData.lastLogin.map((login, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-xs font-medium text-violet-600">
                                                    {login.user
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{login.user}</p>
                                                    <p className="text-xs text-gray-500">{login.time}</p>
                                                </div>
                                            </div>
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* User Activity Stats */}
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span>Login Success Rate</span>
                                        <span>100%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: "100%" }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span>Failed Login Attempts</span>
                                        <span>0</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-red-500 rounded-full" style={{ width: "0%" }}></div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="system">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* System Health */}
                        <Card className="p-6 border shadow-sm lg:col-span-2 transition-all duration-300 hover:shadow-lg hover:border-emerald-100">
                            <div className="flex items-center gap-2 mb-6">
                                <Activity className="h-5 w-5 text-emerald-500" />
                                <h3 className="font-medium">System Health</h3>
                            </div>

                            {/* System Health Metrics */}
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                {/* CPU Usage */}
                                <div className="relative">
                                    <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto">
                                        {/* Background circle */}
                                        <circle cx="50" cy="50" r="45" fill="none" stroke="#E5E7EB" strokeWidth="10" />

                                        {/* CPU usage segment */}
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="45"
                                            fill="none"
                                            stroke="#10B981"
                                            strokeWidth="10"
                                            strokeDasharray={`${systemHealthData.cpu * 2.83} 283`}
                                            strokeDashoffset="0"
                                            className="transition-all duration-1000 ease-out"
                                            transform="rotate(-90 50 50)"
                                        />

                                        {/* Percentage text */}
                                        <text
                                            x="50"
                                            y="50"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            className="text-xl font-bold"
                                            fill="#1F2937"
                                        >
                                            {systemHealthData.cpu}%
                                        </text>
                                    </svg>
                                    <p className="text-center text-sm font-medium mt-2">CPU Usage</p>
                                </div>

                                {/* Memory Usage */}
                                <div className="relative">
                                    <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto">
                                        {/* Background circle */}
                                        <circle cx="50" cy="50" r="45" fill="none" stroke="#E5E7EB" strokeWidth="10" />

                                        {/* Memory usage segment */}
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="45"
                                            fill="none"
                                            stroke="#3B82F6"
                                            strokeWidth="10"
                                            strokeDasharray={`${systemHealthData.memory * 2.83} 283`}
                                            strokeDashoffset="0"
                                            className="transition-all duration-1000 ease-out"
                                            transform="rotate(-90 50 50)"
                                        />

                                        {/* Percentage text */}
                                        <text
                                            x="50"
                                            y="50"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            className="text-xl font-bold"
                                            fill="#1F2937"
                                        >
                                            {systemHealthData.memory}%
                                        </text>
                                    </svg>
                                    <p className="text-center text-sm font-medium mt-2">Memory Usage</p>
                                </div>
                            </div>

                            {/* System Metrics */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium mb-3">Disk Usage</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span>System Disk (C:)</span>
                                                <span>{systemHealthData.disk}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-amber-500 rounded-full"
                                                    style={{ width: `${systemHealthData.disk}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span>Data Disk (D:)</span>
                                                <span>15%</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "15%" }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium mb-3">Network</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span>Bandwidth Usage</span>
                                                <span>{systemHealthData.network}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-violet-500 rounded-full"
                                                    style={{ width: `${systemHealthData.network}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span>Latency</span>
                                                <span>12ms</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "12%" }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* System Alerts */}
                        <Card className="p-6 border shadow-sm transition-all duration-300 hover:shadow-lg hover:border-amber-100">
                            <div className="flex items-center gap-2 mb-6">
                                <Shield className="h-5 w-5 text-amber-500" />
                                <h3 className="font-medium">System Alerts</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                            <Shield className="h-4 w-4 text-green-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-green-800">All Systems Operational</p>
                                            <p className="text-xs text-green-600">No issues detected</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg">
                                    <p className="text-sm font-medium mb-2">Recent Events</p>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <span>System backup completed</span>
                                            <span className="text-gray-500">Today, 03:00 AM</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span>Security scan completed</span>
                                            <span className="text-gray-500">Yesterday, 11:30 PM</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg">
                                    <p className="text-sm font-medium mb-2">Scheduled Maintenance</p>
                                    <div className="flex items-center justify-between text-xs">
                                        <span>System update</span>
                                        <span className="text-amber-500">In 3 days</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
