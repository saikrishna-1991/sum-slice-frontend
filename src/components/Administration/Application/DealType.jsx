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
    FileText,
    MoreHorizontal,
    ChevronDown,
    ChevronUp,
    Tag,
    Percent,
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

// Mock deal type data
const dealTypeData = [
    {
        id: 1,
        name: "Buy Deal",
        description: "Standard purchasing agreement",
        category: "Purchase",
        discountRate: 5,
        minValue: 10000,
        maxValue: 100000,
        isActive: true,
    },
    {
        id: 2,
        name: "Sell Deal",
        description: "Standard sales agreement",
        category: "Sales",
        discountRate: 0,
        minValue: 5000,
        maxValue: 50000,
        isActive: true,
    },
    {
        id: 3,
        name: "Bulk Purchase",
        description: "High volume purchasing agreement",
        category: "Purchase",
        discountRate: 10,
        minValue: 50000,
        maxValue: 500000,
        isActive: true,
    },
    {
        id: 4,
        name: "Wholesale",
        description: "Wholesale distribution agreement",
        category: "Sales",
        discountRate: 15,
        minValue: 25000,
        maxValue: 250000,
        isActive: false,
    },
    {
        id: 5,
        name: "Seasonal Promotion",
        description: "Limited time promotional deal",
        category: "Promotion",
        discountRate: 20,
        minValue: 1000,
        maxValue: 50000,
        isActive: true,
    },
]

// Define all available columns
const allColumns = [
    { id: "name", name: "Name", defaultVisible: true },
    { id: "description", name: "Description", defaultVisible: true },
    { id: "category", name: "Category", defaultVisible: true },
    { id: "discountRate", name: "Discount Rate", defaultVisible: true },
    { id: "minValue", name: "Min Value", defaultVisible: true },
    { id: "maxValue", name: "Max Value", defaultVisible: true },
    { id: "isActive", name: "Active", defaultVisible: true },
]

export default function DealTypePage() {
    const { toast } = useToast()
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState("1")
    const [selectedDealTypes, setSelectedDealTypes] = useState([])
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [columnFilters, setColumnFilters] = useState({})
    const [activeFilterColumn, setActiveFilterColumn] = useState(null)
    const [filterValue, setFilterValue] = useState("")
    const [filterType, setFilterType] = useState("contains")
    const [selectedDealType, setSelectedDealType] = useState(null)
    const [isAddDealTypeDialogOpen, setIsAddDealTypeDialogOpen] = useState(false)
    const [isEditDealTypeDialogOpen, setIsEditDealTypeDialogOpen] = useState(false)
    const [isColumnSettingsOpen, setIsColumnSettingsOpen] = useState(false)
    const [visibleColumns, setVisibleColumns] = useState(
        allColumns.filter((col) => col.defaultVisible).map((col) => col.id),
    )
    const [isLoading, setIsLoading] = useState(false)
    const [sortColumn, setSortColumn] = useState(null)
    const [sortDirection, setSortDirection] = useState("asc")
    const [animate, setAnimate] = useState(false)

    // New deal type form state
    const [newDealType, setNewDealType] = useState({
        name: "",
        description: "",
        category: "",
        discountRate: "",
        minValue: "",
        maxValue: "",
        isActive: true,
    })

    // Edit deal type form state
    const [editDealType, setEditDealType] = useState({
        id: 0,
        name: "",
        description: "",
        category: "",
        discountRate: "",
        minValue: "",
        maxValue: "",
        isActive: true,
    })

    // Animation effect
    useEffect(() => {
        setAnimate(true)
    }, [])

    const handleDealTypeSelection = (id) => {
        setSelectedDealTypes((prev) => (prev.includes(id) ? prev.filter((dealId) => dealId !== id) : [...prev, id]))
    }

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedDealTypes(filteredDealTypes.map((deal) => deal.id))
        } else {
            setSelectedDealTypes([])
        }
    }

    const handleDeleteDealTypes = () => {
        console.log("Deleting deal types:", selectedDealTypes)
        toast({
            title: "Deal Types Deleted",
            description: `${selectedDealTypes.length} deal type(s) have been deleted successfully.`,
        })
        setSelectedDealTypes([])
        setIsDeleteDialogOpen(false)
    }

    const handleAddDealType = () => {
        setIsAddDealTypeDialogOpen(true)
    }

    const handleEditDealType = (dealType) => {
        setEditDealType(dealType)
        setIsEditDealTypeDialogOpen(true)
    }

    const handleSaveNewDealType = () => {
        // In a real app, you would save to the database here
        toast({
            title: "Deal Type Added",
            description: "The deal type has been added successfully.",
        })
        setIsAddDealTypeDialogOpen(false)
        setNewDealType({
            name: "",
            description: "",
            category: "",
            discountRate: "",
            minValue: "",
            maxValue: "",
            isActive: true,
        })
    }

    const handleSaveEditDealType = () => {
        // In a real app, you would update the database here
        toast({
            title: "Deal Type Updated",
            description: "The deal type has been updated successfully.",
        })
        setIsEditDealTypeDialogOpen(false)
    }

    const handleExport = () => {
        toast({
            title: "Export Started",
            description: "Your deal type data is being exported. You'll be notified when it's ready.",
        })
    }

    const handleRefresh = () => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast({
                title: "Data Refreshed",
                description: "Deal type data has been refreshed successfully.",
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

    // Format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
        }).format(value)
    }

    // Apply filters and sorting to deal type data
    let filteredDealTypes = dealTypeData.filter((dealType) => {
        // First apply search term
        const matchesSearch =
            dealType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dealType.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dealType.category.toLowerCase().includes(searchTerm.toLowerCase())

        if (!matchesSearch) return false

        // Apply column filters
        for (const [column, filter] of Object.entries(columnFilters)) {
            let value = dealType[column]

            // Handle boolean values
            if (typeof value === "boolean") {
                value = value ? "true" : "false"
            } else if (typeof value === "number") {
                value = value.toString()
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
        filteredDealTypes = [...filteredDealTypes].sort((a, b) => {
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
                    <h1 className="text-2xl font-bold">Deal Type Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and monitor deal types</p>
                </div>
            </div>

            {/* Search and Actions */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                        className="pl-8 w-full md:w-[300px]"
                        placeholder="Search deal types"
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="outline"
                        onClick={handleAddDealType}
                        className="transition-all duration-300 hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Deal Type
                    </Button>

                    <Button
                        variant="outline"
                        className={`transition-all duration-300 ${selectedDealTypes.length === 0 ? "opacity-50" : "hover:bg-red-50 hover:text-red-600 hover:border-red-200"}`}
                        onClick={() => {
                            if (selectedDealTypes.length > 0) {
                                setIsDeleteDialogOpen(true)
                            } else {
                                toast({
                                    title: "No Selection",
                                    description: "Please select at least one deal type to delete.",
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

            {/* Deal Types Table */}
            <Card className="border rounded-lg overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={selectedDealTypes.length > 0 && selectedDealTypes.length === filteredDealTypes.length}
                                    onCheckedChange={handleSelectAll}
                                />
                            </TableHead>
                            {visibleColumns.includes("name") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("name")}
                                    >
                                        Name
                                        {sortColumn === "name" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "name"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setActiveFilterColumn("name")
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.name ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Name</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="equals" id="equals-name" />
                                                            <Label htmlFor="equals-name">Equals</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notEquals" id="notEquals-name" />
                                                            <Label htmlFor="notEquals-name">Does Not Equal</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="beginsWith" id="beginsWith-name" />
                                                            <Label htmlFor="beginsWith-name">Begins With</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="endsWith" id="endsWith-name" />
                                                            <Label htmlFor="endsWith-name">Ends With</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="contains" id="contains-name" />
                                                            <Label htmlFor="contains-name">Contains</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notContains" id="notContains-name" />
                                                            <Label htmlFor="notContains-name">Does Not Contain</Label>
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
                                                                applyFilter("name", filterType, filterValue)
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
                            {visibleColumns.includes("category") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("category")}
                                    >
                                        Category
                                        {sortColumn === "category" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "category"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setActiveFilterColumn("category")
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.category ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Category</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="equals" id="equals-category" />
                                                            <Label htmlFor="equals-category">Equals</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notEquals" id="notEquals-category" />
                                                            <Label htmlFor="notEquals-category">Does Not Equal</Label>
                                                        </div>
                                                    </RadioGroup>
                                                    <Select value={filterValue} onValueChange={setFilterValue}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select value" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Purchase">Purchase</SelectItem>
                                                            <SelectItem value="Sales">Sales</SelectItem>
                                                            <SelectItem value="Promotion">Promotion</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <div className="flex justify-between">
                                                        <Button variant="outline" onClick={() => setActiveFilterColumn(null)}>
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            onClick={() => {
                                                                applyFilter("category", filterType, filterValue)
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
                            {visibleColumns.includes("discountRate") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("discountRate")}
                                    >
                                        Discount Rate
                                        {sortColumn === "discountRate" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "discountRate"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setActiveFilterColumn("discountRate")
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.discountRate ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Discount Rate</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="equals" id="equals-discountRate" />
                                                            <Label htmlFor="equals-discountRate">Equals</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notEquals" id="notEquals-discountRate" />
                                                            <Label htmlFor="notEquals-discountRate">Does Not Equal</Label>
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
                                                                applyFilter("discountRate", filterType, filterValue)
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
                            {visibleColumns.includes("minValue") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("minValue")}
                                    >
                                        Min Value
                                        {sortColumn === "minValue" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "minValue"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setActiveFilterColumn("minValue")
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.minValue ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Min Value</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="equals" id="equals-minValue" />
                                                            <Label htmlFor="equals-minValue">Equals</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notEquals" id="notEquals-minValue" />
                                                            <Label htmlFor="notEquals-minValue">Does Not Equal</Label>
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
                                                                applyFilter("minValue", filterType, filterValue)
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
                            {visibleColumns.includes("maxValue") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("maxValue")}
                                    >
                                        Max Value
                                        {sortColumn === "maxValue" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "maxValue"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setActiveFilterColumn("maxValue")
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.maxValue ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Max Value</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="equals" id="equals-maxValue" />
                                                            <Label htmlFor="equals-maxValue">Equals</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notEquals" id="notEquals-maxValue" />
                                                            <Label htmlFor="notEquals-maxValue">Does Not Equal</Label>
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
                                                                applyFilter("maxValue", filterType, filterValue)
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
                            <TableHead className="w-10">
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredDealTypes.length > 0 ? (
                            filteredDealTypes.map((dealType) => (
                                <TableRow key={dealType.id} className="hover:bg-gray-50 transition-colors">
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedDealTypes.includes(dealType.id)}
                                            onCheckedChange={() => handleDealTypeSelection(dealType.id)}
                                        />
                                    </TableCell>
                                    {visibleColumns.includes("name") && (
                                        <TableCell>
                                            <button
                                                className="text-green-600 hover:underline focus:outline-none font-medium"
                                                onClick={() => handleEditDealType(dealType)}
                                            >
                                                {dealType.name}
                                            </button>
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes("description") && <TableCell>{dealType.description}</TableCell>}
                                    {visibleColumns.includes("category") && (
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    dealType.category === "Purchase"
                                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                                        : dealType.category === "Sales"
                                                            ? "bg-green-50 text-green-700 border-green-200"
                                                            : "bg-amber-50 text-amber-700 border-amber-200"
                                                }
                                            >
                                                <Tag className="h-3 w-3 mr-1" />
                                                {dealType.category}
                                            </Badge>
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes("discountRate") && (
                                        <TableCell>
                                            <div className="flex items-center">
                                                <Percent className="h-4 w-4 text-gray-400 mr-1" />
                                                {dealType.discountRate}%
                                            </div>
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes("minValue") && <TableCell>{formatCurrency(dealType.minValue)}</TableCell>}
                                    {visibleColumns.includes("maxValue") && <TableCell>{formatCurrency(dealType.maxValue)}</TableCell>}
                                    {visibleColumns.includes("isActive") && (
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    dealType.isActive
                                                        ? "bg-green-50 text-green-700 border-green-200"
                                                        : "bg-red-50 text-red-700 border-red-200"
                                                }
                                            >
                                                {dealType.isActive ? "Active" : "Inactive"}
                                            </Badge>
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
                                                <DropdownMenuItem onClick={() => handleEditDealType(dealType)}>Edit</DropdownMenuItem>
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
                                        <FileText className="h-12 w-12 mb-2 text-gray-300" />
                                        <h3 className="text-lg font-medium">No deal types found</h3>
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
                    <span>of {Math.max(1, Math.ceil(filteredDealTypes.length / 10))}</span>
                    <span>
                        Displaying {filteredDealTypes.length > 0 ? `1 - ${Math.min(filteredDealTypes.length, 10)}` : "0"} of{" "}
                        {filteredDealTypes.length}
                    </span>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {selectedDealTypes.length} deal type(s)? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteDealTypes}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Deal Type Dialog */}
            <Dialog open={isAddDealTypeDialogOpen} onOpenChange={setIsAddDealTypeDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Add New Deal Type</DialogTitle>
                        <DialogDescription>Create a new deal type with the form below.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={newDealType.name}
                                onChange={(e) => setNewDealType({ ...newDealType, name: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Input
                                id="description"
                                value={newDealType.description}
                                onChange={(e) => setNewDealType({ ...newDealType, description: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">
                                Category
                            </Label>
                            <Select
                                value={newDealType.category}
                                onValueChange={(value) => setNewDealType({ ...newDealType, category: value })}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Purchase">Purchase</SelectItem>
                                    <SelectItem value="Sales">Sales</SelectItem>
                                    <SelectItem value="Promotion">Promotion</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="discountRate" className="text-right">
                                Discount Rate (%)
                            </Label>
                            <Input
                                id="discountRate"
                                type="number"
                                value={newDealType.discountRate}
                                onChange={(e) => setNewDealType({ ...newDealType, discountRate: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="minValue" className="text-right">
                                Min Value
                            </Label>
                            <Input
                                id="minValue"
                                type="number"
                                value={newDealType.minValue}
                                onChange={(e) => setNewDealType({ ...newDealType, minValue: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="maxValue" className="text-right">
                                Max Value
                            </Label>
                            <Input
                                id="maxValue"
                                type="number"
                                value={newDealType.maxValue}
                                onChange={(e) => setNewDealType({ ...newDealType, maxValue: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <div className="text-right">Status</div>
                            <div className="col-span-3 flex items-center gap-2">
                                <Checkbox
                                    id="isActive"
                                    checked={newDealType.isActive}
                                    onCheckedChange={(checked) => setNewDealType({ ...newDealType, isActive: !!checked })}
                                />
                                <Label htmlFor="isActive">Active</Label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDealTypeDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveNewDealType} className="bg-green-600 hover:bg-green-700">
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Deal Type Dialog */}
            <Dialog open={isEditDealTypeDialogOpen} onOpenChange={setIsEditDealTypeDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Deal Type</DialogTitle>
                        <DialogDescription>Update the deal type details with the form below.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editName" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="editName"
                                value={editDealType.name}
                                onChange={(e) => setEditDealType({ ...editDealType, name: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editDescription" className="text-right">
                                Description
                            </Label>
                            <Input
                                id="editDescription"
                                value={editDealType.description}
                                onChange={(e) => setEditDealType({ ...editDealType, description: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editCategory" className="text-right">
                                Category
                            </Label>
                            <Select
                                value={editDealType.category}
                                onValueChange={(value) => setEditDealType({ ...editDealType, category: value })}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Purchase">Purchase</SelectItem>
                                    <SelectItem value="Sales">Sales</SelectItem>
                                    <SelectItem value="Promotion">Promotion</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editDiscountRate" className="text-right">
                                Discount Rate (%)
                            </Label>
                            <Input
                                id="editDiscountRate"
                                type="number"
                                value={editDealType.discountRate}
                                onChange={(e) => setEditDealType({ ...editDealType, discountRate: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editMinValue" className="text-right">
                                Min Value
                            </Label>
                            <Input
                                id="editMinValue"
                                type="number"
                                value={editDealType.minValue}
                                onChange={(e) => setEditDealType({ ...editDealType, minValue: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editMaxValue" className="text-right">
                                Max Value
                            </Label>
                            <Input
                                id="editMaxValue"
                                type="number"
                                value={editDealType.maxValue}
                                onChange={(e) => setEditDealType({ ...editDealType, maxValue: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <div className="text-right">Status</div>
                            <div className="col-span-3 flex items-center gap-2">
                                <Checkbox
                                    id="editIsActive"
                                    checked={editDealType.isActive}
                                    onCheckedChange={(checked) => setEditDealType({ ...editDealType, isActive: !!checked })}
                                />
                                <Label htmlFor="editIsActive">Active</Label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDealTypeDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveEditDealType} className="bg-green-600 hover:bg-green-700">
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
