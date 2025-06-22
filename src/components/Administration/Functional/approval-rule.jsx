"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

// Sample data for approval rules
const approvalRules = [
    {
        id: 1,
        name: "Billback Catch All Rule",
        description: "catch all rule for billbacks",
        ruleCode: "STATUS_TRANSITION",
        objectType: "Billback Header",
        active: true,
    },
    {
        id: 2,
        name: "Bids Catch All Rule",
        description: "catch all rule for bids",
        ruleCode: "STATUS_TRANSITION",
        objectType: "Bid Header",
        active: true,
    },
    {
        id: 3,
        name: "Deal Catch All Rule",
        description: "catch all rule for deals",
        ruleCode: "STATUS_TRANSITION",
        objectType: "Deal Header",
        active: true,
    },
    {
        id: 4,
        name: "Claim Catch All Rule",
        description: "catch all rule for claims",
        ruleCode: "STATUS_TRANSITION",
        objectType: "Claim Header",
        active: true,
    },
    {
        id: 5,
        name: "Payment Catch All Rule",
        description: "catch all rule for payments",
        ruleCode: "STATUS_TRANSITION",
        objectType: "Payment Header",
        active: true,
    },
    {
        id: 6,
        name: "price list catch all",
        description: "auto approve",
        ruleCode: "STATUS_TRANSITION",
        objectType: "Pricelist Header",
        active: true,
    },
]

// Sample data for dropdowns
const objectTypes = [
    "Billback Header",
    "Bid Header",
    "Deal Header",
    "Claim Header",
    "Payment Header",
    "Pricelist Header",
    "Contract Header",
    "Invoice Header",
]

const ruleCodes = [
    "STATUS_TRANSITION",
    "AMOUNT_THRESHOLD",
    "APPROVAL_HIERARCHY",
    "BUSINESS_RULE",
    "CONDITIONAL_APPROVAL",
]

export default function ApprovalRulePage() {
    const [searchFilters, setSearchFilters] = useState({
        objectType: "",
        ruleCode: "",
        objectId: "",
    })
    const [filteredRules, setFilteredRules] = useState(approvalRules)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [newRule, setNewRule] = useState({
        name: "",
        description: "",
        ruleCode: "",
        objectType: "",
        active: true,
    })
    const [allRules, setAllRules] = useState(approvalRules)

    const handleCreate = () => {
        setIsCreateModalOpen(true)
    }

    const handleSaveNewRule = () => {
        if (!newRule.name || !newRule.description || !newRule.ruleCode || !newRule.objectType) {
            alert("Please fill in all required fields")
            return
        }

        const newRuleWithId = {
            ...newRule,
            id: Math.max(...allRules.map((r) => r.id)) + 1,
        }

        const updatedRules = [...allRules, newRuleWithId]
        setAllRules(updatedRules)
        setFilteredRules(updatedRules)

        // Reset form
        setNewRule({
            name: "",
            description: "",
            ruleCode: "",
            objectType: "",
            active: true,
        })

        setIsCreateModalOpen(false)
        console.log("New approval rule created:", newRuleWithId)
    }

    const handleCancelCreate = () => {
        setNewRule({
            name: "",
            description: "",
            ruleCode: "",
            objectType: "",
            active: true,
        })
        setIsCreateModalOpen(false)
    }

    const handleFindRule = () => {
        let filtered = allRules

        if (searchFilters.objectType) {
            filtered = filtered.filter((rule) => rule.objectType === searchFilters.objectType)
        }

        if (searchFilters.ruleCode) {
            filtered = filtered.filter((rule) => rule.ruleCode === searchFilters.ruleCode)
        }

        if (searchFilters.objectId) {
            filtered = filtered.filter(
                (rule) =>
                    rule.name.toLowerCase().includes(searchFilters.objectId.toLowerCase()) ||
                    rule.description.toLowerCase().includes(searchFilters.objectId.toLowerCase()),
            )
        }

        setFilteredRules(filtered)
    }

    const handleReset = () => {
        setSearchFilters({
            objectType: "",
            ruleCode: "",
            objectId: "",
        })
        setFilteredRules(allRules)
    }

    const handleRuleClick = (ruleName) => {
        // Implement rule detail/edit logic
        console.log("Opening rule:", ruleName)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Approval Rules</h2>
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleCreate}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Create New Approval Rule</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="new-rule-name">Rule Name *</Label>
                                    <Input
                                        id="new-rule-name"
                                        placeholder="Enter rule name"
                                        value={newRule.name}
                                        onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="new-rule-description">Description *</Label>
                                    <Input
                                        id="new-rule-description"
                                        placeholder="Enter rule description"
                                        value={newRule.description}
                                        onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="new-rule-code">Rule Code *</Label>
                                        <Select
                                            value={newRule.ruleCode}
                                            onValueChange={(value) => setNewRule({ ...newRule, ruleCode: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select rule code" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ruleCodes.map((code) => (
                                                    <SelectItem key={code} value={code}>
                                                        {code}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="new-object-type">Object Type *</Label>
                                        <Select
                                            value={newRule.objectType}
                                            onValueChange={(value) => setNewRule({ ...newRule, objectType: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select object type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {objectTypes.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="new-rule-active"
                                        checked={newRule.active}
                                        onCheckedChange={(checked) => setNewRule({ ...newRule, active })}
                                    />
                                    <Label htmlFor="new-rule-active">Active</Label>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="outline" onClick={handleCancelCreate}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSaveNewRule}>Create Rule</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search/Filter Section */}
            <Card>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="space-y-2">
                            <Label htmlFor="object-type">Object Type</Label>
                            <Select
                                value={searchFilters.objectType}
                                onValueChange={(value) => setSearchFilters({ ...searchFilters, objectType: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select object type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Object Types</SelectItem>
                                    {objectTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="rule-code">Rule Code</Label>
                            <Select
                                value={searchFilters.ruleCode}
                                onValueChange={(value) => setSearchFilters({ ...searchFilters, ruleCode: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select rule code" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Rule Codes</SelectItem>
                                    {ruleCodes.map((code) => (
                                        <SelectItem key={code} value={code}>
                                            {code}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="object-id">Object ID</Label>
                            <Input
                                id="object-id"
                                placeholder="Enter object ID or search term"
                                value={searchFilters.objectId}
                                onChange={(e) => setSearchFilters({ ...searchFilters, objectId: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button onClick={handleFindRule}>
                            <Search className="h-4 w-4 mr-2" />
                            Find Rule
                        </Button>
                        <Button variant="outline" onClick={handleReset}>
                            Reset
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Results Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Rule Code</TableHead>
                                <TableHead>Object Type</TableHead>
                                <TableHead>Active</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRules.length > 0 ? (
                                filteredRules.map((rule) => (
                                    <TableRow key={rule.id} className="hover:bg-gray-50">
                                        <TableCell>
                                            <button
                                                className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-left"
                                                onClick={() => handleRuleClick(rule.name)}
                                            >
                                                {rule.name}
                                            </button>
                                        </TableCell>
                                        <TableCell className="text-gray-600">{rule.description}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-mono text-xs">
                                                {rule.ruleCode}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-gray-600">{rule.objectType}</TableCell>
                                        <TableCell>
                                            <Badge variant={rule.active ? "default" : "secondary"}>
                                                {rule.active ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                        No approval rules found matching your criteria.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Results Summary */}
            <div className="text-sm text-gray-600">
                Showing {filteredRules.length} of {allRules.length} approval rules
            </div>
        </div>
    )
}
