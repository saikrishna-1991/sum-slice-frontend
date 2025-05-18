"use client"

import { useState, useEffect } from "react"
import {
    Search,
    Download,
    Filter,
    Plus,
    Trash2,
    RefreshCw,
    X,
    Settings,
    DollarSign,
    MoreHorizontal,
    ChevronDown,
    ChevronUp,
    Paperclip,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

// Mock fee type data
const feeTypeData = [
    {
        id: 1,
        feeType: "Admin Fee",
        description: "Administrative fee for processing applications",
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        isActive: true,
        hasAttachment: true,
    },
    {
        id: 2,
        feeType: "DSA Fee",
        description: "Direct selling agent commission fee",
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        isActive: true,
        hasAttachment: false,
    },
    {
        id: 3,
        feeType: "Processing Fee",
        description: "Fee for processing transactions",
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        isActive: true,
        hasAttachment: true,
    },
    {
        id: 4,
        feeType: "Late Payment Fee",
        description: "Fee charged for late payments",
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        isActive: false,
        hasAttachment: false,
    },
    {
        id: 5,
        feeType: "Cancellation Fee",
        description: "Fee for cancelling a service",
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        isActive: true,
        hasAttachment: true,
    },
]

// Define all available columns
const allColumns = [
    { id: "feeType", name: "Fee Type", defaultVisible: true },
    { id: "description", name: "Description", defaultVisible: true },
    { id: "startDate", name: "Start Date", defaultVisible: true },
    { id: "endDate", name: "End Date", defaultVisible: true },
    { id: "isActive", name: "Active", defaultVisible: true },
    { id: "hasAttachment", name: "Attachment", defaultVisible: true },
]

export default function FeeTypePage() {
    const { toast } = useToast()
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState("1")
    const [selectedFeeTypes, setSelectedFeeTypes] = useState([])
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [columnFilters, setColumnFilters] = useState({})
    const [activeFilterColumn, setActiveFilterColumn] = useState(null)
    const [filterValue, setFilterValue] = useState("")
    const [filterType, setFilterType] = useState("contains")
    const [selectedFeeType, setSelectedFeeType] = useState(null)
    const [isAddFeeTypeDialogOpen, setIsAddFeeTypeDialogOpen] = useState(false)
    const [isEditFeeTypeDialogOpen, setIsEditFeeTypeDialogOpen] = useState(false)
    const [isColumnSettingsOpen, setIsColumnSettingsOpen] = useState(false)
    const [visibleColumns, setVisibleColumns] = useState(
        allColumns.filter((col) => col.defaultVisible).map((col) => col.id),
    )
    const [isLoading, setIsLoading] = useState(false)
    const [sortColumn, setSortColumn] = useState(null)
    const [sortDirection, setSortDirection] = useState("asc")
    const [animate, setAnimate] = useState(false)

    // New fee type form state
    const [newFeeType, setNewFeeType] = useState({
        feeType: "",
        description: "",
        startDate: "",
        endDate: "",
        isActive: true,
        hasAttachment: false,
    })

    // Edit fee type form state
    const [editFeeType, setEditFeeType] = useState({
        id: 0,
        feeType: "",
        description: "",
        startDate: "",
        endDate: "",
        isActive: true,
        hasAttachment: false,
    })

    // Animation effect
    useEffect(() => {
        setAnimate(true)
    }, [])

    const handleFeeTypeSelection = (id) => {
        setSelectedFeeTypes((prev) => (prev.includes(id) ? prev.filter((feeId) => feeId !== id) : [...prev, id]))
    }

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedFeeTypes(filteredFeeTypes.map((fee) => fee.id))
        } else {
            setSelectedFeeTypes([])
        }
    }

    const handleDeleteFeeTypes = () => {
        console.log("Deleting fee types:", selectedFeeTypes)
        toast({
            title: "Fee Types Deleted",
            description: `${selectedFeeTypes.length} fee type(s) have been deleted successfully.`,
        })
        setSelectedFeeTypes([])
        setIsDeleteDialogOpen(false)
    }

    const handleAddFeeType = () => {
        setIsAddFeeTypeDialogOpen(true)
    }

    const handleEditFeeType = (feeType) => {
        setEditFeeType(feeType)
        setIsEditFeeTypeDialogOpen(true)
    }

    const handleSaveNewFeeType = () => {
        // In a real app, you would save to the database here
        toast({
            title: "Fee Type Added",
            description: "The fee type has been added successfully.",
        })
        setIsAddFeeTypeDialogOpen(false)
        setNewFeeType({
            feeType: "",
            description: "",
            startDate: "",
            endDate: "",
            isActive: true,
            hasAttachment: false,
        })
    }

    const handleSaveEditFeeType = () => {
        // In a real app, you would update the database here
        toast({
            title: "Fee Type Updated",
            description: "The fee type has been updated successfully.",
        })
        setIsEditFeeTypeDialogOpen(false)
    }

    const handleExport = () => {
        toast({
            title: "Export Started",
            description: "Your fee type data is being exported. You'll be notified when it's ready.",
        })
    }

    const handleRefresh = () => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast({
                title: "Data Refreshed",
                description: "Fee type data has been refreshed successfully.",
            })
        }, 1000)
    }

    const applyFilter = (column, type, value) => {
        setColumnFilters((prev) => ({
            ...prev,
            [column]: { type, value },
        }))
        setActiveFilterColumn(null)
    }

    const clearFilter = (column) => {
        setColumnFilters((prev) => {
            const newFilters = { ...prev }
            delete newFilters[column]
            return newFilters
        })
    }

    const clearAllFilters = () => {
        setColumnFilters({})
    }

    const toggleColumnVisibility = (columnId) => {
        setVisibleColumns((prev) => (prev.includes(columnId) ? prev.filter((id) => id !== columnId) : [...prev, columnId]))
    }

    const resetColumnVisibility = () => {
        setVisibleColumns(allColumns.filter((col) => col.defaultVisible).map((col) => col.id))
    }

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortColumn(column)
            setSortDirection("asc")
        }
    }

    // Apply filters and sorting to fee type data
    let filteredFeeTypes = feeTypeData.filter((feeType) => {
        // First apply search term
        const matchesSearch =
            feeType.feeType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            feeType.description.toLowerCase().includes(searchTerm.toLowerCase())

        if (!matchesSearch) return false

        // Apply column filters
        for (const [column, filter] of Object.entries(columnFilters)) {
            let value = feeType[column]

            // Handle boolean values
            if (typeof value === "boolean") {
                value = value ? "true" : "false"
            } else {
                value = (value?.toString() || "").toLowerCase()
            }

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

    // Apply sorting
    if (sortColumn) {
        filteredFeeTypes = [...filteredFeeTypes].sort((a, b) => {
            let valueA = a[sortColumn]
            let valueB = b[sortColumn]

            // Handle undefined values
            if (valueA === undefined) valueA = ""
            if (valueB === undefined) valueB = ""

            // Convert to strings for comparison
            valueA = valueA?.toString() || ""
            valueB = valueB?.toString() || ""

            if (sortDirection === "asc") {
                return valueA.localeCompare(valueB)
            } else {
                return valueB.localeCompare(valueA)
            }
        })
    }

    return (
        <div className="p-6 space-y-6 flex-1">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Fee Type Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and monitor fee types</p>
                </div>
            </div>

            {/* Search and Actions */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                        className="pl-8 w-full md:w-[300px]"
                        placeholder="Search fee types"
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="outline"
                        onClick={handleAddFeeType}
                        className="transition-all duration-300 hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Fee Type
                    </Button>

                    <Button
                        variant="outline"
                        className={`transition-all duration-300 ${selectedFeeTypes.length === 0 ? "opacity-50" : "hover:bg-red-50 hover:text-red-600 hover:border-red-200"}`}
                        onClick={() => {
                            if (selectedFeeTypes.length > 0) {
                                setIsDeleteDialogOpen(true)
                            } else {
                                toast({
                                    title: "No Selection",
                                    description: "Please select at least one fee type to delete.",
                                    variant: "destructive",
                                })
                            }
                        }}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </Button>

                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        className="transition-all duration-300 hover:bg-blue-50 hover:text-green-600 hover:border-blue-200"
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>

                    <Button
                        variant="outline"
                        onClick={handleExport}
                        className="transition-all duration-300 hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="transition-all duration-300 hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                            >
                                <Settings className="h-4 w-4 mr-2" />
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {allColumns.map((column) => (
                                <DropdownMenuItem key={column.id} onSelect={(e) => e.preventDefault()}>
                                    <div className="flex items-center gap-2 w-full" onClick={() => toggleColumnVisibility(column.id)}>
                                        <Checkbox checked={visibleColumns.includes(column.id)} />
                                        <span>{column.name}</span>
                                    </div>
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={resetColumnVisibility}>
                                <Button variant="ghost" size="sm" className="w-full justify-start p-0 h-auto font-normal">
                                    Reset to Default
                                </Button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Active Filters */}
            {Object.keys(columnFilters).length > 0 && (
                <div className="flex flex-wrap gap-2 items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500 mr-2">Active Filters:</span>
                    {Object.entries(columnFilters).map(([column, filter]) => (
                        <Badge key={column} variant="outline" className="flex items-center gap-1 bg-white">
                            <span>
                                {allColumns.find((col) => col.id === column)?.name || column}: {filter.type} "{filter.value}"
                            </span>
                            <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1" onClick={() => clearFilter(column)}>
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    ))}
                    <Button variant="ghost" size="sm" className="ml-auto text-xs" onClick={clearAllFilters}>
                        Clear All
                    </Button>
                </div>
            )}

            {/* Fee Types Table */}
            <Card className="border rounded-lg overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={selectedFeeTypes.length > 0 && selectedFeeTypes.length === filteredFeeTypes.length}
                                    onCheckedChange={handleSelectAll}
                                />
                            </TableHead>
                            {visibleColumns.includes("feeType") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("feeType")}
                                    >
                                        Fee Type
                                        {sortColumn === "feeType" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "feeType"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setActiveFilterColumn("feeType")
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.feeType ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Fee Type</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="equals" id="equals-feeType" />
                                                            <Label htmlFor="equals-feeType">Equals</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notEquals" id="notEquals-feeType" />
                                                            <Label htmlFor="notEquals-feeType">Does Not Equal</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="beginsWith" id="beginsWith-feeType" />
                                                            <Label htmlFor="beginsWith-feeType">Begins With</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="endsWith" id="endsWith-feeType" />
                                                            <Label htmlFor="endsWith-feeType">Ends With</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="contains" id="contains-feeType" />
                                                            <Label htmlFor="contains-feeType">Contains</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notContains" id="notContains-feeType" />
                                                            <Label htmlFor="notContains-feeType">Does Not Contain</Label>
                                                        </div>
                                                    </RadioGroup>
                                                    <Input
                                                        placeholder="Filter value..."
                                                        value={filterValue}
                                                        onChange={(e) => setFilterValue(e.target.value)}
                                                    />
                                                    <div className="flex justify-between">
                                                        <Button variant="outline" onClick={() => setActiveFilterColumn(null)}>
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            onClick={() => {
                                                                applyFilter("feeType", filterType, filterValue)
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
                                </TableHead>
                            )}
                            {visibleColumns.includes("description") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("description")}
                                    >
                                        Description
                                        {sortColumn === "description" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "description"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setActiveFilterColumn("description")
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.description ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Description</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="equals" id="equals-description" />
                                                            <Label htmlFor="equals-description">Equals</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notEquals" id="notEquals-description" />
                                                            <Label htmlFor="notEquals-description">Does Not Equal</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="beginsWith" id="beginsWith-description" />
                                                            <Label htmlFor="beginsWith-description">Begins With</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="endsWith" id="endsWith-description" />
                                                            <Label htmlFor="endsWith-description">Ends With</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="contains" id="contains-description" />
                                                            <Label htmlFor="contains-description">Contains</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notContains" id="notContains-description" />
                                                            <Label htmlFor="notContains-description">Does Not Contain</Label>
                                                        </div>
                                                    </RadioGroup>
                                                    <Input
                                                        placeholder="Filter value..."
                                                        value={filterValue}
                                                        onChange={(e) => setFilterValue(e.target.value)}
                                                    />
                                                    <div className="flex justify-between">
                                                        <Button variant="outline" onClick={() => setActiveFilterColumn(null)}>
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            onClick={() => {
                                                                applyFilter("description", filterType, filterValue)
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
                                </TableHead>
                            )}
                            {visibleColumns.includes("startDate") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("startDate")}
                                    >
                                        Start Date
                                        {sortColumn === "startDate" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "startDate"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setActiveFilterColumn("startDate")
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.startDate ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Start Date</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="equals" id="equals-startDate" />
                                                            <Label htmlFor="equals-startDate">Equals</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notEquals" id="notEquals-startDate" />
                                                            <Label htmlFor="notEquals-startDate">Does Not Equal</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="beginsWith" id="beginsWith-startDate" />
                                                            <Label htmlFor="beginsWith-startDate">Begins With</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="endsWith" id="endsWith-startDate" />
                                                            <Label htmlFor="endsWith-startDate">Ends With</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="contains" id="contains-startDate" />
                                                            <Label htmlFor="contains-startDate">Contains</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notContains" id="notContains-startDate" />
                                                            <Label htmlFor="notContains-startDate">Does Not Contain</Label>
                                                        </div>
                                                    </RadioGroup>
                                                    <Input
                                                        placeholder="Filter value..."
                                                        value={filterValue}
                                                        onChange={(e) => setFilterValue(e.target.value)}
                                                    />
                                                    <div className="flex justify-between">
                                                        <Button variant="outline" onClick={() => setActiveFilterColumn(null)}>
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            onClick={() => {
                                                                applyFilter("startDate", filterType, filterValue)
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
                                </TableHead>
                            )}
                            {visibleColumns.includes("endDate") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("endDate")}
                                    >
                                        End Date
                                        {sortColumn === "endDate" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "endDate"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setActiveFilterColumn("endDate")
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.endDate ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter End Date</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="equals" id="equals-endDate" />
                                                            <Label htmlFor="equals-endDate">Equals</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notEquals" id="notEquals-endDate" />
                                                            <Label htmlFor="notEquals-endDate">Does Not Equal</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="beginsWith" id="beginsWith-endDate" />
                                                            <Label htmlFor="beginsWith-endDate">Begins With</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="endsWith" id="endsWith-endDate" />
                                                            <Label htmlFor="endsWith-endDate">Ends With</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="contains" id="contains-endDate" />
                                                            <Label htmlFor="contains-endDate">Contains</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notContains" id="notContains-endDate" />
                                                            <Label htmlFor="notContains-endDate">Does Not Contain</Label>
                                                        </div>
                                                    </RadioGroup>
                                                    <Input
                                                        placeholder="Filter value..."
                                                        value={filterValue}
                                                        onChange={(e) => setFilterValue(e.target.value)}
                                                    />
                                                    <div className="flex justify-between">
                                                        <Button variant="outline" onClick={() => setActiveFilterColumn(null)}>
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            onClick={() => {
                                                                applyFilter("endDate", filterType, filterValue)
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
                                </TableHead>
                            )}
                            {visibleColumns.includes("isActive") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("isActive")}
                                    >
                                        Active
                                        {sortColumn === "isActive" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "isActive"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setActiveFilterColumn("isActive")
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.isActive ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Active Status</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="equals" id="equals-isActive" />
                                                            <Label htmlFor="equals-isActive">Equals</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notEquals" id="notEquals-isActive" />
                                                            <Label htmlFor="notEquals-isActive">Does Not Equal</Label>
                                                        </div>
                                                    </RadioGroup>
                                                    <Select value={filterValue} onValueChange={setFilterValue}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select value" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="true">Active</SelectItem>
                                                            <SelectItem value="false">Inactive</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <div className="flex justify-between">
                                                        <Button variant="outline" onClick={() => setActiveFilterColumn(null)}>
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            onClick={() => {
                                                                applyFilter("isActive", filterType, filterValue)
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
                                </TableHead>
                            )}
                            {visibleColumns.includes("hasAttachment") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("hasAttachment")}
                                    >
                                        Attachment
                                        {sortColumn === "hasAttachment" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "hasAttachment"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setActiveFilterColumn("hasAttachment")
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.hasAttachment ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Attachment</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="equals" id="equals-hasAttachment" />
                                                            <Label htmlFor="equals-hasAttachment">Equals</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notEquals" id="notEquals-hasAttachment" />
                                                            <Label htmlFor="notEquals-hasAttachment">Does Not Equal</Label>
                                                        </div>
                                                    </RadioGroup>
                                                    <Select value={filterValue} onValueChange={setFilterValue}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select value" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="true">Has Attachment</SelectItem>
                                                            <SelectItem value="false">No Attachment</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <div className="flex justify-between">
                                                        <Button variant="outline" onClick={() => setActiveFilterColumn(null)}>
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            onClick={() => {
                                                                applyFilter("hasAttachment", filterType, filterValue)
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
                                </TableHead>
                            )}
                            <TableHead className="w-10">
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredFeeTypes.length > 0 ? (
                            filteredFeeTypes.map((feeType) => (
                                <TableRow key={feeType.id} className="hover:bg-gray-50 transition-colors">
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedFeeTypes.includes(feeType.id)}
                                            onCheckedChange={() => handleFeeTypeSelection(feeType.id)}
                                        />
                                    </TableCell>
                                    {visibleColumns.includes("feeType") && (
                                        <TableCell>
                                            <button
                                                className="text-green-600 hover:underline focus:outline-none font-medium"
                                                onClick={() => handleEditFeeType(feeType)}
                                            >
                                                {feeType.feeType}
                                            </button>
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes("description") && <TableCell>{feeType.description}</TableCell>}
                                    {visibleColumns.includes("startDate") && <TableCell>{feeType.startDate}</TableCell>}
                                    {visibleColumns.includes("endDate") && <TableCell>{feeType.endDate}</TableCell>}
                                    {visibleColumns.includes("isActive") && (
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    feeType.isActive
                                                        ? "bg-green-50 text-green-700 border-green-200"
                                                        : "bg-red-50 text-red-700 border-red-200"
                                                }
                                            >
                                                {feeType.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes("hasAttachment") && (
                                        <TableCell>
                                            {feeType.hasAttachment ? (
                                                <div className="flex items-center">
                                                    <Paperclip className="h-4 w-4 text-green-600 mr-1" />
                                                    <span className="text-sm">Yes</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-500">No</span>
                                            )}
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleEditFeeType(feeType)}>Edit</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={visibleColumns.length + 2} className="text-center py-8">
                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                        <DollarSign className="h-12 w-12 mb-2 text-gray-300" />
                                        <h3 className="text-lg font-medium">No fee types found</h3>
                                        <p className="text-sm">Try adjusting your search or filter criteria.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-4">
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
                    <span>of {Math.max(1, Math.ceil(filteredFeeTypes.length / 10))}</span>
                    <span>
                        Displaying {filteredFeeTypes.length > 0 ? `1 - ${Math.min(filteredFeeTypes.length, 10)}` : "0"} of{" "}
                        {filteredFeeTypes.length}
                    </span>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {selectedFeeTypes.length} fee type(s)? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteFeeTypes}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Fee Type Dialog */}
            <Dialog open={isAddFeeTypeDialogOpen} onOpenChange={setIsAddFeeTypeDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Add New Fee Type</DialogTitle>
                        <DialogDescription>Create a new fee type with the form below.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="feeType" className="text-right">
                                Fee Type
                            </Label>
                            <Input
                                id="feeType"
                                value={newFeeType.feeType}
                                onChange={(e) => setNewFeeType({ ...newFeeType, feeType: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Input
                                id="description"
                                value={newFeeType.description}
                                onChange={(e) => setNewFeeType({ ...newFeeType, description: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="startDate" className="text-right">
                                Start Date
                            </Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={newFeeType.startDate}
                                onChange={(e) => setNewFeeType({ ...newFeeType, startDate: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="endDate" className="text-right">
                                End Date
                            </Label>
                            <Input
                                id="endDate"
                                type="date"
                                value={newFeeType.endDate}
                                onChange={(e) => setNewFeeType({ ...newFeeType, endDate: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <div className="text-right">Status</div>
                            <div className="col-span-3 flex items-center gap-2">
                                <Checkbox
                                    id="isActive"
                                    checked={newFeeType.isActive}
                                    onCheckedChange={(checked) => setNewFeeType({ ...newFeeType, isActive: !!checked })}
                                />
                                <Label htmlFor="isActive">Active</Label>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <div className="text-right">Attachment</div>
                            <div className="col-span-3 flex items-center gap-2">
                                <Checkbox
                                    id="hasAttachment"
                                    checked={newFeeType.hasAttachment}
                                    onCheckedChange={(checked) => setNewFeeType({ ...newFeeType, hasAttachment: !!checked })}
                                />
                                <Label htmlFor="hasAttachment">Has Attachment</Label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddFeeTypeDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveNewFeeType} className="bg-green-600 hover:bg-green-700">
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Fee Type Dialog */}
            <Dialog open={isEditFeeTypeDialogOpen} onOpenChange={setIsEditFeeTypeDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Fee Type</DialogTitle>
                        <DialogDescription>Update the fee type details with the form below.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editFeeType" className="text-right">
                                Fee Type
                            </Label>
                            <Input
                                id="editFeeType"
                                value={editFeeType.feeType}
                                onChange={(e) => setEditFeeType({ ...editFeeType, feeType: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editDescription" className="text-right">
                                Description
                            </Label>
                            <Input
                                id="editDescription"
                                value={editFeeType.description}
                                onChange={(e) => setEditFeeType({ ...editFeeType, description: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editStartDate" className="text-right">
                                Start Date
                            </Label>
                            <Input
                                id="editStartDate"
                                type="date"
                                value={editFeeType.startDate}
                                onChange={(e) => setEditFeeType({ ...editFeeType, startDate: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editEndDate" className="text-right">
                                End Date
                            </Label>
                            <Input
                                id="editEndDate"
                                type="date"
                                value={editFeeType.endDate}
                                onChange={(e) => setEditFeeType({ ...editFeeType, endDate: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <div className="text-right">Status</div>
                            <div className="col-span-3 flex items-center gap-2">
                                <Checkbox
                                    id="editIsActive"
                                    checked={editFeeType.isActive}
                                    onCheckedChange={(checked) => setEditFeeType({ ...editFeeType, isActive: !!checked })}
                                />
                                <Label htmlFor="editIsActive">Active</Label>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <div className="text-right">Attachment</div>
                            <div className="col-span-3 flex items-center gap-2">
                                <Checkbox
                                    id="editHasAttachment"
                                    checked={editFeeType.hasAttachment}
                                    onCheckedChange={(checked) => setEditFeeType({ ...editFeeType, hasAttachment: !!checked })}
                                />
                                <Label htmlFor="editHasAttachment">Has Attachment</Label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditFeeTypeDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveEditFeeType} className="bg-green-600 hover:bg-green-700">
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
