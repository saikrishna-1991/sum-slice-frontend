"use client"
import { useState } from "react"
import { Shield, Search, Plus, Download, Upload, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"



export default function PrivilegesPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")

    const categories = [
        { id: "all", name: "All Categories" },
        { id: "admin", name: "Administration" },
        { id: "rebate", name: "Rebate Management" },
        { id: "accrual", name: "Accrual Management" },
        { id: "payment", name: "Payment Management" },
        { id: "reporting", name: "Reporting" },
    ]

    const [privileges, setPrivileges] = useState([
        { id: "1", name: "Activity Panel", description: "Access to activity panel", category: "admin", selected: false },
        {
            id: "2",
            name: "Admin Report Entitlement",
            description: "Access to admin reports",
            category: "admin",
            selected: false,
        },
        { id: "3", name: "All Dashboards", description: "Access to all dashboards", category: "admin", selected: false },
        {
            id: "4",
            name: "All Integrations",
            description: "Access to all integrations",
            category: "admin",
            selected: false,
        },
        { id: "5", name: "All Master Data", description: "Access to all master data", category: "admin", selected: false },
        { id: "6", name: "All Reports", description: "Access to all reports", category: "reporting", selected: false },
        {
            id: "7",
            name: "All Setup and Define Users",
            description: "Ability to setup and define users",
            category: "admin",
            selected: false,
        },
        { id: "8", name: "Dashboard", description: "Access to dashboard", category: "admin", selected: false },
        {
            id: "9",
            name: "Deal Products Item View",
            description: "View deal products items",
            category: "rebate",
            selected: false,
        },
        {
            id: "10",
            name: "Deal Products Margin View",
            description: "View deal products margins",
            category: "rebate",
            selected: false,
        },
        { id: "11", name: "Deal Setup Views Only", description: "View deal setups", category: "rebate", selected: false },
        {
            id: "12",
            name: "Deal Setup with Entitlement",
            description: "Edit deal setups",
            category: "rebate",
            selected: false,
        },
        {
            id: "13",
            name: "General Report Entitlement",
            description: "Access to general reports",
            category: "reporting",
            selected: false,
        },
        { id: "14", name: "Item Summary", description: "View item summaries", category: "rebate", selected: false },
        { id: "15", name: "Only Accruals", description: "Access to accruals only", category: "accrual", selected: false },
    ])

    const togglePrivilege = (id) => {
        setPrivileges(
            privileges.map((privilege) =>
                privilege.id === id ? { ...privilege, selected: !privilege.selected } : privilege,
            ),
        )
    }

    const toggleAllPrivileges = (selected) => {
        setPrivileges(privileges.map((privilege) => ({ ...privilege, selected })))
    }

    const filteredPrivileges = privileges.filter(
        (privilege) =>
            (selectedCategory === "all" || privilege.category === selectedCategory) &&
            (privilege.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                privilege.description.toLowerCase().includes(searchTerm.toLowerCase())),
    )

    const handleAddPrivilege = () => {
        const name = prompt("Enter privilege name:")
        if (!name) return

        const description = prompt("Enter privilege description:")
        if (!description) return

        const category = prompt("Enter category (admin, rebate, accrual, payment, reporting):")
        if (!category) return

        const newPrivilege = {
            id: (privileges.length + 1).toString(),
            name,
            description,
            category,
            selected: false,
        }

        setPrivileges([...privileges, newPrivilege])
        alert(`New privilege "${name}" added successfully!`)
    }

    const handleDeletePrivileges = () => {
        const selectedPrivileges = privileges.filter((p) => p.selected)
        if (selectedPrivileges.length === 0) {
            alert("Please select at least one privilege to delete")
            return
        }

        if (confirm(`Are you sure you want to delete ${selectedPrivileges.length} selected privileges?`)) {
            setPrivileges(privileges.filter((p) => !p.selected))
            alert(`${selectedPrivileges.length} privileges deleted successfully!`)
        }
    }

    const handleImportPrivileges = () => {
        alert("Import functionality would open a file dialog")
    }

    const handleExportPrivileges = () => {
        const selectedPrivileges = privileges.filter((p) => p.selected)
        if (selectedPrivileges.length === 0) {
            alert("Please select at least one privilege to export")
            return
        }

        alert(`${selectedPrivileges.length} privileges would be exported`)
    }

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Shield className="h-8 w-8 text-green-600" />
                    <h1 className="text-2xl font-bold">Privileges Management</h1>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            className="pl-8 w-64"
                            placeholder="Search privileges"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-6">
                {/* Categories */}
                <div className="w-64">
                    <Card className="p-4">
                        <h3 className="font-medium mb-4">Categories</h3>
                        <div className="space-y-2">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className={`p-2 rounded cursor-pointer ${selectedCategory === category.id ? "bg-green-100 text-green-700" : "hover:bg-gray-100"}`}
                                    onClick={() => setSelectedCategory(category.id)}
                                >
                                    {category.name}
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Privileges List */}
                <div className="flex-1">
                    <Card className="p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium">Privileges</h3>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleAddPrivilege}>
                                    <Plus className="h-4 w-4" />
                                    Add
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1"
                                    onClick={handleImportPrivileges}
                                >
                                    <Upload className="h-4 w-4" />
                                    Import
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1"
                                    onClick={handleExportPrivileges}
                                >
                                    <Download className="h-4 w-4" />
                                    Export
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1"
                                    onClick={handleDeletePrivileges}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </Button>
                            </div>
                        </div>

                        <div className="border rounded">
                            <div className="bg-gray-50 p-2 border-b flex items-center">
                                <Checkbox
                                    id="select-all"
                                    checked={filteredPrivileges.length > 0 && filteredPrivileges.every((p) => p.selected)}
                                    onCheckedChange={(checked) => toggleAllPrivileges(!!checked)}
                                    className="mr-2"
                                />
                                <label htmlFor="select-all" className="text-sm font-medium">
                                    Select All
                                </label>
                            </div>

                            <ScrollArea className="h-[calc(100vh-300px)]">
                                <div className="divide-y">
                                    {filteredPrivileges.map((privilege) => (
                                        <div key={privilege.id} className="p-3 flex items-start hover:bg-gray-50">
                                            <Checkbox
                                                id={`priv-${privilege.id}`}
                                                checked={privilege.selected}
                                                onCheckedChange={() => togglePrivilege(privilege.id)}
                                                className="mr-3 mt-1"
                                            />
                                            <div>
                                                <label htmlFor={`priv-${privilege.id}`} className="font-medium block">
                                                    {privilege.name}
                                                </label>
                                                <p className="text-sm text-gray-500">{privilege.description}</p>
                                                <div className="mt-1">
                                                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                                                        {categories.find((c) => c.id === privilege.category)?.name || privilege.category}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
