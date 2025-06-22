"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Download, Save, Trash2, RotateCcw, Edit } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Sample data for custom functions
const customFunctions = [
    {
        id: 1,
        name: "Match by Deal Number",
        code: "MATCH_BY_DEAL_NUMBER",
        functionType: "Custom Deal Match Function",
        functionSignatureType: "Custom Deal Match Function",
        customCode:
            "// Custom matching logic for deal numbers\nfunction matchByDealNumber(dealNumber) {\n  return dealNumber.match(/^D\\d{6}$/);\n}",
    },
    {
        id: 2,
        name: "Match by Deal Type",
        code: "MATCH_BY_DEAL_TYPE",
        functionType: "Custom Deal Match Function",
        functionSignatureType: "Custom Deal Match Function",
        customCode:
            "// Custom matching logic for deal types\nfunction matchByDealType(dealType) {\n  return ['STANDARD', 'PREMIUM', 'BASIC'].includes(dealType);\n}",
    },
    {
        id: 3,
        name: "Match by Deal Activity",
        code: "MATCH_BY_DEAL_ACTIVITY",
        functionType: "Custom Deal Match Function",
        functionSignatureType: "Custom Deal Match Function",
        customCode:
            "// Custom matching logic for deal activities\nfunction matchByDealActivity(activity) {\n  return activity.status === 'ACTIVE';\n}",
    },
    {
        id: 4,
        name: "Write Off",
        code: "WRITE_OFF",
        functionType: "Custom Deal Match Function",
        functionSignatureType: "Custom Deal Match Function",
        customCode: "// Write off logic\nfunction writeOff(amount) {\n  return amount < 0.01;\n}",
    },
    {
        id: 5,
        name: "Credit Memo",
        code: "CREDIT_MEMO",
        functionType: "Custom Deal Match Function",
        functionSignatureType: "Custom Deal Match Function",
        customCode: "// Credit memo processing\nfunction creditMemo(memo) {\n  return memo.type === 'CREDIT';\n}",
    },
    {
        id: 6,
        name: "Set Reason",
        code: "SET_REASON",
        functionType: "Custom Deal Match Function",
        functionSignatureType: "Custom Deal Match Function",
        customCode: "// Set reason logic\nfunction setReason(reason) {\n  return reason.length > 0;\n}",
    },
    {
        id: 7,
        name: "Simple Match",
        code: "SIMPLE_MATCH",
        functionType: "Simple Deal Match Function",
        functionSignatureType: "Simple Deal Match Function",
        customCode: "// Simple matching logic\nfunction simpleMatch(value1, value2) {\n  return value1 === value2;\n}",
    },
    {
        id: 8,
        name: "Regional Approver for Deal",
        code: "REGIONAL_DEAL_APPROVER",
        functionType: "Custom Get Approver Function",
        functionSignatureType: "Custom Get Approver Function",
        customCode:
            "// Regional approver logic\nfunction getRegionalApprover(region) {\n  const approvers = {\n    'NORTH': 'john.doe@company.com',\n    'SOUTH': 'jane.smith@company.com'\n  };\n  return approvers[region];\n}",
    },
]

const functionTypes = [
    "Custom Deal Match Function",
    "Simple Deal Match Function",
    "Custom Get Approver Function",
    "Custom Validation Function",
    "Custom Calculation Function",
]

export default function CustomFunctionsPage() {
    const [functions, setFunctions] = useState(customFunctions)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingFunction, setEditingFunction] = useState(null)
    const [newFunction, setNewFunction] = useState({
        name: "",
        code: "",
        functionType: "",
        functionSignatureType: "",
        customCode: "",
    })

    const handleAdd = () => {
        setIsAddModalOpen(true)
    }

    const handleSave = () => {
        console.log("Saving all custom functions...")
        // Implement save logic
    }

    const handleDelete = () => {
        console.log("Deleting selected custom functions...")
        // Implement delete logic
    }

    const handleRevert = () => {
        setFunctions(customFunctions)
        console.log("Reverted to original functions")
    }

    const handleExport = () => {
        console.log("Exporting custom functions...")
        // Implement export logic
    }

    const handleEditFunction = (func) => {
        setEditingFunction({ ...func })
        setIsEditModalOpen(true)
    }

    const handleSaveNewFunction = () => {
        if (!newFunction.name || !newFunction.code || !newFunction.functionType) {
            alert("Please fill in all required fields")
            return
        }

        const newFunctionWithId = {
            ...newFunction,
            id: Math.max(...functions.map((f) => f.id)) + 1,
            functionSignatureType: newFunction.functionType, // Default to same as function type
        }

        setFunctions([...functions, newFunctionWithId])
        setNewFunction({
            name: "",
            code: "",
            functionType: "",
            functionSignatureType: "",
            customCode: "",
        })
        setIsAddModalOpen(false)
    }

    const handleSaveEditFunction = () => {
        if (!editingFunction.name || !editingFunction.code || !editingFunction.functionType) {
            alert("Please fill in all required fields")
            return
        }

        setFunctions(functions.map((f) => (f.id === editingFunction.id ? editingFunction : f)))
        setIsEditModalOpen(false)
        setEditingFunction(null)
    }

    const handleCancelAdd = () => {
        setNewFunction({
            name: "",
            code: "",
            functionType: "",
            functionSignatureType: "",
            customCode: "",
        })
        setIsAddModalOpen(false)
    }

    const handleCancelEdit = () => {
        setIsEditModalOpen(false)
        setEditingFunction(null)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Custom Functions</h2>
                <div className="flex items-center gap-2">
                    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={handleAdd}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px]">
                            <DialogHeader>
                                <DialogTitle>Add New Custom Function</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="new-name">Function Name *</Label>
                                        <Input
                                            id="new-name"
                                            placeholder="Enter function name"
                                            value={newFunction.name}
                                            onChange={(e) => setNewFunction({ ...newFunction, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new-code">Function Code *</Label>
                                        <Input
                                            id="new-code"
                                            placeholder="Enter function code"
                                            value={newFunction.code}
                                            onChange={(e) => setNewFunction({ ...newFunction, code: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new-function-type">Function Type *</Label>
                                    <Select
                                        value={newFunction.functionType}
                                        onValueChange={(value) =>
                                            setNewFunction({ ...newFunction, functionType: value, functionSignatureType: value })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select function type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {functionTypes.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new-custom-code">Custom Code</Label>
                                    <Textarea
                                        id="new-custom-code"
                                        placeholder="Enter your custom function code here..."
                                        value={newFunction.customCode}
                                        onChange={(e) => setNewFunction({ ...newFunction, customCode: e.target.value })}
                                        rows={8}
                                        className="font-mono text-sm"
                                    />
                                </div>
                                <div className="flex justify-end space-x-2 pt-4">
                                    <Button variant="outline" onClick={handleCancelAdd}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleSaveNewFunction}>Add Function</Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Button onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                    </Button>
                    <Button variant="outline" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </Button>
                    <Button variant="outline" onClick={handleRevert}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Revert
                    </Button>
                </div>
            </div>

            {/* Export Button */}
            <div className="flex justify-start">
                <Button variant="outline" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                </Button>
            </div>

            {/* Custom Functions Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Code</TableHead>
                                <TableHead>Function Type</TableHead>
                                <TableHead>Function Signature Type</TableHead>
                                <TableHead>Custom Code</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {functions.map((func) => (
                                <TableRow key={func.id} className="hover:bg-gray-50">
                                    <TableCell className="font-medium">{func.name}</TableCell>
                                    <TableCell className="font-mono text-sm">{func.code}</TableCell>
                                    <TableCell className="text-gray-600">{func.functionType}</TableCell>
                                    <TableCell className="text-gray-600">{func.functionSignatureType}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm" onClick={() => handleEditFunction(func)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Edit Function Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle>Edit Custom Function</DialogTitle>
                    </DialogHeader>
                    {editingFunction && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-name">Function Name *</Label>
                                    <Input
                                        id="edit-name"
                                        value={editingFunction.name}
                                        onChange={(e) => setEditingFunction({ ...editingFunction, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-code">Function Code *</Label>
                                    <Input
                                        id="edit-code"
                                        value={editingFunction.code}
                                        onChange={(e) => setEditingFunction({ ...editingFunction, code: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-function-type">Function Type *</Label>
                                <Select
                                    value={editingFunction.functionType}
                                    onValueChange={(value) =>
                                        setEditingFunction({
                                            ...editingFunction,
                                            functionType: value,
                                            functionSignatureType: value,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {functionTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-custom-code">Custom Code</Label>
                                <Textarea
                                    id="edit-custom-code"
                                    value={editingFunction.customCode}
                                    onChange={(e) => setEditingFunction({ ...editingFunction, customCode: e.target.value })}
                                    rows={8}
                                    className="font-mono text-sm"
                                />
                            </div>
                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="outline" onClick={handleCancelEdit}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSaveEditFunction}>Save Changes</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Results Summary */}
            <div className="text-sm text-gray-600">Showing {functions.length} custom functions</div>
        </div>
    )
}
