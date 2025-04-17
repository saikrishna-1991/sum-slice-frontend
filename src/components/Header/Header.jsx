"use client"

import { Link, useNavigate } from "react-router-dom"
import { Bell, Cog, Home, LogOut, Star } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn")
        navigate("/")
    }

    const headerIcons = [
        { icon: Home, tooltip: "Home", href: "/dashboard" },
        {
            icon: Bell,
            tooltip: "Notifications",
            dropdownItems: [
                { label: "New message from Partner A", time: "5 minutes ago" },
                { label: "Rebate calculation completed", time: "1 hour ago" },
                { label: "System update scheduled", time: "1 day ago" },
            ],
        },
        {
            icon: Star,
            tooltip: "Favorites",
            dropdownItems: [{ label: "Partner Portal" }, { label: "Rebate Workbench" }, { label: "Reporting" }],
        },
        {
            icon: Cog,
            tooltip: "Settings",
            dropdownItems: [
                { label: "Account Settings" },
                { label: "Notification Preferences" },
                { label: "Privacy and Security" },
            ],
        },
    ]

    return (
        <TooltipProvider>
            <div className="flex items-center justify-between px-2 sm:px-4 py-2 bg-white border-b">
                <div className="flex items-center gap-1 sm:gap-2">
                    <div className="grid grid-cols-3 gap-0.5 text-green-700">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-current" />
                        ))}
                    </div>
                    <div className="bg-red-700 text-white px-2 sm:px-4 py-1 text-xs sm:text-sm">McLANE</div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    {headerIcons.map((item, index) =>
                        item.dropdownItems ? (
                            <DropdownMenu key={index}>
                                <DropdownMenuTrigger asChild>
                                    <div className="focus:outline-none">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="cursor-pointer">
                                                    <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 text-green-700`} />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{item.tooltip}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel>{item.tooltip}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                                        <DropdownMenuItem key={dropdownIndex}>
                                            <span className="flex flex-col">
                                                <span>{dropdownItem.label}</span>
                                                {dropdownItem.time && <span className="text-xs text-gray-500">{dropdownItem.time}</span>}
                                            </span>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Tooltip key={index}>
                                <TooltipTrigger asChild>
                                    <Link to={item.href} className="cursor-pointer">
                                        <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 text-green-700`} />
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{item.tooltip}</p>
                                </TooltipContent>
                            </Tooltip>
                        ),
                    )}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="cursor-pointer" onClick={handleLogout}>
                                <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-green-700" />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Logout</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </TooltipProvider>
    )
}
