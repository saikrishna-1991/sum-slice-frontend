"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Plus, RotateCcw, Save, X } from "lucide-react"

// Sample data for lookup types
const lookupTypes = [
    { code: "ACCRUAL_CALC_BASIS", description: "Accrual Calculations basis" },
    { code: "AUTO_SHIP", description: "Auto Ship" },
    { code: "BILLBACK_DISPUTE_CODE", description: "Billback Dispute Code" },
    { code: "BILLING_PERIODS", description: "Billing Schedule" },
    { code: "CLAIM_DECLINATION_CODES", description: "Declination codes" },
    { code: "CLAIM_DISTRIBUTION_STATUS", description: "Claim Distribution Status" },
]

// Sample data for lookup details
const lookupDetails = [
    {
        code: "PURCHASE_COST",
        displayedField: "Purchase Cost",
        description: "Purchase Cost",
        startDate: "",
        endDate: "",
        enabled: true,
    },
    {
        code: "SALES_AMOUNT",
        displayedField: "Sales Amount",
        description: "Sales Amount",
        startDate: "",
        endDate: "",
        enabled: true,
    },
    {
        code: "SALES_QUANTITY",
        displayedField: "Sales Quantity",
        description: "Sales Quantity",
        startDate: "",
        endDate: "",
        enabled: true,
    },
]

export default function LookupPage() {
    const [currentView, setCurrentView] = useState("list")
    const [selectedLookupType, setSelectedLookupType] = useState("")
    const [searchFilters, setSearchFilters] = useState({
        lookupType: "",
        description: "",
        lookupCode: "",
    })

    const handleSearch = () => {
        // Implement search logic
        console.log("Searching with filters:", searchFilters)
    }

    const handleReset = () => {
        setSearchFilters({
            lookupType: "",
            description: "",
            lookupCode: "",
        })
    }

    const handleExport = () => {
        // Implement export logic
        console.log("Exporting data...")
    }

    const handleLookupTypeClick = (lookupType) => {
        setSelectedLookupType(lookupType)
        setCurrentView("detail")
    }

    const handleBackToList = () => {
        setCurrentView("list")
        setSelectedLookupType("")
    }

    if (currentView === "detail") {
        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-gray-900">Lookups</h2>
                        <div className="flex items-center gap-2">
                            <Label htmlFor="lookup-type" className="text-sm font-medium">
                                Lookup Type:
                            </Label>
                            <Select value={selectedLookupType} onValueChange={setSelectedLookupType}>
                                <SelectTrigger className="w-64">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {lookupTypes.map((type) => (
                                        <SelectItem key={type.code} value={type.code}>
                                            {type.code}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleExport}>
                            <Download className="h-4 w-4 mr-1" />
                            Export
                        </Button>
                        <Button size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            Create
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleReset}>
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Reset
                        </Button>
                        <Button size="sm">
                            <Save className="h-4 w-4 mr-1" />
                            Save
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleBackToList}>
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                        </Button>
                    </div>
                </div>

                {/* Detail Table */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Lookup Code</TableHead>
                                    <TableHead>Displayed Field</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>End Date</TableHead>
                                    <TableHead>Enabled</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {lookupDetails.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{item.code}</TableCell>
                                        <TableCell>{item.displayedField}</TableCell>
                                        <TableCell>{item.description}</TableCell>
                                        <TableCell>{item.startDate}</TableCell>
                                        <TableCell>{item.endDate}</TableCell>
                                        <TableCell>
                                            <Checkbox checked={item.enabled} />
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Lookups</h2>
            </div>

            {/* Search Form */}
            <Card>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="space-y-2">
                            <Label htmlFor="lookup-type">Lookup Type:</Label>
                            <Select
                                value={searchFilters.lookupType}
                                onValueChange={(value) => setSearchFilters({ ...searchFilters, lookupType: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="--Select--" />
                                </SelectTrigger>
                                <SelectContent>
                                    {lookupTypes.map((type) => (
                                        <SelectItem key={type.code} value={type.code}>
                                            {type.code}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description:</Label>
                            <Input
                                id="description"
                                value={searchFilters.description}
                                onChange={(e) => setSearchFilters({ ...searchFilters, description: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lookup-code">Lookup Code:</Label>
                            <Input
                                id="lookup-code"
                                value={searchFilters.lookupCode}
                                onChange={(e) => setSearchFilters({ ...searchFilters, lookupCode: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleSearch}>Search</Button>
                        <Button variant="outline" onClick={handleReset}>
                            Reset
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Export Button */}
            <div className="flex justify-start">
                <Button variant="outline" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                </Button>
            </div>

            {/* Results Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Lookup Type</TableHead>
                                <TableHead>Description</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {lookupTypes.map((item, index) => (
                                <TableRow key={index} className="cursor-pointer hover:bg-gray-50">
                                    <TableCell>
                                        <button
                                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                            onClick={() => handleLookupTypeClick(item.code)}
                                        >
                                            {item.code}
                                        </button>
                                    </TableCell>
                                    <TableCell>{item.description}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
