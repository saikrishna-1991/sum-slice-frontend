"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Trash2, UserPlus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for resources
const mockResources = [
    { id: 1, name: "John Smith", role: "Sales Representative", access: "Full Access" },
    { id: 2, name: "Emily Johnson", role: "Territory Manager", access: "Full Access" },
    { id: 3, name: "Michael Brown", role: "Account Executive", access: "View Only" },
    { id: 4, name: "Sarah Davis", role: "Sales Manager", access: "Edit" },
    { id: 5, name: "David Wilson", role: "Marketing Specialist", access: "View Only" },
    { id: 6, name: "Jennifer Martinez", role: "Customer Service", access: "View Only" },
    { id: 7, name: "Robert Taylor", role: "Regional Director", access: "Full Access" },
    { id: 8, name: "Lisa Anderson", role: "Product Specialist", access: "Edit" },
    { id: 9, name: "James Thomas", role: "Sales Representative", access: "View Only" },
    { id: 10, name: "Patricia Jackson", role: "Account Manager", access: "Edit" },
]

export function TerritoryRoleAccessForm({
    onNext,
    onBack,
    onCancel,
    onFinish,
    initialData,
    updateFormData,
}) {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedResources, setSelectedResources] = useState([])
    const [selectedIds, setSelectedIds] = useState([])
    const [showAddResource, setShowAddResource] = useState(false)
    const [newResource, setNewResource] = useState({
        name: "",
        role: "Sales Representative",
        access: "View Only",
    })

    // Initialize form data only once when component mounts
    useEffect(() => {
        if (initialData && initialData.resources) {
            setSelectedResources(initialData.resources)
        }
    }, []) // Only run once on mount

    const filteredResources = mockResources.filter(
        (resource) =>
            !selectedResources.some((r) => r.id === resource.id) &&
            (resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resource.role.toLowerCase().includes(searchTerm.toLowerCase())),
    )

    const toggleResourceSelection = (resource) => {
        setSelectedResources((prev) => {
            if (prev.some((r) => r.id === resource.id)) {
                return prev.filter((r) => r.id === resource.id)
            } else {
                return [...prev, resource]
            }
        })
    }

    const addResource = (resource) => {
        setSelectedResources((prev) => [...prev, resource])
    }

    const removeResource = (resourceId) => {
        setSelectedResources((prev) => prev.filter((r) => r.id !== resourceId))
    }

    const toggleSelectAll = (checked) => {
        if (checked) {
            setSelectedIds(selectedResources.map((r) => r.id))
        } else {
            setSelectedIds([])
        }
    }

    const toggleSelectResource = (checked, id) => {
        if (checked) {
            setSelectedIds((prev) => [...prev, id])
        } else {
            setSelectedIds((prev) => prev.filter((resourceId) => resourceId !== id))
        }
    }

    const removeSelectedResources = () => {
        setSelectedResources((prev) => prev.filter((r) => !selectedIds.includes(r.id)))
        setSelectedIds([])
    }

    const handleAddNewResource = () => {
        if (newResource.name.trim()) {
            const newId = Math.max(0, ...selectedResources.map((r) => r.id), ...mockResources.map((r) => r.id)) + 1
            const resourceToAdd = {
                id: newId,
                ...newResource,
            }
            addResource(resourceToAdd)
            setNewResource({
                name: "",
                role: "Sales Representative",
                access: "View Only",
            })
            setShowAddResource(false)
        }
    }

    const handleNext = () => {
        // Update parent form data only when advancing to next step
        updateFormData({
            resources: selectedResources,
        })
        onNext()
    }

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Assign Resources</h3>
                <p className="text-sm text-blue-600">
                    Select the resources that will have access to this territory and define their access levels.
                </p>
            </div>

            <div className="space-y-4">
                {selectedResources.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">Assigned Resources ({selectedResources.length})</h4>
                            <div className="flex items-center space-x-2">
                                {selectedIds.length > 0 && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={removeSelectedResources}
                                        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Remove Selected
                                    </Button>
                                )}
                                <Button variant="outline" size="sm" onClick={() => setShowAddResource(true)}>
                                    <UserPlus className="h-4 w-4 mr-1" />
                                    Add Resource
                                </Button>
                            </div>
                        </div>

                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">
                                            <Checkbox
                                                checked={selectedIds.length === selectedResources.length && selectedResources.length > 0}
                                                onCheckedChange={toggleSelectAll}
                                            />
                                        </TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Access Level</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedResources.map((resource) => (
                                        <TableRow key={resource.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedIds.includes(resource.id)}
                                                    onCheckedChange={(checked) => toggleSelectResource(!!checked, resource.id)}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{resource.name}</TableCell>
                                            <TableCell>{resource.role}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        resource.access === "Full Access"
                                                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                                                            : resource.access === "Edit"
                                                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                                                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                                                    }
                                                >
                                                    {resource.access}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeResource(resource.id)}
                                                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}

                {showAddResource ? (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-md">Add New Resource</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-[100px_1fr] gap-y-2 items-center">
                                    <Label htmlFor="resourceName">Name</Label>
                                    <Input
                                        id="resourceName"
                                        value={newResource.name}
                                        onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                                        placeholder="Enter resource name"
                                    />

                                    <Label htmlFor="resourceRole">Role</Label>
                                    <Select
                                        value={newResource.role}
                                        onValueChange={(value) => setNewResource({ ...newResource, role: value })}
                                    >
                                        <SelectTrigger id="resourceRole">
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Sales Representative">Sales Representative</SelectItem>
                                            <SelectItem value="Territory Manager">Territory Manager</SelectItem>
                                            <SelectItem value="Account Executive">Account Executive</SelectItem>
                                            <SelectItem value="Sales Manager">Sales Manager</SelectItem>
                                            <SelectItem value="Marketing Specialist">Marketing Specialist</SelectItem>
                                            <SelectItem value="Regional Director">Regional Director</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Label htmlFor="resourceAccess">Access Level</Label>
                                    <Select
                                        value={newResource.access}
                                        onValueChange={(value) => setNewResource({ ...newResource, access: value })}
                                    >
                                        <SelectTrigger id="resourceAccess">
                                            <SelectValue placeholder="Select access level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="View Only">View Only</SelectItem>
                                            <SelectItem value="Edit">Edit</SelectItem>
                                            <SelectItem value="Full Access">Full Access</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex justify-end space-x-2 pt-2">
                                    <Button variant="outline" size="sm" onClick={() => setShowAddResource(false)}>
                                        Cancel
                                    </Button>
                                    <Button size="sm" onClick={handleAddNewResource}>
                                        Add Resource
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Search className="w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search resources..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="max-w-md"
                            />
                        </div>

                        <div className="border rounded-md p-4">
                            <h4 className="text-sm font-medium mb-3">Available Resources</h4>
                            {filteredResources.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                                    {filteredResources.map((resource) => (
                                        <div
                                            key={resource.id}
                                            className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-50 cursor-pointer"
                                            onClick={() => addResource(resource)}
                                        >
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                                                    {resource.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div className="ml-2">
                                                    <div className="text-sm font-medium">{resource.name}</div>
                                                    <div className="text-xs text-gray-500">{resource.role}</div>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" className="h-8">
                                                <Plus className="h-4 w-4 mr-1" />
                                                Add
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-gray-500">
                                    {searchTerm ? "No matching resources found" : "No available resources"}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
