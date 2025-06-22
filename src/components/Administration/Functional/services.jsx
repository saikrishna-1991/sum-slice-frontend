"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Download, Trash2, ChevronRight, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Sample data for services
const servicesData = [
    {
        id: 1,
        name: "Submit Deal Attributes",
        description: "Submit deal attributes to third party service. Edit.",
        urlPath: "/tpValidate",
        method: "POST",
        inputParameters: [
            { id: 1, parameter: "dealId", uniqueIdentifier: "DEAL_ID", selected: false },
            { id: 2, parameter: "attributes", uniqueIdentifier: "ATTR_LIST", selected: false },
        ],
        outputParameters: [
            { id: 1, parameter: "status", selected: false },
            { id: 2, parameter: "validationResult", selected: false },
        ],
    },
    {
        id: 2,
        name: "Fetch Mean Date",
        description: "fetch mean of allowance start and end dates.",
        urlPath: "/tpFetchMeanDate",
        method: "POST",
        inputParameters: [
            { id: 1, parameter: "startDate", uniqueIdentifier: "START_DT", selected: false },
            { id: 2, parameter: "endDate", uniqueIdentifier: "END_DT", selected: false },
        ],
        outputParameters: [{ id: 1, parameter: "meanDate", selected: false }],
    },
    {
        id: 3,
        name: "Return New Amt",
        description: "simply returns twice the input.",
        urlPath: "/tpNewLumpsumAmt",
        method: "POST",
        inputParameters: [{ id: 1, parameter: "amount", uniqueIdentifier: "AMT_INPUT", selected: false }],
        outputParameters: [{ id: 1, parameter: "newAmount", selected: false }],
    },
    {
        id: 4,
        name: "Show Customer Details",
        description: "Fetch customer details.",
        urlPath: "/tpCustomerDetails",
        method: "POST",
        inputParameters: [{ id: 1, parameter: "customerId", uniqueIdentifier: "CUST_ID", selected: false }],
        outputParameters: [
            { id: 1, parameter: "customerName", selected: false },
            { id: 2, parameter: "customerAddress", selected: false },
        ],
    },
    {
        id: 5,
        name: "Get Item Min Price",
        description: "Get the minimum item price by divisions OR division warehouses.",
        urlPath: "/tpMinItemPrice",
        method: "POST",
        inputParameters: [
            { id: 1, parameter: "itemId", uniqueIdentifier: "ITEM_ID", selected: false },
            { id: 2, parameter: "divisionId", uniqueIdentifier: "DIV_ID", selected: false },
        ],
        outputParameters: [{ id: 1, parameter: "minPrice", selected: false }],
    },
]

const httpMethods = ["GET", "POST", "PUT", "DELETE", "PATCH"]

export default function ServicesPage() {
    const [currentView, setCurrentView] = useState("list")
    const [selectedService, setSelectedService] = useState(null)
    const [services, setServices] = useState(servicesData)
    const [editingService, setEditingService] = useState(null)

    const handleServiceClick = (service) => {
        setSelectedService(service)
        setEditingService({ ...service })
        setCurrentView("detail")
    }

    const handleCreate = () => {
        const newService = {
            id: Math.max(...services.map((s) => s.id)) + 1,
            name: "",
            description: "",
            urlPath: "",
            method: "POST",
            inputParameters: [],
            outputParameters: [],
        }
        setSelectedService(newService)
        setEditingService(newService)
        setCurrentView("create")
    }

    const handleSave = () => {
        if (currentView === "create") {
            setServices([...services, editingService])
        } else {
            setServices(services.map((s) => (s.id === editingService.id ? editingService : s)))
        }
        setCurrentView("list")
    }

    const handleCancel = () => {
        setCurrentView("list")
        setSelectedService(null)
        setEditingService(null)
    }

    const handleExport = () => {
        console.log("Exporting services...")
    }

    const addInputParameter = () => {
        const newParam = {
            id: Math.max(...(editingService.inputParameters?.map((p) => p.id) || [0])) + 1,
            parameter: "",
            uniqueIdentifier: "",
            selected: false,
        }
        setEditingService({
            ...editingService,
            inputParameters: [...(editingService.inputParameters || []), newParam],
        })
    }

    const addOutputParameter = () => {
        const newParam = {
            id: Math.max(...(editingService.outputParameters?.map((p) => p.id) || [0])) + 1,
            parameter: "",
            selected: false,
        }
        setEditingService({
            ...editingService,
            outputParameters: [...(editingService.outputParameters || []), newParam],
        })
    }

    const deleteInputParameter = (id) => {
        setEditingService({
            ...editingService,
            inputParameters: editingService.inputParameters.filter((p) => p.id !== id),
        })
    }

    const deleteOutputParameter = (id) => {
        setEditingService({
            ...editingService,
            outputParameters: editingService.outputParameters.filter((p) => p.id !== id),
        })
    }

    if (currentView === "detail" || currentView === "create") {
        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold text-gray-900">Services Summary</h2>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="flex items-center gap-1">
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

                {/* Service Form */}
                <Card>
                    <CardContent className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="service-name">Name</Label>
                                <Input
                                    id="service-name"
                                    value={editingService?.name || ""}
                                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="url-path">URL Path:</Label>
                                <Input
                                    id="url-path"
                                    value={editingService?.urlPath || ""}
                                    onChange={(e) => setEditingService({ ...editingService, urlPath: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="method">Method</Label>
                                <Select
                                    value={editingService?.method || "POST"}
                                    onValueChange={(value) => setEditingService({ ...editingService, method: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {httpMethods.map((method) => (
                                            <SelectItem key={method} value={method}>
                                                {method}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                rows={4}
                                value={editingService?.description || ""}
                                onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                            />
                        </div>

                        {/* Input and Output Parameters */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Input Parameters */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium">Input</h3>
                                    <div className="flex items-center gap-2">
                                        <Button size="sm" onClick={addInputParameter}>
                                            <Plus className="h-4 w-4 mr-1" />
                                            Add
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Delete
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Download className="h-4 w-4 mr-1" />
                                            Export
                                        </Button>
                                    </div>
                                </div>
                                <Card>
                                    <CardContent className="p-0">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-12"></TableHead>
                                                    <TableHead>Parameter</TableHead>
                                                    <TableHead>Unique Identifier</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {editingService?.inputParameters?.map((param) => (
                                                    <TableRow key={param.id}>
                                                        <TableCell>
                                                            <Checkbox checked={param.selected} />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Input
                                                                value={param.parameter}
                                                                onChange={(e) => {
                                                                    const updated = editingService.inputParameters.map((p) =>
                                                                        p.id === param.id ? { ...p, parameter: e.target.value } : p,
                                                                    )
                                                                    setEditingService({ ...editingService, inputParameters: updated })
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Input
                                                                value={param.uniqueIdentifier}
                                                                onChange={(e) => {
                                                                    const updated = editingService.inputParameters.map((p) =>
                                                                        p.id === param.id ? { ...p, uniqueIdentifier: e.target.value } : p,
                                                                    )
                                                                    setEditingService({ ...editingService, inputParameters: updated })
                                                                }}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Output Parameters */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium">Output</h3>
                                    <div className="flex items-center gap-2">
                                        <Button size="sm" onClick={addOutputParameter}>
                                            <Plus className="h-4 w-4 mr-1" />
                                            Add
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Delete
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Download className="h-4 w-4 mr-1" />
                                            Export
                                        </Button>
                                    </div>
                                </div>
                                <Card>
                                    <CardContent className="p-0">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-12"></TableHead>
                                                    <TableHead>Parameter</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {editingService?.outputParameters?.map((param) => (
                                                    <TableRow key={param.id}>
                                                        <TableCell>
                                                            <Checkbox checked={param.selected} />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Input
                                                                value={param.parameter}
                                                                onChange={(e) => {
                                                                    const updated = editingService.outputParameters.map((p) =>
                                                                        p.id === param.id ? { ...p, parameter: e.target.value } : p,
                                                                    )
                                                                    setEditingService({ ...editingService, outputParameters: updated })
                                                                }}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Services Summary</h2>
                <Button onClick={handleCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create
                </Button>
            </div>

            {/* Export Button */}
            <div className="flex justify-start">
                <Button variant="outline" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                </Button>
            </div>

            {/* Services Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12"></TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>URL Path</TableHead>
                                <TableHead>Method</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {services.map((service) => (
                                <TableRow key={service.id} className="hover:bg-gray-50">
                                    <TableCell>
                                        <Checkbox />
                                    </TableCell>
                                    <TableCell>
                                        <button
                                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-left"
                                            onClick={() => handleServiceClick(service)}
                                        >
                                            {service.name}
                                        </button>
                                    </TableCell>
                                    <TableCell className="text-gray-600">{service.description}</TableCell>
                                    <TableCell className="font-mono text-sm">{service.urlPath}</TableCell>
                                    <TableCell>
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                            {service.method}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
