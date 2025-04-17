"use client"

import { useState } from "react"
import { Search, Download, Filter, Plus, Trash2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
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

export default function UsersPage() {
    const toast = useToast()
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState("1")
    const [selectedUsers, setSelectedUsers] = useState([])
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [activeFilter, setActiveFilter] = useState(null)
    const [selectedUser, setSelectedUser] = useState(null)
    const [isUserProfileOpen, setIsUserProfileOpen] = useState(false)
    const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)

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
        toast({
            title: "Data Refreshed",
            description: "User data has been refreshed successfully.",
        })
    }

    const applyFilter = (filterType) => {
        setActiveFilter(filterType)
        console.log(`Applying filter: ${filterType}`)
    }

    const handleUserClick = (user) => {
        setSelectedUser(user)
        setIsUserProfileOpen(true)
    }

    // Apply filters to user data
    const filteredUsers = userData.filter((user) => {
        // First apply search term
        const matchesSearch =
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase())

        // Then apply active filter if any
        if (!matchesSearch) return false

        switch (activeFilter) {
            case "Super Administrator":
                return user.role === "Super Administrator"
            case "Administrators":
                return user.role === "Administrator"
            case "Custom Administrators":
                return user.role === "Custom Administrator"
            case "Users without mail account":
                return !user.hasMailAccount
            case "Active users":
                return user.status === "Active"
            case "Inactive users":
                return user.status === "Inactive"
            case "Blocked users":
                return user.status === "Blocked"
            case "Expired users":
                return user.status === "Expired"
            case "Domains":
                // This would typically open another dropdown for domain selection
                return true
            default:
                return true
        }
    })

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold">User Management</h1>

            {/* Search and Actions */}
            <div className="flex justify-between items-center">
                <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                        className="pl-8 w-[300px]"
                        placeholder="Search users"
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleAddUser}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add User
                    </Button>

                    <Button
                        variant="outline"
                        className={selectedUsers.length === 0 ? "opacity-50" : ""}
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

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Filter className="h-4 w-4 mr-2" />
                                {activeFilter || "Filter"}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem onClick={() => setActiveFilter(null)}>All Users</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => applyFilter("Super Administrator")}>
                                Super Administrator
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => applyFilter("Administrators")}>Administrators</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => applyFilter("Custom Administrators")}>
                                Custom Administrators
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => applyFilter("Users without mail account")}>
                                Users without mail account
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => applyFilter("Active users")}>Active users</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => applyFilter("Inactive users")}>Inactive users</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => applyFilter("Blocked users")}>Blocked users</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => applyFilter("Expired users")}>Expired users</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => applyFilter("Domains")}>Domains</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant="outline" onClick={handleRefresh}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>

                    <Button variant="outline" onClick={handleExport}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Users Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12">
                            <Checkbox
                                checked={selectedUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                                onCheckedChange={handleSelectAll}
                            />
                        </TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedUsers.includes(user.id)}
                                        onCheckedChange={() => handleUserSelection(user.id)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <button
                                        className="text-blue-600 hover:underline focus:outline-none"
                                        onClick={() => handleUserClick(user)}
                                    >
                                        {user.username}
                                    </button>
                                </TableCell>
                                <TableCell>{user.fullName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
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
                                </TableCell>
                                <TableCell>{user.lastLogin}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-4">
                                No users found. Try adjusting your search or filter criteria.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between">
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
            </Dialog>

            {/* User Profile Dialog */}
            {selectedUser && (
                <UserProfileDialog user={selectedUser} open={isUserProfileOpen} onOpenChange={setIsUserProfileOpen} />
            )}

            {/* Add User Dialog */}
            <AddUserDialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen} />
        </div>
    )
}
