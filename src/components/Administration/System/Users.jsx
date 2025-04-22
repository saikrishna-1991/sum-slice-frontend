"use client"

import { useState, useEffect } from "react"
import {
    Search,
    Download,
    Filter,
    Plus,
    Trash2,
    RefreshCw,
    X,
    Settings,
    Users,
    Clock,
    MoreHorizontal,
    ChevronDown,
    ChevronUp,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ClockIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { UserProfileDialog } from "./user-profile-dialog"
import { AddUserDialog } from "./add-user-dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Mock user data
const userData = [
    {
        id: 1,
        username: "pankaj.chhabra",
        fullName: "Pankaj Chhabra",
        email: "pankaj.chhabra@sumslice.com",
        role: "Administrator",
        status: "Active",
        lastLogin: "2025-03-15 09:45:22",
        domain: "example.com",
        hasMailAccount: true,
        personalInfo: {
            firstName: "Pankaj",
            lastName: "Chhabra",
            nickName: "Pankaj Chhabra",
            gender: "Not specified",
            street: "",
            city: "",
            state: "",
            postalCode: "",
            country: "United States",
            mobileNumber: "",
            phoneNumber: "",
        },
        accountInfo: {
            creationTime: "01/16/25 11:25:24 AM",
            lastPasswordResetTime: "03/3/25 09:20:33 AM",
            lastLoginTime: "03/3/25 09:23:24 AM",
            timeZone: "America/New_York",
            userId: "87625973",
        },
        customInfo: {
            "az.active.company": "spadskrun",
        },
        workFields: {
            employeeId: "",
            designation: "",
            department: "",
            mobileNumber: "",
            extension: "",
            phoneNumber: "",
        },
        services: {
            mail: "Enabled",
            calendar: "Enabled",
            contacts: "Enabled",
            autoExpiry: "on",
        },
        storage: {
            used: "677 KB",
            total: "30 GB",
        },
    },
    {
        id: 2,
        username: "jane.smith",
        fullName: "Jane Smith",
        email: "jane.smith@example.com",
        role: "Super Administrator",
        status: "Active",
        lastLogin: "2025-03-28 14:30:10",
        domain: "example.com",
        hasMailAccount: true,
    },
    {
        id: 3,
        username: "bob.johnson",
        fullName: "Bob Johnson",
        email: "bob.johnson@example.com",
        role: "Custom Administrator",
        status: "Inactive",
        lastLogin: "2025-02-10 11:20:45",
        domain: "example.com",
        hasMailAccount: false,
    },
    {
        id: 4,
        username: "alice.williams",
        fullName: "Alice Williams",
        email: "alice.williams@othercompany.com",
        role: "User",
        status: "Blocked",
        lastLogin: "2025-01-05 08:15:30",
        domain: "othercompany.com",
        hasMailAccount: true,
    },
    {
        id: 5,
        username: "charlie.brown",
        fullName: "Charlie Brown",
        email: "charlie.brown@example.com",
        role: "User",
        status: "Expired",
        lastLogin: "2024-12-20 16:40:12",
        domain: "example.com",
        hasMailAccount: true,
    },
]

// Define all available columns
const allColumns = [
    { id: "username", name: "Username", defaultVisible: true },
    { id: "fullName", name: "Full Name", defaultVisible: true },
    { id: "email", name: "Email", defaultVisible: true },
    { id: "role", name: "Role", defaultVisible: true },
    { id: "status", name: "Status", defaultVisible: true },
    { id: "lastLogin", name: "Last Login", defaultVisible: true },
    { id: "domain", name: "Domain", defaultVisible: false },
    { id: "hasMailAccount", name: "Mail Account", defaultVisible: false },
]

export default function UsersPage() {
    const { toast } = useToast()
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState("1")
    const [selectedUsers, setSelectedUsers] = useState([])
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [columnFilters, setColumnFilters] = useState({})
    const [activeFilterColumn, setActiveFilterColumn] = useState(null)
    const [filterValue, setFilterValue] = useState("")
    const [filterType, setFilterType] = useState("contains")
    const [selectedUser, setSelectedUser] = useState(null)
    const [isUserProfileOpen, setIsUserProfileOpen] = useState(false)
    const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
    const [isColumnSettingsOpen, setIsColumnSettingsOpen] = useState(false)
    const [visibleColumns, setVisibleColumns] = useState(
        allColumns.filter((col) => col.defaultVisible).map((col) => col.id),
    )
    const [isLoading, setIsLoading] = useState(false)
    const [sortColumn, setSortColumn] = useState(null)
    const [sortDirection, setSortDirection] = useState("asc")
    const [animate, setAnimate] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)

    // User stats
    const userStats = {
        total: userData.length,
        active: userData.filter((user) => user.status === "Active").length,
        inactive: userData.filter((user) => user.status === "Inactive").length,
        blocked: userData.filter((user) => user.status === "Blocked").length,
        expired: userData.filter((user) => user.status === "Expired").length,
        withMailAccount: userData.filter((user) => user.hasMailAccount).length,
        roleDistribution: {
            Administrator: userData.filter((user) => user.role === "Administrator").length,
            "Super Administrator": userData.filter((user) => user.role === "Super Administrator").length,
            "Custom Administrator": userData.filter((user) => user.role === "Custom Administrator").length,
            User: userData.filter((user) => user.role === "User").length,
        },
    }

    // Animation effect
    useEffect(() => {
        setAnimate(true)
    }, [])

    const handleUserSelection = (id) => {
        setSelectedUsers((prev) => (prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]))
    }

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedUsers(filteredUsers.map((user) => user.id))
        } else {
            setSelectedUsers([])
        }
    }

    const handleDeleteUsers = () => {
        console.log("Deleting users:", selectedUsers)
        toast({
            title: "Users Deleted",
            description: `${selectedUsers.length} user(s) have been deleted successfully.`,
        })
        setSelectedUsers([])
        setIsDeleteDialogOpen(false)
    }

    const handleAddUser = () => {
        setIsAddUserDialogOpen(true)
    }

    const handleExport = () => {
        toast({
            title: "Export Started",
            description: "Your user data is being exported. You'll be notified when it's ready.",
        })
    }

    const handleRefresh = () => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast({
                title: "Data Refreshed",
                description: "User data has been refreshed successfully.",
            })
        }, 1000)
    }

    const applyFilter = (column, type, value) => {
        setColumnFilters((prev) => ({
            ...prev,
            [column]: { type, value },
        }))
        setActiveFilterColumn(null)
    }

    const clearFilter = (column) => {
        setColumnFilters((prev) => {
            const newFilters = { ...prev }
            delete newFilters[column]
            return newFilters
        })
    }

    const clearAllFilters = () => {
        setColumnFilters({})
    }

    const handleUserClick = (user, editMode = false) => {
        setSelectedUser(user)
        setIsEditMode(editMode)
        setIsUserProfileOpen(true)
    }

    const toggleColumnVisibility = (columnId) => {
        setVisibleColumns((prev) => (prev.includes(columnId) ? prev.filter((id) => id !== columnId) : [...prev, columnId]))
    }

    const resetColumnVisibility = () => {
        setVisibleColumns(allColumns.filter((col) => col.defaultVisible).map((col) => col.id))
    }

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortColumn(column)
            setSortDirection("asc")
        }
    }

    // Apply filters and sorting to user data
    let filteredUsers = userData.filter((user) => {
        // First apply search term
        const matchesSearch =
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase())

        if (!matchesSearch) return false

        // Apply column filters
        for (const [column, filter] of Object.entries(columnFilters)) {
            let value = user[column]

            // Handle boolean values
            if (typeof value === "boolean") {
                value = value ? "true" : "false"
            } else {
                value = (value?.toString() || "").toLowerCase()
            }

            const filterVal = filter.value.toLowerCase()

            switch (filter.type) {
                case "equals":
                    if (value !== filterVal) return false
                    break
                case "notEquals":
                    if (value === filterVal) return false
                    break
                case "beginsWith":
                    if (!value.startsWith(filterVal)) return false
                    break
                case "endsWith":
                    if (!value.endsWith(filterVal)) return false
                    break
                case "contains":
                    if (!value.includes(filterVal)) return false
                    break
                case "notContains":
                    if (value.includes(filterVal)) return false
                    break
                default:
                    break
            }
        }
        return true
    })

    // Apply sorting
    if (sortColumn) {
        filteredUsers = [...filteredUsers].sort((a, b) => {
            let valueA = a[sortColumn]
            let valueB = b[sortColumn]

            // Handle undefined values
            if (valueA === undefined) valueA = ""
            if (valueB === undefined) valueB = ""

            // Convert to strings for comparison
            valueA = valueA?.toString() || ""
            valueB = valueB?.toString() || ""

            if (sortDirection === "asc") {
                return valueA.localeCompare(valueB)
            } else {
                return valueB.localeCompare(valueA)
            }
        })
    }

    // Get status icon based on user status
    const getStatusIcon = (status) => {
        switch (status) {
            case "Active":
                return <CheckCircle2 className="h-4 w-4 text-green-500" />
            case "Inactive":
                return <AlertCircle className="h-4 w-4 text-yellow-500" />
            case "Blocked":
                return <XCircle className="h-4 w-4 text-red-500" />
            case "Expired":
                return <ClockIcon className="h-4 w-4 text-gray-500" />
            default:
                return null
        }
    }

    // Get initials from full name
    const getInitials = (name) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
    }

    // Get random color for avatar
    const getAvatarColor = (id) => {
        const colors = [
            "bg-blue-500",
            "bg-green-500",
            "bg-purple-500",
            "bg-amber-500",
            "bg-rose-500",
            "bg-cyan-500",
            "bg-indigo-500",
        ]
        return colors[id % colors.length]
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">User Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and monitor user accounts</p>
                </div>
            </div>

            <>
                {/* Search and Actions */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input
                            className="pl-8 w-full md:w-[300px]"
                            placeholder="Search users"
                            type="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            onClick={handleAddUser}

                            className="transition-all duration-300 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add User
                        </Button>

                        <Button
                            variant="outline"
                            className={`transition-all duration-300 ${selectedUsers.length === 0 ? "opacity-50" : "hover:bg-red-50 hover:text-red-600 hover:border-red-200"}`}
                            onClick={() => {
                                if (selectedUsers.length > 0) {
                                    setIsDeleteDialogOpen(true)
                                } else {
                                    toast({
                                        title: "No Selection",
                                        description: "Please select at least one user to delete.",
                                        variant: "destructive",
                                    })
                                }
                            }}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleRefresh}
                            className="transition-all duration-300 hover:bg-blue-50 hover:text-green-600 hover:border-blue-200"
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                            Refresh
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleExport}
                            className="transition-all duration-300 hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="transition-all duration-300 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200"
                                >
                                    <Settings className="h-4 w-4 mr-2" />
                                    Columns
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {allColumns.map((column) => (
                                    <DropdownMenuItem key={column.id} onSelect={(e) => e.preventDefault()}>
                                        <div className="flex items-center gap-2 w-full" onClick={() => toggleColumnVisibility(column.id)}>
                                            <Checkbox checked={visibleColumns.includes(column.id)} />
                                            <span>{column.name}</span>
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onSelect={resetColumnVisibility}>
                                    <Button variant="ghost" size="sm" className="w-full justify-start p-0 h-auto font-normal">
                                        Reset to Default
                                    </Button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Active Filters */}
                {Object.keys(columnFilters).length > 0 && (
                    <div className="flex flex-wrap gap-2 items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-500 mr-2">Active Filters:</span>
                        {Object.entries(columnFilters).map(([column, filter]) => (
                            <Badge key={column} variant="outline" className="flex items-center gap-1 bg-white">
                                <span>
                                    {allColumns.find((col) => col.id === column)?.name || column}: {filter.type} "{filter.value}"
                                </span>
                                <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1" onClick={() => clearFilter(column)}>
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        ))}
                        <Button variant="ghost" size="sm" className="ml-auto text-xs" onClick={clearAllFilters}>
                            Clear All
                        </Button>
                    </div>
                )}

                {/* Users Table */}
                <div className="border rounded-lg overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={selectedUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                                        onCheckedChange={handleSelectAll}
                                    />
                                </TableHead>
                                {visibleColumns.includes("username") && (
                                    <TableHead>
                                        <div
                                            className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                            onClick={() => handleSort("username")}
                                        >
                                            Username
                                            {sortColumn === "username" &&
                                                (sortDirection === "asc" ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                ))}
                                            <Popover
                                                open={activeFilterColumn === "username"}
                                                onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 ml-1"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setActiveFilterColumn("username")
                                                        }}
                                                    >
                                                        <Filter className={`h-3 w-3 ${columnFilters.username ? "text-green-600" : ""}`} />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-80">
                                                    <div className="space-y-4">
                                                        <h4 className="font-medium">Filter Username</h4>
                                                        <RadioGroup
                                                            defaultValue={filterType}
                                                            onValueChange={setFilterType}
                                                            className="grid grid-cols-2 gap-2"
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="equals" id="equals" />
                                                                <Label htmlFor="equals">Equals</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notEquals" id="notEquals" />
                                                                <Label htmlFor="notEquals">Does Not Equal</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="beginsWith" id="beginsWith" />
                                                                <Label htmlFor="beginsWith">Begins With</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="endsWith" id="endsWith" />
                                                                <Label htmlFor="endsWith">Ends With</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="contains" id="contains" />
                                                                <Label htmlFor="contains">Contains</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notContains" id="notContains" />
                                                                <Label htmlFor="notContains">Does Not Contain</Label>
                                                            </div>
                                                        </RadioGroup>
                                                        <Input
                                                            placeholder="Filter value..."
                                                            value={filterValue}
                                                            onChange={(e) => setFilterValue(e.target.value)}
                                                        />
                                                        <div className="flex justify-between">
                                                            <Button variant="outline" onClick={() => setActiveFilterColumn(null)}>
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                onClick={() => {
                                                                    applyFilter("username", filterType, filterValue)
                                                                    setFilterValue("")
                                                                }}
                                                                className="bg-green-700 hover:bg-green-800"
                                                            >
                                                                Apply Filter
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </TableHead>
                                )}
                                {visibleColumns.includes("fullName") && (
                                    <TableHead>
                                        <div
                                            className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                            onClick={() => handleSort("fullName")}
                                        >
                                            Full Name
                                            {sortColumn === "fullName" &&
                                                (sortDirection === "asc" ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                ))}
                                            <Popover
                                                open={activeFilterColumn === "fullName"}
                                                onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 ml-1"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setActiveFilterColumn("fullName")
                                                        }}
                                                    >
                                                        <Filter className={`h-3 w-3 ${columnFilters.fullName ? "text-green-600" : ""}`} />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-80">
                                                    <div className="space-y-4">
                                                        <h4 className="font-medium">Filter Full Name</h4>
                                                        <RadioGroup
                                                            defaultValue={filterType}
                                                            onValueChange={setFilterType}
                                                            className="grid grid-cols-2 gap-2"
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="equals" id="equals-fullName" />
                                                                <Label htmlFor="equals-fullName">Equals</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notEquals" id="notEquals-fullName" />
                                                                <Label htmlFor="notEquals-fullName">Does Not Equal</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="beginsWith" id="beginsWith-fullName" />
                                                                <Label htmlFor="beginsWith-fullName">Begins With</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="endsWith" id="endsWith-fullName" />
                                                                <Label htmlFor="endsWith-fullName">Ends With</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="contains" id="contains-fullName" />
                                                                <Label htmlFor="contains-fullName">Contains</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notContains" id="notContains-fullName" />
                                                                <Label htmlFor="notContains-fullName">Does Not Contain</Label>
                                                            </div>
                                                        </RadioGroup>
                                                        <Input
                                                            placeholder="Filter value..."
                                                            value={filterValue}
                                                            onChange={(e) => setFilterValue(e.target.value)}
                                                        />
                                                        <div className="flex justify-between">
                                                            <Button variant="outline" onClick={() => setActiveFilterColumn(null)}>
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                onClick={() => {
                                                                    applyFilter("fullName", filterType, filterValue)
                                                                    setFilterValue("")
                                                                }}
                                                                className="bg-green-700 hover:bg-green-800"
                                                            >
                                                                Apply Filter
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </TableHead>
                                )}
                                {visibleColumns.includes("email") && (
                                    <TableHead>
                                        <div
                                            className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                            onClick={() => handleSort("email")}
                                        >
                                            Email
                                            {sortColumn === "email" &&
                                                (sortDirection === "asc" ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                ))}
                                            <Popover
                                                open={activeFilterColumn === "email"}
                                                onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 ml-1"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setActiveFilterColumn("email")
                                                        }}
                                                    >
                                                        <Filter className={`h-3 w-3 ${columnFilters.email ? "text-green-600" : ""}`} />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-80">
                                                    <div className="space-y-4">
                                                        <h4 className="font-medium">Filter Email</h4>
                                                        <RadioGroup
                                                            defaultValue={filterType}
                                                            onValueChange={setFilterType}
                                                            className="grid grid-cols-2 gap-2"
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="equals" id="equals-email" />
                                                                <Label htmlFor="equals-email">Equals</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notEquals" id="notEquals-email" />
                                                                <Label htmlFor="notEquals-email">Does Not Equal</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="beginsWith" id="beginsWith-email" />
                                                                <Label htmlFor="beginsWith-email">Begins With</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="endsWith" id="endsWith-email" />
                                                                <Label htmlFor="endsWith-email">Ends With</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="contains" id="contains-email" />
                                                                <Label htmlFor="contains-email">Contains</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notContains" id="notContains-email" />
                                                                <Label htmlFor="notContains-email">Does Not Contain</Label>
                                                            </div>
                                                        </RadioGroup>
                                                        <Input
                                                            placeholder="Filter value..."
                                                            value={filterValue}
                                                            onChange={(e) => setFilterValue(e.target.value)}
                                                        />
                                                        <div className="flex justify-between">
                                                            <Button variant="outline" onClick={() => setActiveFilterColumn(null)}>
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                onClick={() => {
                                                                    applyFilter("email", filterType, filterValue)
                                                                    setFilterValue("")
                                                                }}
                                                                className="bg-green-700 hover:bg-green-800"
                                                            >
                                                                Apply Filter
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </TableHead>
                                )}
                                {visibleColumns.includes("role") && (
                                    <TableHead>
                                        <div
                                            className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                            onClick={() => handleSort("role")}
                                        >
                                            Role
                                            {sortColumn === "role" &&
                                                (sortDirection === "asc" ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                ))}
                                            <Popover
                                                open={activeFilterColumn === "role"}
                                                onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 ml-1"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setActiveFilterColumn("role")
                                                        }}
                                                    >
                                                        <Filter className={`h-3 w-3 ${columnFilters.role ? "text-green-600" : ""}`} />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-80">
                                                    <div className="space-y-4">
                                                        <h4 className="font-medium">Filter Role</h4>
                                                        <RadioGroup
                                                            defaultValue={filterType}
                                                            onValueChange={setFilterType}
                                                            className="grid grid-cols-2 gap-2"
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="equals" id="equals-role" />
                                                                <Label htmlFor="equals-role">Equals</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notEquals" id="notEquals-role" />
                                                                <Label htmlFor="notEquals-role">Does Not Equal</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="beginsWith" id="beginsWith-role" />
                                                                <Label htmlFor="beginsWith-role">Begins With</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="endsWith" id="endsWith-role" />
                                                                <Label htmlFor="endsWith-role">Ends With</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="contains" id="contains-role" />
                                                                <Label htmlFor="contains-role">Contains</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notContains" id="notContains-role" />
                                                                <Label htmlFor="notContains-role">Does Not Contain</Label>
                                                            </div>
                                                        </RadioGroup>
                                                        <Input
                                                            placeholder="Filter value..."
                                                            value={filterValue}
                                                            onChange={(e) => setFilterValue(e.target.value)}
                                                        />
                                                        <div className="flex justify-between">
                                                            <Button variant="outline" onClick={() => setActiveFilterColumn(null)}>
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                onClick={() => {
                                                                    applyFilter("role", filterType, filterValue)
                                                                    setFilterValue("")
                                                                }}
                                                                className="bg-green-700 hover:bg-green-800"
                                                            >
                                                                Apply Filter
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </TableHead>
                                )}
                                {visibleColumns.includes("status") && (
                                    <TableHead>
                                        <div
                                            className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                            onClick={() => handleSort("status")}
                                        >
                                            Status
                                            {sortColumn === "status" &&
                                                (sortDirection === "asc" ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                ))}
                                            <Popover
                                                open={activeFilterColumn === "status"}
                                                onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 ml-1"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setActiveFilterColumn("status")
                                                        }}
                                                    >
                                                        <Filter className={`h-3 w-3 ${columnFilters.status ? "text-green-600" : ""}`} />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-80">
                                                    <div className="space-y-4">
                                                        <h4 className="font-medium">Filter Status</h4>
                                                        <RadioGroup
                                                            defaultValue={filterType}
                                                            onValueChange={setFilterType}
                                                            className="grid grid-cols-2 gap-2"
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="equals" id="equals-status" />
                                                                <Label htmlFor="equals-status">Equals</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notEquals" id="notEquals-status" />
                                                                <Label htmlFor="notEquals-status">Does Not Equal</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="beginsWith" id="beginsWith-status" />
                                                                <Label htmlFor="beginsWith-status">Begins With</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="endsWith" id="endsWith-status" />
                                                                <Label htmlFor="endsWith-status">Ends With</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="contains" id="contains-status" />
                                                                <Label htmlFor="contains-status">Contains</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notContains" id="notContains-status" />
                                                                <Label htmlFor="notContains-status">Does Not Contain</Label>
                                                            </div>
                                                        </RadioGroup>
                                                        <Input
                                                            placeholder="Filter value..."
                                                            value={filterValue}
                                                            onChange={(e) => setFilterValue(e.target.value)}
                                                        />
                                                        <div className="flex justify-between">
                                                            <Button variant="outline" onClick={() => setActiveFilterColumn(null)}>
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                onClick={() => {
                                                                    applyFilter("status", filterType, filterValue)
                                                                    setFilterValue("")
                                                                }}
                                                                className="bg-green-700 hover:bg-green-800"
                                                            >
                                                                Apply Filter
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </TableHead>
                                )}
                                {visibleColumns.includes("lastLogin") && (
                                    <TableHead>
                                        <div
                                            className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                            onClick={() => handleSort("lastLogin")}
                                        >
                                            Last Login
                                            {sortColumn === "lastLogin" &&
                                                (sortDirection === "asc" ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                ))}
                                            <Popover
                                                open={activeFilterColumn === "lastLogin"}
                                                onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 ml-1"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setActiveFilterColumn("lastLogin")
                                                        }}
                                                    >
                                                        <Filter className={`h-3 w-3 ${columnFilters.lastLogin ? "text-green-600" : ""}`} />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-80">
                                                    <div className="space-y-4">
                                                        <h4 className="font-medium">Filter Last Login</h4>
                                                        <RadioGroup
                                                            defaultValue={filterType}
                                                            onValueChange={setFilterType}
                                                            className="grid grid-cols-2 gap-2"
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="equals" id="equals-lastLogin" />
                                                                <Label htmlFor="equals-lastLogin">Equals</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notEquals" id="notEquals-lastLogin" />
                                                                <Label htmlFor="notEquals-lastLogin">Does Not Equal</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="beginsWith" id="beginsWith-lastLogin" />
                                                                <Label htmlFor="beginsWith-lastLogin">Begins With</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="endsWith" id="endsWith-lastLogin" />
                                                                <Label htmlFor="endsWith-lastLogin">Ends With</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="contains" id="contains-lastLogin" />
                                                                <Label htmlFor="contains-lastLogin">Contains</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notContains" id="notContains-lastLogin" />
                                                                <Label htmlFor="notContains-lastLogin">Does Not Contain</Label>
                                                            </div>
                                                        </RadioGroup>
                                                        <Input
                                                            placeholder="Filter value..."
                                                            value={filterValue}
                                                            onChange={(e) => setFilterValue(e.target.value)}
                                                        />
                                                        <div className="flex justify-between">
                                                            <Button variant="outline" onClick={() => setActiveFilterColumn(null)}>
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                onClick={() => {
                                                                    applyFilter("lastLogin", filterType, filterValue)
                                                                    setFilterValue("")
                                                                }}
                                                                className="bg-green-700 hover:bg-green-800"
                                                            >
                                                                Apply Filter
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </TableHead>
                                )}
                                {visibleColumns.includes("domain") && (
                                    <TableHead>
                                        <div
                                            className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                            onClick={() => handleSort("domain")}
                                        >
                                            Domain
                                            {sortColumn === "domain" &&
                                                (sortDirection === "asc" ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                ))}
                                            <Popover
                                                open={activeFilterColumn === "domain"}
                                                onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        parametr
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 ml-1"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setActiveFilterColumn("domain")
                                                        }}
                                                    >
                                                        <Filter className={`h-3 w-3 ${columnFilters.domain ? "text-green-600" : ""}`} />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-80">
                                                    <div className="space-y-4">
                                                        <h4 className="font-medium">Filter Domain</h4>
                                                        <RadioGroup
                                                            defaultValue={filterType}
                                                            onValueChange={setFilterType}
                                                            className="grid grid-cols-2 gap-2"
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="equals" id="equals-domain" />
                                                                <Label htmlFor="equals-domain">Equals</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notEquals" id="notEquals-domain" />
                                                                <Label htmlFor="notEquals-domain">Does Not Equal</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="beginsWith" id="beginsWith-domain" />
                                                                <Label htmlFor="beginsWith-domain">Begins With</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="endsWith" id="endsWith-domain" />
                                                                <Label htmlFor="endsWith-domain">Ends With</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="contains" id="contains-domain" />
                                                                <Label htmlFor="contains-domain">Contains</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notContains" id="notContains-domain" />
                                                                <Label htmlFor="notContains-domain">Does Not Contain</Label>
                                                            </div>
                                                        </RadioGroup>
                                                        <Input
                                                            placeholder="Filter value..."
                                                            value={filterValue}
                                                            onChange={(e) => setFilterValue(e.target.value)}
                                                        />
                                                        <div className="flex justify-between">
                                                            <Button variant="outline" onClick={() => setActiveFilterColumn(null)}>
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                onClick={() => {
                                                                    applyFilter("domain", filterType, filterValue)
                                                                    setFilterValue("")
                                                                }}
                                                                className="bg-green-700 hover:bg-green-800"
                                                            >
                                                                Apply Filter
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </TableHead>
                                )}
                                {visibleColumns.includes("hasMailAccount") && (
                                    <TableHead>
                                        <div
                                            className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                            onClick={() => handleSort("hasMailAccount")}
                                        >
                                            Mail Account
                                            {sortColumn === "hasMailAccount" &&
                                                (sortDirection === "asc" ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                ))}
                                            <Popover
                                                open={activeFilterColumn === "hasMailAccount"}
                                                onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 ml-1"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setActiveFilterColumn("hasMailAccount")
                                                        }}
                                                    >
                                                        <Filter className={`h-3 w-3 ${columnFilters.hasMailAccount ? "text-green-600" : ""}`} />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-80">
                                                    <div className="space-y-4">
                                                        <h4 className="font-medium">Filter Mail Account</h4>
                                                        <RadioGroup
                                                            defaultValue={filterType}
                                                            onValueChange={setFilterType}
                                                            className="grid grid-cols-2 gap-2"
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="equals" id="equals-mail" />
                                                                <Label htmlFor="equals-mail">Equals</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notEquals" id="notEquals-mail" />
                                                                <Label htmlFor="notEquals-mail">Does Not Equal</Label>
                                                            </div>
                                                        </RadioGroup>
                                                        <Select value={filterValue} onValueChange={setFilterValue}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select value" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="true">Yes</SelectItem>
                                                                <SelectItem value="false">No</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <div className="flex justify-between">
                                                            <Button variant="outline" onClick={() => setActiveFilterColumn(null)}>
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                onClick={() => {
                                                                    applyFilter("hasMailAccount", filterType, filterValue)
                                                                    setFilterValue("")
                                                                }}
                                                                className="bg-green-700 hover:bg-green-800"
                                                            >
                                                                Apply Filter
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </TableHead>
                                )}
                                <TableHead className="w-10">
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedUsers.includes(user.id)}
                                                onCheckedChange={() => handleUserSelection(user.id)}
                                            />
                                        </TableCell>
                                        {visibleColumns.includes("username") && (
                                            <TableCell>
                                                <button
                                                    className="text-green-600 hover:underline focus:outline-none font-medium flex items-center gap-1"
                                                    onClick={() => handleUserClick(user)}
                                                >
                                                    {user.username}
                                                </button>
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes("fullName") && (
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback className={`text-xs ${getAvatarColor(user.id)}`}>
                                                            {getInitials(user.fullName)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span>{user.fullName}</span>
                                                </div>
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes("email") && <TableCell>{user.email}</TableCell>}
                                        {visibleColumns.includes("role") && (
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        user.role === "Administrator"
                                                            ? "bg-blue-50 text-blue-700 border-blue-200"
                                                            : user.role === "Super Administrator"
                                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                                : user.role === "Custom Administrator"
                                                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                                                    : "bg-violet-50 text-violet-700 border-violet-200"
                                                    }
                                                >
                                                    {user.role}
                                                </Badge>
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes("status") && (
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    {getStatusIcon(user.status)}
                                                    <span
                                                        className={
                                                            user.status === "Active"
                                                                ? "text-green-600"
                                                                : user.status === "Inactive"
                                                                    ? "text-yellow-600"
                                                                    : user.status === "Blocked"
                                                                        ? "text-red-600"
                                                                        : "text-gray-600"
                                                        }
                                                    >
                                                        {user.status}
                                                    </span>
                                                </div>
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes("lastLogin") && (
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3 text-gray-400" />
                                                    <span>{user.lastLogin}</span>
                                                </div>
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes("domain") && <TableCell>{user.domain}</TableCell>}
                                        {visibleColumns.includes("hasMailAccount") && (
                                            <TableCell>
                                                <Badge
                                                    variant={user.hasMailAccount ? "default" : "secondary"}
                                                    className={
                                                        user.hasMailAccount
                                                            ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                                    }
                                                >
                                                    {user.hasMailAccount ? "Yes" : "No"}
                                                </Badge>
                                            </TableCell>
                                        )}
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleUserClick(user)}>View profile</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleUserClick(user, true)}>Edit user</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600">Delete user</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={visibleColumns.length + 2} className="text-center py-8">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <Users className="h-12 w-12 mb-2 text-gray-300" />
                                            <h3 className="text-lg font-medium">No users found</h3>
                                            <p className="text-sm">Try adjusting your search or filter criteria.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                        <span>Show</span>
                        <Select defaultValue="10">
                            <SelectTrigger className="w-20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                        </Select>
                        <span>per page</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span>Page</span>
                        <Input
                            className="w-16"
                            value={currentPage}
                            onChange={(e) => {
                                const value = e.target.value
                                if (/^\d*$/.test(value)) {
                                    setCurrentPage(value)
                                }
                            }}
                        />
                        <span>of {Math.max(1, Math.ceil(filteredUsers.length / 10))}</span>
                        <span>
                            Displaying {filteredUsers.length > 0 ? `1 - ${Math.min(filteredUsers.length, 10)}` : "0"} of{" "}
                            {filteredUsers.length}
                        </span>
                    </div>
                </div>
            </>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {selectedUsers.length} user(s)? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteUsers}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog >

            {/* User Profile Dialog */}
            {
                selectedUser && (
                    <UserProfileDialog
                        user={selectedUser}
                        open={isUserProfileOpen}
                        onOpenChange={setIsUserProfileOpen}
                        isEditing={isEditMode}
                    />
                )
            }

            {/* Add User Dialog */}
            <AddUserDialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen} />
        </div >
    )
}