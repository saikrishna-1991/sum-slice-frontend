"use client"

import { useState, useEffect } from "react"
import { Plus, Upload, Download, Trash2, Filter, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RolesAndPrivilegesPage() {
    const [selectedRole, setSelectedRole] = useState("super-admin")
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState("privileges")

    const roles = [
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
    ]

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
                privilege.id === id ? { ...privilege, selected: !privilege.selected } : privilege
            )
        )
    }

    const toggleDivision = (id) => {
        setDivisions(
            divisions.map((division) =>
                division.id === id ? { ...division, selected: !division.selected } : division
            )
        )
    }

    const toggleUser = (id) => {
        setUsersList(
            usersList.map((user) =>
                user.id === id ? { ...user, selected: !user.selected } : user
            )
        )
    }

    const toggleAllPrivileges = (selected) => {
        setPrivilegesList(privilegesList.map((privilege) => ({ ...privilege, selected })))
    }

    const toggleAllDivisions = (selected) => {
        setDivisions(divisions.map((division) => ({ ...division, selected })))
    }

    const handleRoleAction = (action) => {
        alert(`${action} role action triggered`)
    }

    const handlePrivilegeAction = (action) => {
        alert(`${action} privilege action triggered`)
    }

    const handleDivisionAction = (action) => {
        alert(`${action} division action triggered`)
    }

    const currentRole = roles.find((role) => role.id === selectedRole) || roles[0]

    const [roleData, setRoleData] = useState({
        startDate: currentRole.startDate || "",
        endDate: currentRole.endDate || "",
        isActive: currentRole.isActive || false,
        isDefault: currentRole.isDefault || false,
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

    return (
        <div className="flex">
            {/* Left Sidebar - Role List */}
            <div className="w-64 border-r border-r-gray-200 flex flex-col">
                <div className="p-2 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleRoleAction("add")}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleRoleAction("import")}
                        >
                            <Upload className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleRoleAction("export")}
                        >
                            <Download className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleRoleAction("delete")}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-7 w-7">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-2">
                        {roles.map((role) => (
                            <div
                                key={role.id}
                                className={`p-2 cursor-pointer ${selectedRole === role.id ? "bg-gray-100 font-medium" : ""
                                    }`}
                                onClick={() => setSelectedRole(role.id)}
                            >
                                {role.name}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-xl font-semibold">{currentRole.name}</h1>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <h3 className="text-sm font-medium mb-2">Data Access</h3>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="bg-gray-100 border-gray-300"
                                >
                                    {currentRole.orgLevel}
                                </Button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium mb-2">Role Class</h3>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="bg-gray-100 border-gray-300"
                                >
                                    {currentRole.roleClass}
                                </Button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium mb-2">Start Date</h3>
                            <Input
                                value={roleData.startDate}
                                onChange={(e) =>
                                    setRoleData((prev) => ({
                                        ...prev,
                                        startDate: e.target.value,
                                    }))
                                }
                                className="bg-gray-100"
                            />
                        </div>

                        <div>
                            <h3 className="text-sm font-medium mb-2">End Date</h3>
                            <Input
                                value={roleData.endDate}
                                onChange={(e) =>
                                    setRoleData((prev) => ({
                                        ...prev,
                                        endDate: e.target.value,
                                    }))
                                }
                                className="bg-gray-100"
                            />
                        </div>
                    </div>

                    <div className="flex gap-6 mt-4">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="active"
                                checked={roleData.isActive}
                                onCheckedChange={(checked) =>
                                    setRoleData((prev) => ({ ...prev, isActive: !!checked }))
                                }
                            />
                            <label htmlFor="active" className="text-sm">
                                Active
                            </label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="default"
                                checked={roleData.isDefault}
                                onCheckedChange={(checked) =>
                                    setRoleData((prev) => ({ ...prev, isDefault: !!checked }))
                                }
                            />
                            <label htmlFor="default" className="text-sm">
                                Default
                            </label>
                        </div>
                    </div>
                </div>

                {/* Tabs for Privileges and Division Assignments */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
                    <TabsList className="px-4 pt-2">
                        <TabsTrigger value="privileges">Privileges</TabsTrigger>
                        <TabsTrigger value="divisions">Division Assignments</TabsTrigger>
                    </TabsList>

                    {/* Privileges Tab Content */}
                    <TabsContent value="privileges" className="flex-1 flex">
                        <div className="flex-1 p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePrivilegeAction("add")}
                                >
                                    <Plus className="h-4 w-4 mr-1" /> Add
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePrivilegeAction("import")}
                                >
                                    Import
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePrivilegeAction("export")}
                                >
                                    Export
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePrivilegeAction("delete")}
                                >
                                    Bulk Delete
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePrivilegeAction("filter")}
                                >
                                    Filter
                                </Button>
                            </div>

                            <ScrollArea className="h-[calc(100vh-300px)] border rounded">
                                <div className="p-2">
                                    {privilegesList.map((privilege) => (
                                        <div
                                            key={privilege.id}
                                            className="flex items-center p-2 border-b border-gray-100"
                                        >
                                            <Checkbox
                                                id={`privilege-${privilege.id}`}
                                                checked={privilege.selected}
                                                onCheckedChange={() => togglePrivilege(privilege.id)}
                                                className="mr-2"
                                            />
                                            <label
                                                htmlFor={`privilege-${privilege.id}`}
                                                className="text-sm"
                                            >
                                                {privilege.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </TabsContent>

                    {/* Division Assignments Tab Content */}
                    <TabsContent value="divisions" className="flex-1 flex">
                        <div className="flex-1 p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDivisionAction("add")}
                                >
                                    <Plus className="h-4 w-4 mr-1" /> Add
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDivisionAction("import")}
                                >
                                    Import
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDivisionAction("export")}
                                >
                                    Export
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDivisionAction("delete")}
                                >
                                    Bulk Delete
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDivisionAction("filter")}
                                >
                                    Filter
                                </Button>
                            </div>

                            <ScrollArea className="h-[calc(100vh-300px)] border rounded">
                                <div className="p-2">
                                    {divisions.map((division) => (
                                        <div
                                            key={division.id}
                                            className="flex items-center p-2 border-b border-gray-100"
                                        >
                                            <Checkbox
                                                id={`division-${division.id}`}
                                                checked={division.selected}
                                                onCheckedChange={() => toggleDivision(division.id)}
                                                className="mr-2"
                                            />
                                            <label
                                                htmlFor={`division-${division.id}`}
                                                className="text-sm"
                                            >
                                                {division.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}