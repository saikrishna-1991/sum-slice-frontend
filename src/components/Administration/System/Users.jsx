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
        user_name: "pankaj.chhabra",
        password: "securePass123!",
        first_name: "Pankaj",
        last_name: "Chhabra",
        email: "pankaj.chhabra@sumslice.com",
        role_type: "Administrator",
        role_use_type: "Full Access",
        active: true,
        activation_date: "2025-01-16",
        phone: "+1-555-123-4567",
        creation_date: "2025-01-16 11:25:24",
        created_by: "system_admin",
        last_updated_by: "system_admin",
        last_update_date: "2025-03-03 09:20:33",
    },
    {
        id: 2,
        user_name: "jane.smith",
        password: "janePass2025!",
        first_name: "Jane",
        last_name: "Smith",
        email: "jane.smith@example.com",
        role_type: "Super Administrator",
        role_use_type: "Full Access",
        active: true,
        activation_date: "2025-01-20",
        phone: "+1-555-987-6543",
        creation_date: "2025-01-20 14:30:10",
        created_by: "system_admin",
        last_updated_by: "system_admin",
        last_update_date: "2025-03-28 14:30:10",
    },
    {
        id: 3,
        user_name: "bob.johnson",
        password: "bobSecure456!",
        first_name: "Bob",
        last_name: "Johnson",
        email: "bob.johnson@example.com",
        role_type: "Custom Administrator",
        role_use_type: "Limited Access",
        active: false,
        activation_date: "2025-02-01",
        phone: "+1-555-456-7890",
        creation_date: "2025-02-01 11:20:45",
        created_by: "system_admin",
        last_updated_by: "system_admin",
        last_update_date: "2025-02-10 11:20:45",
    },
    {
        id: 4,
        user_name: "alice.williams",
        password: "alicePass789!",
        first_name: "Alice",
        last_name: "Williams",
        email: "alice.williams@othercompany.com",
        role_type: "User",
        role_use_type: "Basic Access",
        active: false,
        activation_date: "2025-01-05",
        phone: "+1-555-321-6547",
        creation_date: "2025-01-05 08:15:30",
        created_by: "system_admin",
        last_updated_by: "system_admin",
        last_update_date: "2025-01-05 08:15:30",
    },
    {
        id: 5,
        user_name: "charlie.brown",
        password: "charliePass101!",
        first_name: "Charlie",
        last_name: "Brown",
        email: "charlie.brown@example.com",
        role_type: "User",
        role_use_type: "Basic Access",
        active: false,
        activation_date: "2024-12-20",
        phone: "+1-555-654-3210",
        creation_date: "2024-12-20 16:40:12",
        created_by: "system_admin",
        last_updated_by: "system_admin",
        last_update_date: "2024-12-20 16:40:12",
    },
];

// Define all available columns
const allColumns = [
    { id: "user_name", name: "Username", defaultVisible: true },
    { id: "first_name", name: "First Name", defaultVisible: true },
    { id: "last_name", name: "Last Name", defaultVisible: true },
    { id: "email", name: "Email", defaultVisible: true },
    { id: "role_type", name: "Role Type", defaultVisible: true },
    { id: "active", name: "Active", defaultVisible: true },
    { id: "activation_date", name: "Activation Date", defaultVisible: false },
    { id: "phone", name: "Phone", defaultVisible: false },
    { id: "creation_date", name: "Creation Date", defaultVisible: false },
    { id: "created_by", name: "Created By", defaultVisible: false },
    { id: "last_updated_by", name: "Last Updated By", defaultVisible: false },
    { id: "last_update_date", name: "Last Update Date", defaultVisible: false },
];

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
        active: userData.filter((user) => user.active).length,
        inactive: userData.filter((user) => !user.active).length,
        roleDistribution: {
            Administrator: userData.filter((user) => user.role_type === "Administrator").length,
            "Super Administrator": userData.filter((user) => user.role_type === "Super Administrator").length,
            "Custom Administrator": userData.filter((user) => user.role_type === "Custom Administrator").length,
            User: userData.filter((user) => user.role_type === "User").length,
        },
    };

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
            user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role_type.toLowerCase().includes(searchTerm.toLowerCase());

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
    const getInitials = (firstName, lastName) => {
        return `${firstName[0] || ""}${lastName[0] || ""}`;
    };

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
                                {visibleColumns.includes("user_name") && (
                                    <TableHead>
                                        <div
                                            className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                            onClick={() => handleSort("user_name")}
                                        >
                                            Username
                                            {sortColumn === "user_name" &&
                                                (sortDirection === "asc" ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                ))}
                                            <Popover
                                                open={activeFilterColumn === "user_name"}
                                                onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 ml-1"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveFilterColumn("user_name");
                                                        }}
                                                    >
                                                        <Filter className={`h-3 w-3 ${columnFilters.user_name ? "text-green-600" : ""}`} />
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
                                                                <RadioGroupItem value="equals" id="equals-user_name" />
                                                                <Label htmlFor="equals-user_name">Equals</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notEquals" id="notEquals-user_name" />
                                                                <Label htmlFor="notEquals-user_name">Does Not Equal</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="beginsWith" id="beginsWith-user_name" />
                                                                <Label htmlFor="beginsWith-user_name">Begins With</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="endsWith" id="endsWith-user_name" />
                                                                <Label htmlFor="endsWith-user_name">Ends With</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="contains" id="contains-user_name" />
                                                                <Label htmlFor="contains-user_name">Contains</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notContains" id="notContains-user_name" />
                                                                <Label htmlFor="notContains-user_name">Does Not Contain</Label>
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
                                                                    applyFilter("user_name", filterType, filterValue);
                                                                    setFilterValue("");
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
                                {visibleColumns.includes("first_name") && (
                                    <TableHead>
                                        <div
                                            className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                            onClick={() => handleSort("first_name")}
                                        >
                                            First Name
                                            {sortColumn === "first_name" &&
                                                (sortDirection === "asc" ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                ))}
                                            <Popover
                                                open={activeFilterColumn === "first_name"}
                                                onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 ml-1"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveFilterColumn("first_name");
                                                        }}
                                                    >
                                                        <Filter className={`h-3 w-3 ${columnFilters.first_name ? "text-green-600" : ""}`} />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-80">
                                                    <div className="space-y-4">
                                                        <h4 className="font-medium">Filter First Name</h4>
                                                        <RadioGroup
                                                            defaultValue={filterType}
                                                            onValueChange={setFilterType}
                                                            className="grid grid-cols-2 gap-2"
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="equals" id="equals-first_name" />
                                                                <Label htmlFor="equals-first_name">Equals</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notEquals" id="notEquals-first_name" />
                                                                <Label htmlFor="notEquals-first_name">Does Not Equal</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="beginsWith" id="beginsWith-first_name" />
                                                                <Label htmlFor="beginsWith-first_name">Begins With</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="endsWith" id="endsWith-first_name" />
                                                                <Label htmlFor="endsWith-first_name">Ends With</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="contains" id="contains-first_name" />
                                                                <Label htmlFor="contains-first_name">Contains</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notContains" id="notContains-first_name" />
                                                                <Label htmlFor="notContains-first_name">Does Not Contain</Label>
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
                                                                    applyFilter("first_name", filterType, filterValue);
                                                                    setFilterValue("");
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
                                {visibleColumns.includes("last_name") && (
                                    <TableHead>
                                        <div
                                            className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                            onClick={() => handleSort("last_name")}
                                        >
                                            Last Name
                                            {sortColumn === "last_name" &&
                                                (sortDirection === "asc" ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                ))}
                                            <Popover
                                                open={activeFilterColumn === "last_name"}
                                                onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 ml-1"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveFilterColumn("last_name");
                                                        }}
                                                    >
                                                        <Filter className={`h-3 w-3 ${columnFilters.last_name ? "text-green-600" : ""}`} />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-80">
                                                    <div className="space-y-4">
                                                        <h4 className="font-medium">Filter Last Name</h4>
                                                        <RadioGroup
                                                            defaultValue={filterType}
                                                            onValueChange={setFilterType}
                                                            className="grid grid-cols-2 gap-2"
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="equals" id="equals-last_name" />
                                                                <Label htmlFor="equals-last_name">Equals</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notEquals" id="notEquals-last_name" />
                                                                <Label htmlFor="notEquals-last_name">Does Not Equal</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="beginsWith" id="beginsWith-last_name" />
                                                                <Label htmlFor="beginsWith-last_name">Begins With</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="endsWith" id="endsWith-last_name" />
                                                                <Label htmlFor="endsWith-last_name">Ends With</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="contains" id="contains-last_name" />
                                                                <Label htmlFor="contains-last_name">Contains</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notContains" id="notContains-last_name" />
                                                                <Label htmlFor="notContains-last_name">Does Not Contain</Label>
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
                                                                    applyFilter("last_name", filterType, filterValue);
                                                                    setFilterValue("");
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
                                                            e.stopPropagation();
                                                            setActiveFilterColumn("email");
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
                                                                    applyFilter("email", filterType, filterValue);
                                                                    setFilterValue("");
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
                                {visibleColumns.includes("role_type") && (
                                    <TableHead>
                                        <div
                                            className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                            onClick={() => handleSort("role_type")}
                                        >
                                            Role Type
                                            {sortColumn === "role_type" &&
                                                (sortDirection === "asc" ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                ))}
                                            <Popover
                                                open={activeFilterColumn === "role_type"}
                                                onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 ml-1"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveFilterColumn("role_type");
                                                        }}
                                                    >
                                                        <Filter className={`h-3 w-3 ${columnFilters.role_type ? "text-green-600" : ""}`} />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-80">
                                                    <div className="space-y-4">
                                                        <h4 className="font-medium">Filter Role Type</h4>
                                                        <RadioGroup
                                                            defaultValue={filterType}
                                                            onValueChange={setFilterType}
                                                            className="grid grid-cols-2 gap-2"
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="equals" id="equals-role_type" />
                                                                <Label htmlFor="equals-role_type">Equals</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notEquals" id="notEquals-role_type" />
                                                                <Label htmlFor="notEquals-role_type">Does Not Equal</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="beginsWith" id="beginsWith-role_type" />
                                                                <Label htmlFor="beginsWith-role_type">Begins With</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="endsWith" id="endsWith-role_type" />
                                                                <Label htmlFor="endsWith-role_type">Ends With</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="contains" id="contains-role_type" />
                                                                <Label htmlFor="contains-role_type">Contains</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notContains" id="notContains-role_type" />
                                                                <Label htmlFor="notContains-role_type">Does Not Contain</Label>
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
                                                                    applyFilter("role_type", filterType, filterValue);
                                                                    setFilterValue("");
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
                                {visibleColumns.includes("active") && (
                                    <TableHead>
                                        <div
                                            className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                            onClick={() => handleSort("active")}
                                        >
                                            Active
                                            {sortColumn === "active" &&
                                                (sortDirection === "asc" ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                ))}
                                            <Popover
                                                open={activeFilterColumn === "active"}
                                                onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 ml-1"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveFilterColumn("active");
                                                        }}
                                                    >
                                                        <Filter className={`h-3 w-3 ${columnFilters.active ? "text-green-600" : ""}`} />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-80">
                                                    <div className="space-y-4">
                                                        <h4 className="font-medium">Filter Active</h4>
                                                        <RadioGroup
                                                            defaultValue={filterType}
                                                            onValueChange={setFilterType}
                                                            className="grid grid-cols-2 gap-2"
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="equals" id="equals-active" />
                                                                <Label htmlFor="equals-active">Equals</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notEquals" id="notEquals-active" />
                                                                <Label htmlFor="notEquals-active">Does Not Equal</Label>
                                                            </div>
                                                        </RadioGroup>
                                                        <Select value={filterValue} onValueChange={setFilterValue}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select value" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="true">Active</SelectItem>
                                                                <SelectItem value="false">Inactive</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <div className="flex justify-between">
                                                            <Button variant="outline" onClick={() => setActiveFilterColumn(null)}>
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                onClick={() => {
                                                                    applyFilter("active", filterType, filterValue);
                                                                    setFilterValue("");
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
                                {visibleColumns.includes("activation_date") && (
                                    <TableHead>
                                        <div
                                            className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                            onClick={() => handleSort("activation_date")}
                                        >
                                            Activation Date
                                            {sortColumn === "activation_date" &&
                                                (sortDirection === "asc" ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                ))}
                                            <Popover
                                                open={activeFilterColumn === "activation_date"}
                                                onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 ml-1"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveFilterColumn("activation_date");
                                                        }}
                                                    >
                                                        <Filter className={`h-3 w-3 ${columnFilters.activation_date ? "text-green-600" : ""}`} />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-80">
                                                    <div className="space-y-4">
                                                        <h4 className="font-medium">Filter Activation Date</h4>
                                                        <RadioGroup
                                                            defaultValue={filterType}
                                                            onValueChange={setFilterType}
                                                            className="grid grid-cols-2 gap-2"
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="equals" id="equals-activation_date" />
                                                                <Label htmlFor="equals-activation_date">Equals</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notEquals" id="notEquals-activation_date" />
                                                                <Label htmlFor="notEquals-activation_date">Does Not Equal</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="beginsWith" id="beginsWith-activation_date" />
                                                                <Label htmlFor="beginsWith-activation_date">Begins With</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="endsWith" id="endsWith-activation_date" />
                                                                <Label htmlFor="endsWith-activation_date">Ends With</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="contains" id="contains-activation_date" />
                                                                <Label htmlFor="contains-activation_date">Contains</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notContains" id="notContains-activation_date" />
                                                                <Label htmlFor="notContains-activation_date">Does Not Contain</Label>
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
                                                                    applyFilter("activation_date", filterType, filterValue);
                                                                    setFilterValue("");
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
                                {visibleColumns.includes("phone") && (
                                    <TableHead>
                                        <div
                                            className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                            onClick={() => handleSort("phone")}
                                        >
                                            Phone
                                            {sortColumn === "phone" &&
                                                (sortDirection === "asc" ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                ))}
                                            <Popover
                                                open={activeFilterColumn === "phone"}
                                                onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 ml-1"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveFilterColumn("phone");
                                                        }}
                                                    >
                                                        <Filter className={`h-3 w-3 ${columnFilters.phone ? "text-green-600" : ""}`} />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-80">
                                                    <div className="space-y-4">
                                                        <h4 className="font-medium">Filter Phone</h4>
                                                        <RadioGroup
                                                            defaultValue={filterType}
                                                            onValueChange={setFilterType}
                                                            className="grid grid-cols-2 gap-2"
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="equals" id="equals-phone" />
                                                                <Label htmlFor="equals-phone">Equals</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notEquals" id="notEquals-phone" />
                                                                <Label htmlFor="notEquals-phone">Does Not Equal</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="beginsWith" id="beginsWith-phone" />
                                                                <Label htmlFor="beginsWith-phone">Begins With</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="endsWith" id="endsWith-phone" />
                                                                <Label htmlFor="endsWith-phone">Ends With</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="contains" id="contains-phone" />
                                                                <Label htmlFor="contains-phone">Contains</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notContains" id="notContains-phone" />
                                                                <Label htmlFor="notContains-phone">Does Not Contain</Label>
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
                                                                    applyFilter("phone", filterType, filterValue);
                                                                    setFilterValue("");
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
                                {visibleColumns.includes("creation_date") && (
                                    <TableHead>
                                        <div
                                            className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                            onClick={() => handleSort("creation_date")}
                                        >
                                            Creation Date
                                            {sortColumn === "creation_date" &&
                                                (sortDirection === "asc" ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                ))}
                                            <Popover
                                                open={activeFilterColumn === "creation_date"}
                                                onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 ml-1"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveFilterColumn("creation_date");
                                                        }}
                                                    >
                                                        <Filter className={`h-3 w-3 ${columnFilters.creation_date ? "text-green-600" : ""}`} />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-80">
                                                    <div className="space-y-4">
                                                        <h4 className="font-medium">Filter Creation Date</h4>
                                                        <RadioGroup
                                                            defaultValue={filterType}
                                                            onValueChange={setFilterType}
                                                            className="grid grid-cols-2 gap-2"
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="equals" id="equals-creation_date" />
                                                                <Label htmlFor="equals-creation_date">Equals</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notEquals" id="notEquals-creation_date" />
                                                                <Label htmlFor="notEquals-creation_date">Does Not Equal</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="beginsWith" id="beginsWith-creation_date" />
                                                                <Label htmlFor="beginsWith-creation_date">Begins With</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="endsWith" id="endsWith-creation_date" />
                                                                <Label htmlFor="endsWith-creation_date">Ends With</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="contains" id="contains-creation_date" />
                                                                <Label htmlFor="contains-creation_date">Contains</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notContains" id="notContains-creation_date" />
                                                                <Label htmlFor="notContains-creation_date">Does Not Contain</Label>
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
                                                                    applyFilter("creation_date", filterType, filterValue);
                                                                    setFilterValue("");
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
                                {visibleColumns.includes("created_by") && (
                                    <TableHead>
                                        <div
                                            className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                            onClick={() => handleSort("created_by")}
                                        >
                                            Created By
                                            {sortColumn === "created_by" &&
                                                (sortDirection === "asc" ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                ))}
                                            <Popover
                                                open={activeFilterColumn === "created_by"}
                                                onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 ml-1"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveFilterColumn("created_by");
                                                        }}
                                                    >
                                                        <Filter className={`h-3 w-3 ${columnFilters.created_by ? "text-green-600" : ""}`} />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-80">
                                                    <div className="space-y-4">
                                                        <h4 className="font-medium">Filter Created By</h4>
                                                        <RadioGroup
                                                            defaultValue={filterType}
                                                            onValueChange={setFilterType}
                                                            className="grid grid-cols-2 gap-2"
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="equals" id="equals-created_by" />
                                                                <Label htmlFor="equals-created_by">Equals</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notEquals" id="notEquals-created_by" />
                                                                <Label htmlFor="notEquals-created_by">Does Not Equal</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="beginsWith" id="beginsWith-created_by" />
                                                                <Label htmlFor="beginsWith-created_by">Begins With</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="endsWith" id="endsWith-created_by" />
                                                                <Label htmlFor="endsWith-created_by">Ends With</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="contains" id="contains-created_by" />
                                                                <Label htmlFor="contains-created_by">Contains</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notContains" id="notContains-created_by" />
                                                                <Label htmlFor="notContains-created_by">Does Not Contain</Label>
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
                                                                    applyFilter("created_by", filterType, filterValue);
                                                                    setFilterValue("");
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
                                {visibleColumns.includes("last_updated_by") && (
                                    <TableHead>
                                        <div
                                            className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                            onClick={() => handleSort("last_updated_by")}
                                        >
                                            Last Updated By
                                            {sortColumn === "last_updated_by" &&
                                                (sortDirection === "asc" ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                ))}
                                            <Popover
                                                open={activeFilterColumn === "last_updated_by"}
                                                onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 ml-1"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveFilterColumn("last_updated_by");
                                                        }}
                                                    >
                                                        <Filter className={`h-3 w-3 ${columnFilters.last_updated_by ? "text-green-600" : ""}`} />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-80">
                                                    <div className="space-y-4">
                                                        <h4 className="font-medium">Filter Last Updated By</h4>
                                                        <RadioGroup
                                                            defaultValue={filterType}
                                                            onValueChange={setFilterType}
                                                            className="grid grid-cols-2 gap-2"
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="equals" id="equals-last_updated_by" />
                                                                <Label htmlFor="equals-last_updated_by">Equals</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notEquals" id="notEquals-last_updated_by" />
                                                                <Label htmlFor="notEquals-last_updated_by">Does Not Equal</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="beginsWith" id="beginsWith-last_updated_by" />
                                                                <Label htmlFor="beginsWith-last_updated_by">Begins With</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="endsWith" id="endsWith-last_updated_by" />
                                                                <Label htmlFor="endsWith-last_updated_by">Ends With</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="contains" id="contains-last_updated_by" />
                                                                <Label htmlFor="contains-last_updated_by">Contains</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notContains" id="notContains-last_updated_by" />
                                                                <Label htmlFor="notContains-last_updated_by">Does Not Contain</Label>
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
                                                                    applyFilter("last_updated_by", filterType, filterValue);
                                                                    setFilterValue("");
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
                                {visibleColumns.includes("last_update_date") && (
                                    <TableHead>
                                        <div
                                            className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                            onClick={() => handleSort("last_update_date")}
                                        >
                                            Last Update Date
                                            {sortColumn === "last_update_date" &&
                                                (sortDirection === "asc" ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                ))}
                                            <Popover
                                                open={activeFilterColumn === "last_update_date"}
                                                onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 ml-1"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveFilterColumn("last_update_date");
                                                        }}
                                                    >
                                                        <Filter className={`h-3 w-3 ${columnFilters.last_update_date ? "text-green-600" : ""}`} />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-80">
                                                    <div className="space-y-4">
                                                        <h4 className="font-medium">Filter Last Update Date</h4>
                                                        <RadioGroup
                                                            defaultValue={filterType}
                                                            onValueChange={setFilterType}
                                                            className="grid grid-cols-2 gap-2"
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="equals" id="equals-last_update_date" />
                                                                <Label htmlFor="equals-last_update_date">Equals</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notEquals" id="notEquals-last_update_date" />
                                                                <Label htmlFor="notEquals-last_update_date">Does Not Equal</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="beginsWith" id="beginsWith-last_update_date" />
                                                                <Label htmlFor="beginsWith-last_update_date">Begins With</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="endsWith" id="endsWith-last_update_date" />
                                                                <Label htmlFor="endsWith-last_update_date">Ends With</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="contains" id="contains-last_update_date" />
                                                                <Label htmlFor="contains-last_update_date">Contains</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="notContains" id="notContains-last_update_date" />
                                                                <Label htmlFor="notContains-last_update_date">Does Not Contain</Label>
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
                                                                    applyFilter("last_update_date", filterType, filterValue);
                                                                    setFilterValue("");
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
                                        {visibleColumns.includes("user_name") && (
                                            <TableCell>
                                                <button
                                                    className="text-green-600 hover:underline focus:outline-none font-medium flex items-center gap-1"
                                                    onClick={() => handleUserClick(user)}
                                                >
                                                    {user.user_name}
                                                </button>
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes("first_name") && (
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback className={`text-xs ${getAvatarColor(user.id)}`}>
                                                            {getInitials(user.first_name, user.last_name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span>{user.first_name}</span>
                                                </div>
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes("last_name") && <TableCell>{user.last_name}</TableCell>}
                                        {visibleColumns.includes("email") && <TableCell>{user.email}</TableCell>}
                                        {visibleColumns.includes("role_type") && (
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        user.role_type === "Administrator"
                                                            ? "bg-blue-50 text-blue-700 border-blue-200"
                                                            : user.role_type === "Super Administrator"
                                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                                : user.role_type === "Custom Administrator"
                                                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                                                    : "bg-violet-50 text-violet-700 border-violet-200"
                                                    }
                                                >
                                                    {user.role_type}
                                                </Badge>
                                            </TableCell>
                                        )}
                                        {visibleColumns.includes("active") && (
                                            <TableHead>
                                                <div
                                                    className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                                    onClick={() => handleSort("active")}
                                                >
                                                    Active
                                                    {sortColumn === "active" &&
                                                        (sortDirection === "asc" ? (
                                                            <ChevronUp className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronDown className="h-4 w-4" />
                                                        ))}
                                                    <Popover
                                                        open={activeFilterColumn === "active"}
                                                        onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                                    >
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-6 w-6 p-0 ml-1"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setActiveFilterColumn("active");
                                                                }}
                                                            >
                                                                <Filter className={`h-3 w-3 ${columnFilters.active ? "text-green-600" : ""}`} />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-80">
                                                            <div className="space-y-4">
                                                                <h4 className="font-medium">Filter Active</h4>
                                                                <RadioGroup
                                                                    defaultValue={filterType}
                                                                    onValueChange={setFilterType}
                                                                    className="grid grid-cols-2 gap-2"
                                                                >
                                                                    <div className="flex items-center space-x-2">
                                                                        <RadioGroupItem value="equals" id="equals-active" />
                                                                        <Label htmlFor="equals-active">Equals</Label>
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        <RadioGroupItem value="notEquals" id="notEquals-active" />
                                                                        <Label htmlFor="notEquals-active">Does Not Equal</Label>
                                                                    </div>
                                                                </RadioGroup>
                                                                <Select value={filterValue} onValueChange={setFilterValue}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select value" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="true">Active</SelectItem>
                                                                        <SelectItem value="false">Inactive</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                <div className="flex justify-between">
                                                                    <Button variant="outline" onClick={() => setActiveFilterColumn(null)}>
                                                                        Cancel
                                                                    </Button>
                                                                    <Button
                                                                        onClick={() => {
                                                                            applyFilter("active", filterType, filterValue);
                                                                            setFilterValue("");
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
                                        {visibleColumns.includes("activation_date") && <TableCell>{user.activation_date}</TableCell>}
                                        {visibleColumns.includes("phone") && <TableCell>{user.phone}</TableCell>}
                                        {visibleColumns.includes("creation_date") && <TableCell>{user.creation_date}</TableCell>}
                                        {visibleColumns.includes("created_by") && <TableCell>{user.created_by}</TableCell>}
                                        {visibleColumns.includes("last_updated_by") && <TableCell>{user.last_updated_by}</TableCell>}
                                        {visibleColumns.includes("last_update_date") && <TableCell>{user.last_update_date}</TableCell>}
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