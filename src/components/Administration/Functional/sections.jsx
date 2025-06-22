"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, Filter, ChevronRight, ChevronDown, Plus, Save, Edit } from "lucide-react"

// Sample data for sections
const sectionsData = [
    {
        id: 1,
        name: "Bid Header",
        isHeader: true,
        dataSource: "Efer Bid Headers",
        description: "Bid Header Section",
        selected: false,
    },
    {
        id: 2,
        name: "Bid Products",
        isHeader: false,
        dataSource: "Efer Bid Products",
        description: "Bid Products Section",
        selected: false,
    },
    {
        id: 3,
        name: "Billback Header",
        isHeader: true,
        dataSource: "Efer Billback Headers",
        description: "Billback Header Section",
        selected: false,
    },
    {
        id: 4,
        name: "Billback Items",
        isHeader: false,
        dataSource: "Efer Billback Items",
        description: "Billback Items Section",
        selected: false,
    },
    {
        id: 5,
        name: "Claim Header",
        isHeader: true,
        dataSource: "Efer Claim Headers",
        description: "Claim Header Section",
        selected: false,
    },
    {
        id: 6,
        name: "Claim Products",
        isHeader: false,
        dataSource: "Efer Claim Products",
        description: "Claim Products Section",
        selected: false,
    },
    {
        id: 7,
        name: "Claim Source",
        isHeader: false,
        dataSource: "Efer Claim Source Info",
        description: "Claim Source Section",
        selected: false,
    },
    {
        id: 8,
        name: "Deal Allowances",
        isHeader: false,
        dataSource: "Efer Deal Allowances",
        description: "Deal Allowances Section",
        selected: false,
    },
    {
        id: 9,
        name: "Deal Customers",
        isHeader: false,
        dataSource: "Efer Deal Customers",
        description: "Deal Customers Section",
        selected: false,
    },
    {
        id: 10,
        name: "Deal Header",
        isHeader: true,
        dataSource: "Efer Deal Headers",
        description: "Deal Header Section",
        selected: false,
    },
    {
        id: 11,
        name: "Deal Lumpsum",
        isHeader: false,
        dataSource: "Efer Deal Lumpsum",
        description: "Deal Lumpsum Section",
        selected: false,
    },
    {
        id: 12,
        name: "Deal Products",
        isHeader: false,
        dataSource: "Efer Deal Products",
        description: "Deal Products Section",
        selected: false,
    },
    {
        id: 13,
        name: "Deal Type",
        isHeader: false,
        dataSource: "Efer Deal Types",
        description: "Deal Type",
        selected: false,
    },
    {
        id: 14,
        name: "Fund Allocations",
        isHeader: false,
        dataSource: "Efer Fund Allocations",
        description: "Fund Allocations Section",
        selected: false,
    },
    {
        id: 15,
        name: "Fund Header",
        isHeader: true,
        dataSource: "Efer Fund Headers",
        description: "Fund Header Section",
        selected: false,
    },
    {
        id: 16,
        name: "Payment Header",
        isHeader: true,
        dataSource: "Efer Payment Headers",
        description: "Payment Header Section",
        selected: false,
    },
    {
        id: 17,
        name: "Payment Products",
        isHeader: false,
        dataSource: "Efer Payment Products",
        description: "Payment Items Section",
        selected: false,
    },
    {
        id: 18,
        name: "Payment Rebates",
        isHeader: false,
        dataSource: "Efer Payment Rebates",
        description: "Payment Rebate Section",
        selected: false,
    },
    {
        id: 19,
        name: "Pricelist Header",
        isHeader: true,
        dataSource: "Efer Pricelist Headers",
        description: "Pricelist Header Section",
        selected: false,
    },
    {
        id: 20,
        name: "Pricelist Products",
        isHeader: false,
        dataSource: "Efer Pricelist Products",
        description: "Pricelist Products Section",
        selected: false,
    },
    {
        id: 21,
        name: "Products",
        isHeader: false,
        dataSource: "Efer Billback Headers Extn",
        description: "Products",
        selected: false,
    },
    {
        id: 22,
        name: "Vendor Claims",
        isHeader: false,
        dataSource: "Efer Billback Items Extn",
        description: "Vendor Claims",
        selected: false,
    },
]

export default function SectionsPage() {
    const [currentView, setCurrentView] = useState("list")
    const [selectedSection, setSelectedSection] = useState(null)
    const [sections, setSections] = useState(sectionsData)
    const [showFilters, setShowFilters] = useState(false)
    const [editingSection, setEditingSection] = useState(null)

    // Section detail state
    const [attributesOpen, setAttributesOpen] = useState(true)
    const [massUpdateOpen, setMassUpdateOpen] = useState(true)
    const [sectionViewsOpen, setSectionViewsOpen] = useState(true)
    const [customActionsOpen, setCustomActionsOpen] = useState(true)

    const handleSectionClick = (section) => {
        setSelectedSection(section)
        setEditingSection({
            ...section,
            headerFlag: section.isHeader,
            attributes: [
                { id: 1, name: "Create Function", value: "" },
                { id: 2, name: "Edit Function", value: "" },
            ],
            massUpdate: {
                name: "Deal Summary",
            },
            sectionViews: [
                {
                    id: 1,
                    name: "Default",
                    defaultFlag: true,
                    accessConfig: true,
                    seeded: true,
                    enabled: true,
                },
            ],
            customActions: [],
        })
        setCurrentView("detail")
    }

    const handleBackToList = () => {
        setCurrentView("list")
        setSelectedSection(null)
        setEditingSection(null)
    }

    const handleSave = () => {
        console.log("Saving section:", editingSection)
        // Update the section in the list
        setSections(
            sections.map((s) =>
                s.id === editingSection.id ? { ...editingSection, isHeader: editingSection.headerFlag } : s,
            ),
        )
        handleBackToList()
    }

    const handleCancel = () => {
        handleBackToList()
    }

    const handleExport = () => {
        console.log("Exporting sections...")
    }

    const handleSelectSection = (id, checked) => {
        setSections(sections.map((section) => (section.id === id ? { ...section, selected: checked } : section)))
    }

    const handleSelectAll = (checked) => {
        setSections(sections.map((section) => ({ ...section, selected: checked })))
    }

    const addCustomAction = () => {
        const newAction = {
            id: Math.max(...(editingSection.customActions?.map((a) => a.id) || [0])) + 1,
            name: "",
            service: "",
            visibilityConfig: "",
            responseAction: "",
            enabled: false,
        }
        setEditingSection({
            ...editingSection,
            customActions: [...(editingSection.customActions || []), newAction],
        })
    }

    if (currentView === "detail" && editingSection) {
        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-800" onClick={handleBackToList}>
                            Sections
                        </button>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{selectedSection?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="flex items-center gap-1">
                                    <Save className="h-4 w-4" />
                                    Save
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={handleSave}>Save</DropdownMenuItem>
                                <DropdownMenuItem onClick={handleSave}>Save and Close</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </div>
                </div>

                {/* Section Details Form */}
                <Card>
                    <CardContent className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="section-name">Name</Label>
                                <Input
                                    id="section-name"
                                    value={editingSection.name}
                                    onChange={(e) => setEditingSection({ ...editingSection, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="data-source">Data Source</Label>
                                <Input
                                    id="data-source"
                                    value={editingSection.dataSource}
                                    onChange={(e) => setEditingSection({ ...editingSection, dataSource: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center space-x-2 pt-6">
                                <Checkbox
                                    id="header-flag"
                                    checked={editingSection.headerFlag}
                                    onCheckedChange={(checked) => setEditingSection({ ...editingSection, headerFlag: checked })}
                                />
                                <Label htmlFor="header-flag">Header Flag</Label>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={editingSection.description}
                                onChange={(e) => setEditingSection({ ...editingSection, description: e.target.value })}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Attributes / Mandatory Setting */}
                <Card>
                    <Collapsible open={attributesOpen} onOpenChange={setAttributesOpen}>
                        <CollapsibleTrigger className="w-full">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="flex items-center gap-2">
                                    {attributesOpen ? (
                                        <ChevronDown className="h-4 w-4 text-blue-600" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4 text-blue-600" />
                                    )}
                                    <CardTitle className="text-base font-medium text-blue-600">Attributes / Mandatory Setting</CardTitle>
                                </div>
                                <Button variant="outline" size="sm">
                                    <Download className="h-4 w-4 mr-1" />
                                    Export
                                </Button>
                            </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>Name</Label>
                                        <div className="text-sm text-gray-600">Create Function</div>
                                        <div className="text-sm text-gray-600">Edit Function</div>
                                    </div>
                                </div>
                            </CardContent>
                        </CollapsibleContent>
                    </Collapsible>
                </Card>

                {/* Mass Update */}
                <Card>
                    <Collapsible open={massUpdateOpen} onOpenChange={setMassUpdateOpen}>
                        <CollapsibleTrigger className="w-full">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="flex items-center gap-2">
                                    {massUpdateOpen ? (
                                        <ChevronDown className="h-4 w-4 text-blue-600" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4 text-blue-600" />
                                    )}
                                    <CardTitle className="text-base font-medium text-blue-600">Mass Update</CardTitle>
                                </div>
                                <Button variant="outline" size="sm">
                                    <Download className="h-4 w-4 mr-1" />
                                    Export
                                </Button>
                            </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Name</Label>
                                    <div className="text-sm text-gray-600">Deal Summary</div>
                                </div>
                            </CardContent>
                        </CollapsibleContent>
                    </Collapsible>
                </Card>

                {/* Section Views */}
                <Card>
                    <Collapsible open={sectionViewsOpen} onOpenChange={setSectionViewsOpen}>
                        <CollapsibleTrigger className="w-full">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="flex items-center gap-2">
                                    {sectionViewsOpen ? (
                                        <ChevronDown className="h-4 w-4 text-blue-600" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4 text-blue-600" />
                                    )}
                                    <CardTitle className="text-base font-medium text-blue-600">Section Views</CardTitle>
                                </div>
                                <Button variant="outline" size="sm">
                                    <Download className="h-4 w-4 mr-1" />
                                    Export
                                </Button>
                            </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12"></TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Default Flag</TableHead>
                                            <TableHead>Access Config</TableHead>
                                            <TableHead>Seeded</TableHead>
                                            <TableHead>Enabled</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {editingSection.sectionViews?.map((view) => (
                                            <TableRow key={view.id}>
                                                <TableCell>
                                                    <Checkbox />
                                                </TableCell>
                                                <TableCell>{view.name}</TableCell>
                                                <TableCell>
                                                    <Checkbox checked={view.defaultFlag} />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Plus className="h-4 w-4 text-green-600" />
                                                        <Edit className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Checkbox checked={view.seeded} />
                                                </TableCell>
                                                <TableCell>
                                                    <Checkbox checked={view.enabled} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </CollapsibleContent>
                    </Collapsible>
                </Card>

                {/* Custom Actions */}
                <Card>
                    <Collapsible open={customActionsOpen} onOpenChange={setCustomActionsOpen}>
                        <CollapsibleTrigger className="w-full">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div className="flex items-center gap-2">
                                    {customActionsOpen ? (
                                        <ChevronDown className="h-4 w-4 text-blue-600" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4 text-blue-600" />
                                    )}
                                    <CardTitle className="text-base font-medium text-blue-600">Custom Actions</CardTitle>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button size="sm" onClick={addCustomAction}>
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Download className="h-4 w-4 mr-1" />
                                        Export
                                    </Button>
                                </div>
                            </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12"></TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Service</TableHead>
                                            <TableHead>Visibility Config</TableHead>
                                            <TableHead>Response Action</TableHead>
                                            <TableHead>Enabled</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {editingSection.customActions?.length > 0 ? (
                                            editingSection.customActions.map((action) => (
                                                <TableRow key={action.id}>
                                                    <TableCell>
                                                        <Checkbox />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            value={action.name}
                                                            onChange={(e) => {
                                                                const updated = editingSection.customActions.map((a) =>
                                                                    a.id === action.id ? { ...a, name: e.target.value } : a,
                                                                )
                                                                setEditingSection({ ...editingSection, customActions: updated })
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            value={action.service}
                                                            onChange={(e) => {
                                                                const updated = editingSection.customActions.map((a) =>
                                                                    a.id === action.id ? { ...a, service: e.target.value } : a,
                                                                )
                                                                setEditingSection({ ...editingSection, customActions: updated })
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            value={action.visibilityConfig}
                                                            onChange={(e) => {
                                                                const updated = editingSection.customActions.map((a) =>
                                                                    a.id === action.id ? { ...a, visibilityConfig: e.target.value } : a,
                                                                )
                                                                setEditingSection({ ...editingSection, customActions: updated })
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Select
                                                            value={action.responseAction}
                                                            onValueChange={(value) => {
                                                                const updated = editingSection.customActions.map((a) =>
                                                                    a.id === action.id ? { ...a, responseAction: value } : a,
                                                                )
                                                                setEditingSection({ ...editingSection, customActions: updated })
                                                            }}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="refresh">Refresh</SelectItem>
                                                                <SelectItem value="redirect">Redirect</SelectItem>
                                                                <SelectItem value="modal">Show Modal</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={action.enabled}
                                                            onCheckedChange={(checked) => {
                                                                const updated = editingSection.customActions.map((a) =>
                                                                    a.id === action.id ? { ...a, enabled: checked } : a,
                                                                )
                                                                setEditingSection({ ...editingSection, customActions: updated })
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                                                    No custom actions defined. Click Add to create one.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </CollapsibleContent>
                    </Collapsible>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Sections</h2>
                <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                    <Filter className="h-4 w-4 mr-2" />
                    Show Filters
                </Button>
            </div>

            {/* Export Button */}
            <div className="flex justify-start">
                <Button variant="outline" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                </Button>
            </div>

            {/* Sections Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox onCheckedChange={(checked) => handleSelectAll()} />
                                </TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Is Header</TableHead>
                                <TableHead>Data Source</TableHead>
                                <TableHead>Description</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sections.map((section) => (
                                <TableRow key={section.id} className="hover:bg-gray-50">
                                    <TableCell>
                                        <Checkbox
                                            checked={section.selected}
                                            onCheckedChange={(checked) => handleSelectSection(section.id)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <button
                                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-left"
                                            onClick={() => handleSectionClick(section)}
                                        >
                                            {section.name}
                                        </button>
                                    </TableCell>
                                    <TableCell>
                                        <Checkbox checked={section.isHeader} disabled />
                                    </TableCell>
                                    <TableCell className="text-gray-600">{section.dataSource}</TableCell>
                                    <TableCell className="text-gray-600">{section.description}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Results Summary */}
            <div className="text-sm text-gray-600">Showing {sections.length} sections</div>
        </div>
    )
}
