"use client"

import { useState, useEffect } from "react"
import {
    Plus,
    Filter,
    X,
    Search,
    Check,
    Users,
    Shield,
    Building,
    Calendar,
    Edit,
    Trash,
    AlertTriangle,
    Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function RolesAndPrivilegesPage() {
    const [selectedRole, setSelectedRole] = useState("super-admin")
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState("privileges")

    // Modal states
    const [addRoleOpen, setAddRoleOpen] = useState(false)
    const [editRoleOpen, setEditRoleOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    // Filter states
    const [roleFilterColumn, setRoleFilterColumn] = useState(null)
    const [privilegeFilterColumn, setPrivilegeFilterColumn] = useState(null)
    const [divisionFilterColumn, setDivisionFilterColumn] = useState(null)
    const [filterValue, setFilterValue] = useState("")
    const [filterType, setFilterType] = useState("contains")
    const [roleFilters, setRoleFilters] = useState({})
    const [privilegeFilters, setPrivilegeFilters] = useState({})
    const [divisionFilters, setDivisionFilters] = useState({})

    // New role form state
    const [newRole, setNewRole] = useState({
        id: "",
        name: "",
        orgLevel: "Org Level",
        roleClass: "Internal",
        startDate: "",
        endDate: "",
        isActive: true,
        isDefault: false,
    })

    // Edit role form state
    const [editRole, setEditRole] = useState({
        id: "",
        name: "",
        orgLevel: "",
        roleClass: "",
        startDate: "",
        endDate: "",
        isActive: true,
        isDefault: false,
    })

    const [roles, setRoles] = useState([
        {
            id: "super-admin",
            name: "Super Administrator",
            orgLevel: "Org Level",
            roleClass: "Internal",
            startDate: "01/01/2025",
            endDate: "12/31/2050",
            isActive: true,
            isDefault: true,
        },
        {
            id: "system-admin",
            name: "System Administrator",
            orgLevel: "Org Level",
            roleClass: "Internal",
            startDate: "01/01/2025",
            endDate: "12/31/2050",
            isActive: true,
            isDefault: false,
        },
        {
            id: "functional-admin",
            name: "Functional Administrator",
            orgLevel: "Org Level",
            roleClass: "Internal",
            startDate: "01/01/2025",
            endDate: "12/31/2050",
            isActive: true,
            isDefault: false,
        },
        {
            id: "application-admin",
            name: "Application Administrator",
            orgLevel: "Org Level",
            roleClass: "Internal",
            startDate: "01/01/2025",
            endDate: "12/31/2050",
            isActive: true,
            isDefault: false,
        },
        {
            id: "integration-admin",
            name: "Integration Administrator",
            orgLevel: "Org Level",
            roleClass: "Internal",
            startDate: "01/01/2025",
            endDate: "12/31/2050",
            isActive: true,
            isDefault: false,
        },
        {
            id: "accrual-admin",
            name: "Accrual Administrator",
            orgLevel: "Org Level",
            roleClass: "Internal",
            startDate: "01/01/2025",
            endDate: "12/31/2050",
            isActive: true,
            isDefault: false,
        },
        {
            id: "app-setup-user",
            name: "Application Setup User",
            orgLevel: "Org Level",
            roleClass: "Internal",
            startDate: "01/01/2025",
            endDate: "12/31/2050",
            isActive: true,
            isDefault: false,
        },
        {
            id: "internal-deal-user",
            name: "Internal Deal User",
            orgLevel: "Org Level",
            roleClass: "Internal",
            startDate: "01/01/2025",
            endDate: "12/31/2050",
            isActive: true,
            isDefault: false,
        },
        {
            id: "internal-deal-super-user",
            name: "Internal Deal Super User",
            orgLevel: "Org Level",
            roleClass: "Internal",
            startDate: "01/01/2025",
            endDate: "12/31/2050",
            isActive: true,
            isDefault: false,
        },
        {
            id: "external-deal-user",
            name: "External Deal User",
            orgLevel: "Org Level",
            roleClass: "External",
            startDate: "01/01/2025",
            endDate: "12/31/2050",
            isActive: true,
            isDefault: false,
        },
        {
            id: "external-deal-super-user",
            name: "External Deal Super User",
            orgLevel: "Org Level",
            roleClass: "External",
            startDate: "01/01/2025",
            endDate: "12/31/2050",
            isActive: true,
            isDefault: false,
        },
    ])

    const [privilegesList, setPrivilegesList] = useState([
        { id: "1", name: "Activity Panel", selected: true },
        { id: "2", name: "Admin Report Entitlement", selected: true },
        { id: "3", name: "All Dashboards", selected: true },
        { id: "4", name: "All Integrations", selected: true },
        { id: "5", name: "All Master Data", selected: true },
        { id: "6", name: "All Reports", selected: true },
        { id: "7", name: "All Setup and Define Users", selected: true },
        { id: "8", name: "Dashboard", selected: true },
        { id: "9", name: "Deal Products Item View Entitlement", selected: true },
        { id: "10", name: "Deal Products Margin View Entitlement", selected: true },
        { id: "11", name: "Deal Setup Views Only", selected: true },
        { id: "12", name: "Deal Setup Views with Entitlement", selected: true },
        { id: "13", name: "General Report Entitlement", selected: true },
        { id: "14", name: "Item Summary", selected: true },
        { id: "15", name: "Only Accruals", selected: true },
        { id: "16", name: "Only Rebates", selected: true },
        { id: "17", name: "Only Calendar", selected: true },
        { id: "18", name: "Only Compliance Rebates", selected: true },
        { id: "19", name: "Only Compliance Story Board", selected: true },
        { id: "20", name: "Only Deals", selected: true },
        { id: "21", name: "Only Fund", selected: true },
        { id: "22", name: "Only Payments", selected: true },
        { id: "23", name: "Only Price List", selected: true },
        { id: "24", name: "Only Products", selected: true },
        { id: "25", name: "Only Program", selected: true },
        { id: "26", name: "Only Report Writing", selected: true },
        { id: "27", name: "Only Tracing", selected: true },
        { id: "28", name: "Schedule Payment Entitlement", selected: true },
    ])

    const [divisions, setDivisions] = useState([
        { id: "1", name: "Portland", selected: false },
        { id: "2", name: "Tracy", selected: false },
        { id: "3", name: "Riverside", selected: false },
        { id: "4", name: "Phoenix", selected: false },
        { id: "5", name: "Denver", selected: false },
        { id: "6", name: "Houston", selected: false },
        { id: "7", name: "Shawnee", selected: false },
        { id: "8", name: "Arlington", selected: false },
        { id: "9", name: "Milwaukee", selected: false },
        { id: "10", name: "Memphis", selected: false },
        { id: "11", name: "Plymouth", selected: false },
        { id: "12", name: "Cincinnati", selected: false },
        { id: "13", name: "Burlington", selected: false },
        { id: "14", name: "Albany", selected: false },
        { id: "15", name: "Manassas", selected: false },
        { id: "16", name: "Charlotte", selected: false },
        { id: "17", name: "Atlanta", selected: false },
        { id: "18", name: "Orlando", selected: false },
        { id: "19", name: "Vanta Logistics", selected: false },
        { id: "20", name: "H&M Corporate", selected: false },
        { id: "21", name: "Carrollton", selected: false },
        { id: "22", name: "McLane FoodService Inc.", selected: false },
        { id: "23", name: "San Antonio", selected: false },
    ])

    const [usersList, setUsersList] = useState([
        {
            id: "1",
            name: "Pankaj Chhabra",
            email: "pankaj.chhabra@sumslice.com",
            initials: "PC",
            initialsColor: "bg-cyan-500",
            selected: false,
        },
    ])

    const togglePrivilege = (id) => {
        setPrivilegesList(
            privilegesList.map((privilege) =>
                privilege.id === id ? { ...privilege, selected: !privilege.selected } : privilege,
            ),
        )
    }

    const toggleDivision = (id) => {
        setDivisions(
            divisions.map((division) => (division.id === id ? { ...division, selected: !division.selected } : division)),
        )
    }

    const toggleUser = (id) => {
        setUsersList(usersList.map((user) => (user.id === id ? { ...user, selected: !user.selected } : user)))
    }

    const toggleAllPrivileges = (selected) => {
        setPrivilegesList(privilegesList.map((privilege) => ({ ...privilege, selected })))
    }

    const toggleAllDivisions = (selected) => {
        setDivisions(divisions.map((division) => ({ ...division, selected })))
    }

    const handleAddRole = () => {
        // Generate a unique ID based on the name
        const id = newRole.name.toLowerCase().replace(/\s+/g, "-")

        // Add the new role to the roles array
        const roleToAdd = {
            ...newRole,
            id,
        }

        setRoles([...roles, roleToAdd])

        // Reset the form and close the modal
        setNewRole({
            id: "",
            name: "",
            orgLevel: "Org Level",
            roleClass: "Internal",
            startDate: "",
            endDate: "",
            isActive: true,
            isDefault: false,
        })

        setAddRoleOpen(false)

        // Select the newly added role
        setSelectedRole(id)
    }

    const handleEditRole = () => {
        // Update the role in the roles array
        const updatedRoles = roles.map((role) => (role.id === editRole.id ? editRole : role))

        setRoles(updatedRoles)

        // Update the roleData state if the currently selected role was edited
        if (selectedRole === editRole.id) {
            setRoleData({
                startDate: editRole.startDate,
                endDate: editRole.endDate,
                isActive: editRole.isActive,
                isDefault: editRole.isDefault,
            })
        }

        // Close the modal
        setEditRoleOpen(false)
    }

    const handleDeleteRole = () => {
        // Filter out the role to delete
        const updatedRoles = roles.filter((role) => role.id !== selectedRole)

        setRoles(updatedRoles)

        // Select the first role in the list if available
        if (updatedRoles.length > 0) {
            setSelectedRole(updatedRoles[0].id)
        } else {
            setSelectedRole("")
        }

        // Close the dialog
        setDeleteDialogOpen(false)
    }

    const openEditRoleModal = () => {
        // Find the current role
        const roleToEdit = roles.find((role) => role.id === selectedRole)

        // Set the edit form state
        setEditRole({
            id: roleToEdit.id,
            name: roleToEdit.name,
            orgLevel: roleToEdit.orgLevel,
            roleClass: roleToEdit.roleClass,
            startDate: roleToEdit.startDate,
            endDate: roleToEdit.endDate,
            isActive: roleToEdit.isActive,
            isDefault: roleToEdit.isDefault,
        })

        // Open the modal
        setEditRoleOpen(true)
    }

    const handleRoleAction = (action) => {
        if (action === "add") {
            setAddRoleOpen(true)
        } else if (action === "edit") {
            openEditRoleModal()
        } else if (action === "delete") {
            setDeleteDialogOpen(true)
        } else if (action === "settings") {
            alert("settings action triggered")
        }
    }

    const handlePrivilegeAction = (action) => {
        alert(`${action} privilege action triggered`)
    }

    const handleDivisionAction = (action) => {
        alert(`${action} division action triggered`)
    }

    const currentRole = roles.find((role) => role.id === selectedRole) || roles[0]

    const [roleData, setRoleData] = useState({
        startDate: currentRole?.startDate || "",
        endDate: currentRole?.endDate || "",
        isActive: currentRole?.isActive || false,
        isDefault: currentRole?.isDefault || false,
    })

    useEffect(() => {
        if (
            currentRole &&
            (roleData.startDate !== currentRole.startDate ||
                roleData.endDate !== currentRole.endDate ||
                roleData.isActive !== currentRole.isActive ||
                roleData.isDefault !== currentRole.isDefault)
        ) {
            setRoleData({
                startDate: currentRole.startDate,
                endDate: currentRole.endDate,
                isActive: currentRole.isActive,
                isDefault: currentRole.isDefault,
            })
        }
    }, [currentRole, selectedRole])

    // Filter functions
    const applyRoleFilter = (column, type, value) => {
        setRoleFilters((prev) => ({
            ...prev,
            [column]: { type, value },
        }))
        setRoleFilterColumn(null)
    }

    const applyPrivilegeFilter = (column, type, value) => {
        setPrivilegeFilters((prev) => ({
            ...prev,
            [column]: { type, value },
        }))
        setPrivilegeFilterColumn(null)
    }

    const applyDivisionFilter = (column, type, value) => {
        setDivisionFilters((prev) => ({
            ...prev,
            [column]: { type, value },
        }))
        setDivisionFilterColumn(null)
    }

    const clearRoleFilter = (column) => {
        setRoleFilters((prev) => {
            const newFilters = { ...prev }
            delete newFilters[column]
            return newFilters
        })
    }

    const clearPrivilegeFilter = (column) => {
        setPrivilegeFilters((prev) => {
            const newFilters = { ...prev }
            delete newFilters[column]
            return newFilters
        })
    }

    const clearDivisionFilter = (column) => {
        setDivisionFilters((prev) => {
            const newFilters = { ...prev }
            delete newFilters[column]
            return newFilters
        })
    }

    const clearAllRoleFilters = () => {
        setRoleFilters({})
    }

    // Apply filters to roles list
    const filteredRoles = roles.filter((role) => {
        // Apply search term if any
        if (searchTerm && !role.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false
        }

        // Apply filters
        for (const [column, filter] of Object.entries(roleFilters)) {
            const value = role[column]?.toString().toLowerCase() || ""
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

    // Apply filters to privileges list
    const filteredPrivileges = privilegesList.filter((privilege) => {
        // Apply filters
        for (const [column, filter] of Object.entries(privilegeFilters)) {
            const value = privilege[column]?.toString().toLowerCase() || ""
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

    // Apply filters to divisions list
    const filteredDivisions = divisions.filter((division) => {
        // Apply filters
        for (const [column, filter] of Object.entries(divisionFilters)) {
            const value = division[column]?.toString().toLowerCase() || ""
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

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Left Sidebar - Role List */}
            <div className="w-72 bg-white shadow-md flex flex-col">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50">
                    <h2 className="font-semibold text-lg text-gray-800 flex items-center">
                        <Users className="h-5 w-5 mr-2 text-green-600" />
                        Roles&Privileges
                    </h2>
                    {/* <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-green-600 hover:bg-green-100"
                            onClick={() => handleRoleAction("settings")}
                            title="Settings"
                        >
                            <Settings className="h-4 w-4" />
                        </Button>
                    </div> */}
                </div>

                {/* Search and active filters */}
                <div className="p-4 border-b border-gray-100">
                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            className="pl-9 h-10 text-sm rounded-full bg-gray-50 border-gray-200 focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                            placeholder="Search roles"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <Button
                        className="w-full mb-3 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleRoleAction("add")}
                    >
                        <Plus className="h-4 w-4 mr-2" /> Add New Role
                    </Button>

                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-gray-500">FILTER OPTIONS</span>
                        <Popover open={roleFilterColumn === "name"} onOpenChange={(open) => !open && setRoleFilterColumn(null)}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs text-green-600 hover:bg-green-50"
                                    onClick={() => setRoleFilterColumn("name")}
                                >
                                    <Filter className="h-3 w-3 mr-1" />
                                    Add Filter
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <div className="space-y-4">
                                    <h4 className="font-medium">Filter Roles</h4>
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
                                        <Button variant="outline" onClick={() => setRoleFilterColumn(null)}>
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                applyRoleFilter("name", filterType, filterValue)
                                                setFilterValue("")
                                            }}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            Apply Filter
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {Object.keys(roleFilters).length > 0 && (
                        <div className="flex flex-col gap-1 mb-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Active filters:</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 text-xs py-0 px-1 text-green-600"
                                    onClick={clearAllRoleFilters}
                                >
                                    Clear all
                                </Button>
                            </div>
                            {Object.entries(roleFilters).map(([column, filter]) => (
                                <div key={column} className="flex items-center bg-green-50 rounded-md px-2 py-1 text-xs">
                                    <span className="truncate text-green-700">
                                        {column}: {filter.type} "{filter.value}"
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-4 w-4 p-0 ml-1 text-green-700"
                                        onClick={() => clearRoleFilter(column)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-2">
                        {filteredRoles.length > 0 ? (
                            filteredRoles.map((role) => (
                                <div
                                    key={role.id}
                                    className={`p-3 my-1 rounded-lg transition-all duration-200 ${selectedRole === role.id
                                        ? "bg-green-100 border-l-4 border-green-600"
                                        : "hover:bg-gray-50 border-l-4 border-transparent"
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 cursor-pointer" onClick={() => setSelectedRole(role.id)}>
                                            <div className="font-medium text-gray-800">{role.name}</div>
                                            <div className="flex mt-1 gap-2">
                                                <Badge variant={role.roleClass === "Internal" ? "outline" : "secondary"} className="text-xs">
                                                    {role.roleClass}
                                                </Badge>
                                                {role.isDefault && (
                                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                                        Default
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-1 ml-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-gray-400 hover:text-green-600 hover:bg-green-50"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setSelectedRole(role.id)
                                                    handleRoleAction("edit")
                                                }}
                                                title="Edit Role"
                                            >
                                                <Edit className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setSelectedRole(role.id)
                                                    handleRoleAction("delete")
                                                }}
                                                title="Delete Role"
                                            >
                                                <Trash className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-sm text-gray-500 text-center">No roles match the current filters</div>
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {currentRole ? (
                    <>
                        <div className="bg-white shadow-sm border-b border-gray-200">
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-800">{currentRole.name}</h1>
                                        <div className="flex items-center mt-2 gap-3">
                                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none">
                                                {currentRole.orgLevel}
                                            </Badge>
                                            <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-none">
                                                {currentRole.roleClass}
                                            </Badge>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                {roleData.startDate} - {roleData.endDate}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                id="active"
                                                checked={roleData.isActive}
                                                onCheckedChange={(checked) => {
                                                    setRoleData((prev) => ({ ...prev, isActive: !!checked }))
                                                    // Update the role in the roles array
                                                    const updatedRoles = roles.map((role) =>
                                                        role.id === selectedRole ? { ...role, isActive: !!checked } : role,
                                                    )
                                                    setRoles(updatedRoles)
                                                }}
                                            />
                                            <Label htmlFor="active" className="text-sm font-medium">
                                                Active
                                            </Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                id="default"
                                                checked={roleData.isDefault}
                                                onCheckedChange={(checked) => {
                                                    setRoleData((prev) => ({ ...prev, isDefault: !!checked }))
                                                    // Update the role in the roles array
                                                    const updatedRoles = roles.map((role) =>
                                                        role.id === selectedRole ? { ...role, isDefault: !!checked } : role,
                                                    )
                                                    setRoles(updatedRoles)
                                                }}
                                            />
                                            <Label htmlFor="default" className="text-sm font-medium">
                                                Default
                                            </Label>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                        <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
                                            <TabsTrigger
                                                value="privileges"
                                                className="data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-sm rounded-md"
                                            >
                                                <Shield className="h-4 w-4 mr-2" />
                                                Privileges
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="divisions"
                                                className="data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-sm rounded-md"
                                            >
                                                <Building className="h-4 w-4 mr-2" />
                                                Division Assignments
                                            </TabsTrigger>
                                        </TabsList>

                                        <div className="mt-6 h-[calc(100vh-280px)] overflow-hidden">
                                            <TabsContent value="privileges" className="mt-0 h-full">
                                                <Card className="h-full">
                                                    <CardHeader className="pb-3">
                                                        <div className="flex justify-between items-center">
                                                            <CardTitle className="text-lg font-semibold flex items-center">
                                                                <Shield className="h-5 w-5 mr-2 text-green-600" />
                                                                Privileges
                                                            </CardTitle>
                                                            <div className="flex items-center gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-green-600 border-green-200 hover:bg-green-50"
                                                                    onClick={() => toggleAllPrivileges(true)}
                                                                >
                                                                    <Check className="h-4 w-4 mr-1" /> Select All
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-green-600 border-green-200 hover:bg-green-50"
                                                                    onClick={() => toggleAllPrivileges(false)}
                                                                >
                                                                    Deselect All
                                                                </Button>
                                                                <Popover
                                                                    open={privilegeFilterColumn === "name"}
                                                                    onOpenChange={(open) => !open && setPrivilegeFilterColumn(null)}
                                                                >
                                                                    <PopoverTrigger asChild>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            className="text-green-600 border-green-200 hover:bg-green-50"
                                                                            onClick={() => setPrivilegeFilterColumn("name")}
                                                                        >
                                                                            <Filter
                                                                                className={`h-4 w-4 mr-1 ${privilegeFilters.name ? "text-green-600" : ""}`}
                                                                            />
                                                                            Filter
                                                                        </Button>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className="w-80">
                                                                        <div className="space-y-4">
                                                                            <h4 className="font-medium">Filter Privileges</h4>
                                                                            <RadioGroup
                                                                                defaultValue={filterType}
                                                                                onValueChange={setFilterType}
                                                                                className="grid grid-cols-2 gap-2"
                                                                            >
                                                                                <div className="flex items-center space-x-2">
                                                                                    <RadioGroupItem value="equals" id="equals-privilege" />
                                                                                    <Label htmlFor="equals-privilege">Equals</Label>
                                                                                </div>
                                                                                <div className="flex items-center space-x-2">
                                                                                    <RadioGroupItem value="notEquals" id="notEquals-privilege" />
                                                                                    <Label htmlFor="notEquals-privilege">Does Not Equal</Label>
                                                                                </div>
                                                                                <div className="flex items-center space-x-2">
                                                                                    <RadioGroupItem value="beginsWith" id="beginsWith-privilege" />
                                                                                    <Label htmlFor="beginsWith-privilege">Begins With</Label>
                                                                                </div>
                                                                                <div className="flex items-center space-x-2">
                                                                                    <RadioGroupItem value="endsWith" id="endsWith-privilege" />
                                                                                    <Label htmlFor="endsWith-privilege">Ends With</Label>
                                                                                </div>
                                                                                <div className="flex items-center space-x-2">
                                                                                    <RadioGroupItem value="contains" id="contains-privilege" />
                                                                                    <Label htmlFor="contains-privilege">Contains</Label>
                                                                                </div>
                                                                                <div className="flex items-center space-x-2">
                                                                                    <RadioGroupItem value="notContains" id="notContains-privilege" />
                                                                                    <Label htmlFor="notContains-privilege">Does Not Contain</Label>
                                                                                </div>
                                                                            </RadioGroup>
                                                                            <Input
                                                                                placeholder="Filter value..."
                                                                                value={filterValue}
                                                                                onChange={(e) => setFilterValue(e.target.value)}
                                                                            />
                                                                            <div className="flex justify-between">
                                                                                <Button variant="outline" onClick={() => setPrivilegeFilterColumn(null)}>
                                                                                    Cancel
                                                                                </Button>
                                                                                <Button
                                                                                    onClick={() => {
                                                                                        applyPrivilegeFilter("name", filterType, filterValue)
                                                                                        setFilterValue("")
                                                                                    }}
                                                                                    className="bg-green-600 hover:bg-green-700"
                                                                                >
                                                                                    Apply Filter
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    </PopoverContent>
                                                                </Popover>
                                                            </div>
                                                        </div>

                                                        {/* Active filters display */}
                                                        {Object.keys(privilegeFilters).length > 0 && (
                                                            <div className="flex gap-2 items-center mt-2">
                                                                <span className="text-sm text-gray-500">Filters:</span>
                                                                {Object.entries(privilegeFilters).map(([column, filter]) => (
                                                                    <div
                                                                        key={column}
                                                                        className="flex items-center bg-green-50 rounded-md px-2 py-1 text-xs"
                                                                    >
                                                                        <span className="text-green-700">
                                                                            {column}: {filter.type} "{filter.value}"
                                                                        </span>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-4 w-4 p-0 ml-1 text-green-700"
                                                                            onClick={() => clearPrivilegeFilter(column)}
                                                                        >
                                                                            <X className="h-3 w-3" />
                                                                        </Button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </CardHeader>
                                                    <CardContent className="pt-0">
                                                        <ScrollArea className="h-[calc(100vh-400px)]">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                                                {filteredPrivileges.map((privilege) => (
                                                                    <div
                                                                        key={privilege.id}
                                                                        className={`flex items-center p-3 rounded-lg border ${privilege.selected
                                                                            ? "bg-green-50 border-green-200"
                                                                            : "bg-white border-gray-200 hover:border-green-200"
                                                                            }`}
                                                                    >
                                                                        <Checkbox
                                                                            id={`privilege-${privilege.id}`}
                                                                            checked={privilege.selected}
                                                                            onCheckedChange={() => togglePrivilege(privilege.id)}
                                                                            className="mr-3 data-[state=checked]:bg-green-600 data-[state=checked]:text-white"
                                                                        />
                                                                        <label
                                                                            htmlFor={`privilege-${privilege.id}`}
                                                                            className="text-sm font-medium cursor-pointer flex-1"
                                                                        >
                                                                            {privilege.name}
                                                                        </label>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </ScrollArea>
                                                    </CardContent>
                                                </Card>
                                            </TabsContent>

                                            <TabsContent value="divisions" className="mt-0 h-full">
                                                <Card className="h-full">
                                                    <CardHeader className="pb-3">
                                                        <div className="flex justify-between items-center">
                                                            <CardTitle className="text-lg font-semibold flex items-center">
                                                                <Building className="h-5 w-5 mr-2 text-green-600" />
                                                                Division Assignments
                                                            </CardTitle>
                                                            <div className="flex items-center gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-green-600 border-green-200 hover:bg-green-50"
                                                                    onClick={() => toggleAllDivisions(true)}
                                                                >
                                                                    <Check className="h-4 w-4 mr-1" /> Select All
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-green-600 border-green-200 hover:bg-green-50"
                                                                    onClick={() => toggleAllDivisions(false)}
                                                                >
                                                                    Deselect All
                                                                </Button>
                                                                <Popover
                                                                    open={divisionFilterColumn === "name"}
                                                                    onOpenChange={(open) => !open && setDivisionFilterColumn(null)}
                                                                >
                                                                    <PopoverTrigger asChild>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            className="text-green-600 border-green-200 hover:bg-green-50"
                                                                            onClick={() => setDivisionFilterColumn("name")}
                                                                        >
                                                                            <Filter
                                                                                className={`h-4 w-4 mr-1 ${divisionFilters.name ? "text-green-600" : ""}`}
                                                                            />
                                                                            Filter
                                                                        </Button>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className="w-80">
                                                                        <div className="space-y-4">
                                                                            <h4 className="font-medium">Filter Divisions</h4>
                                                                            <RadioGroup
                                                                                defaultValue={filterType}
                                                                                onValueChange={setFilterType}
                                                                                className="grid grid-cols-2 gap-2"
                                                                            >
                                                                                <div className="flex items-center space-x-2">
                                                                                    <RadioGroupItem value="equals" id="equals-division" />
                                                                                    <Label htmlFor="equals-division">Equals</Label>
                                                                                </div>
                                                                                <div className="flex items-center space-x-2">
                                                                                    <RadioGroupItem value="notEquals" id="notEquals-division" />
                                                                                    <Label htmlFor="notEquals-division">Does Not Equal</Label>
                                                                                </div>
                                                                                <div className="flex items-center space-x-2">
                                                                                    <RadioGroupItem value="beginsWith" id="beginsWith-division" />
                                                                                    <Label htmlFor="beginsWith-division">Begins With</Label>
                                                                                </div>
                                                                                <div className="flex items-center space-x-2">
                                                                                    <RadioGroupItem value="endsWith" id="endsWith-division" />
                                                                                    <Label htmlFor="endsWith-division">Ends With</Label>
                                                                                </div>
                                                                                <div className="flex items-center space-x-2">
                                                                                    <RadioGroupItem value="contains" id="contains-division" />
                                                                                    <Label htmlFor="contains-division">Contains</Label>
                                                                                </div>
                                                                                <div className="flex items-center space-x-2">
                                                                                    <RadioGroupItem value="notContains" id="notContains-division" />
                                                                                    <Label htmlFor="notContains-division">Does Not Contain</Label>
                                                                                </div>
                                                                            </RadioGroup>
                                                                            <Input
                                                                                placeholder="Filter value..."
                                                                                value={filterValue}
                                                                                onChange={(e) => setFilterValue(e.target.value)}
                                                                            />
                                                                            <div className="flex justify-between">
                                                                                <Button variant="outline" onClick={() => setDivisionFilterColumn(null)}>
                                                                                    Cancel
                                                                                </Button>
                                                                                <Button
                                                                                    onClick={() => {
                                                                                        applyDivisionFilter("name", filterType, filterValue)
                                                                                        setFilterValue("")
                                                                                    }}
                                                                                    className="bg-green-600 hover:bg-green-700"
                                                                                >
                                                                                    Apply Filter
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    </PopoverContent>
                                                                </Popover>
                                                            </div>
                                                        </div>

                                                        {/* Active filters display */}
                                                        {Object.keys(divisionFilters).length > 0 && (
                                                            <div className="flex gap-2 items-center mt-2">
                                                                <span className="text-sm text-gray-500">Filters:</span>
                                                                {Object.entries(divisionFilters).map(([column, filter]) => (
                                                                    <div
                                                                        key={column}
                                                                        className="flex items-center bg-green-50 rounded-md px-2 py-1 text-xs"
                                                                    >
                                                                        <span className="text-green-700">
                                                                            {column}: {filter.type} "{filter.value}"
                                                                        </span>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-4 w-4 p-0 ml-1 text-green-700"
                                                                            onClick={() => clearDivisionFilter(column)}
                                                                        >
                                                                            <X className="h-3 w-3" />
                                                                        </Button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </CardHeader>
                                                    <CardContent className="pt-0">
                                                        <ScrollArea className="h-[calc(100vh-400px)]">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                                                {filteredDivisions.map((division) => (
                                                                    <div
                                                                        key={division.id}
                                                                        className={`flex items-center p-3 rounded-lg border ${division.selected
                                                                            ? "bg-green-50 border-green-200"
                                                                            : "bg-white border-gray-200 hover:border-green-200"
                                                                            }`}
                                                                    >
                                                                        <Checkbox
                                                                            id={`division-${division.id}`}
                                                                            checked={division.selected}
                                                                            onCheckedChange={() => toggleDivision(division.id)}
                                                                            className="mr-3 data-[state=checked]:bg-green-600 data-[state=checked]:text-white"
                                                                        />
                                                                        <label
                                                                            htmlFor={`division-${division.id}`}
                                                                            className="text-sm font-medium cursor-pointer flex-1"
                                                                        >
                                                                            {division.name}
                                                                        </label>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </ScrollArea>
                                                    </CardContent>
                                                </Card>
                                            </TabsContent>
                                        </div>
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center p-8">
                            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-700">No Role Selected</h3>
                            <p className="text-gray-500 mt-2">Please select a role from the sidebar or create a new one.</p>
                            <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={() => setAddRoleOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" /> Add New Role
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Role Dialog */}
            <Dialog open={addRoleOpen} onOpenChange={setAddRoleOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Add New Role</DialogTitle>
                        <DialogDescription>Create a new role with specific privileges and division assignments.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Role Name
                            </Label>
                            <Input
                                id="name"
                                value={newRole.name}
                                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                                className="col-span-3"
                                placeholder="e.g. Marketing Manager"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="orgLevel" className="text-right">
                                Org Level
                            </Label>
                            <Select value={newRole.orgLevel} onValueChange={(value) => setNewRole({ ...newRole, orgLevel: value })}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select org level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Org Level">Org Level</SelectItem>
                                    <SelectItem value="Division Level">Division Level</SelectItem>
                                    <SelectItem value="Department Level">Department Level</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="roleClass" className="text-right">
                                Role Class
                            </Label>
                            <Select value={newRole.roleClass} onValueChange={(value) => setNewRole({ ...newRole, roleClass: value })}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select role class" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Internal">Internal</SelectItem>
                                    <SelectItem value="External">External</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="startDate" className="text-right">
                                Start Date
                            </Label>
                            <Input
                                id="startDate"
                                type="text"
                                value={newRole.startDate}
                                onChange={(e) => setNewRole({ ...newRole, startDate: e.target.value })}
                                className="col-span-3"
                                placeholder="MM/DD/YYYY"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="endDate" className="text-right">
                                End Date
                            </Label>
                            <Input
                                id="endDate"
                                type="text"
                                value={newRole.endDate}
                                onChange={(e) => setNewRole({ ...newRole, endDate: e.target.value })}
                                className="col-span-3"
                                placeholder="MM/DD/YYYY"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <div className="text-right">Status</div>
                            <div className="col-span-3 flex gap-4">
                                <div className="flex items-center gap-2">
                                    <Switch
                                        id="newRoleActive"
                                        checked={newRole.isActive}
                                        onCheckedChange={(checked) => setNewRole({ ...newRole, isActive: checked })}
                                    />
                                    <Label htmlFor="newRoleActive">Active</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Switch
                                        id="newRoleDefault"
                                        checked={newRole.isDefault}
                                        onCheckedChange={(checked) => setNewRole({ ...newRole, isDefault: checked })}
                                    />
                                    <Label htmlFor="newRoleDefault">Default</Label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAddRoleOpen(false)}>
                            Cancel
                        </Button>
                        <Button className="bg-green-600 hover:bg-green-700" onClick={handleAddRole} disabled={!newRole.name}>
                            Add Role
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Role Dialog */}
            <Dialog open={editRoleOpen} onOpenChange={setEditRoleOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Role</DialogTitle>
                        <DialogDescription>Update the role details, privileges, and division assignments.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editName" className="text-right">
                                Role Name
                            </Label>
                            <Input
                                id="editName"
                                value={editRole.name}
                                onChange={(e) => setEditRole({ ...editRole, name: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editOrgLevel" className="text-right">
                                Org Level
                            </Label>
                            <Select
                                value={editRole.orgLevel}
                                onValueChange={(value) => setEditRole({ ...editRole, orgLevel: value })}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select org level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Org Level">Org Level</SelectItem>
                                    <SelectItem value="Division Level">Division Level</SelectItem>
                                    <SelectItem value="Department Level">Department Level</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editRoleClass" className="text-right">
                                Role Class
                            </Label>
                            <Select
                                value={editRole.roleClass}
                                onValueChange={(value) => setEditRole({ ...editRole, roleClass: value })}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select role class" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Internal">Internal</SelectItem>
                                    <SelectItem value="External">External</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editStartDate" className="text-right">
                                Start Date
                            </Label>
                            <Input
                                id="editStartDate"
                                type="text"
                                value={editRole.startDate}
                                onChange={(e) => setEditRole({ ...editRole, startDate: e.target.value })}
                                className="col-span-3"
                                placeholder="MM/DD/YYYY"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editEndDate" className="text-right">
                                End Date
                            </Label>
                            <Input
                                id="editEndDate"
                                type="text"
                                value={editRole.endDate}
                                onChange={(e) => setEditRole({ ...editRole, endDate: e.target.value })}
                                className="col-span-3"
                                placeholder="MM/DD/YYYY"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <div className="text-right">Status</div>
                            <div className="col-span-3 flex gap-4">
                                <div className="flex items-center gap-2">
                                    <Switch
                                        id="editRoleActive"
                                        checked={editRole.isActive}
                                        onCheckedChange={(checked) => setEditRole({ ...editRole, isActive: checked })}
                                    />
                                    <Label htmlFor="editRoleActive">Active</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Switch
                                        id="editRoleDefault"
                                        checked={editRole.isDefault}
                                        onCheckedChange={(checked) => setEditRole({ ...editRole, isDefault: checked })}
                                    />
                                    <Label htmlFor="editRoleDefault">Default</Label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditRoleOpen(false)}>
                            Cancel
                        </Button>
                        <Button className="bg-green-600 hover:bg-green-700" onClick={handleEditRole} disabled={!editRole.name}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Role Confirmation */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            Delete Role
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the role "{currentRole?.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteRole}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
