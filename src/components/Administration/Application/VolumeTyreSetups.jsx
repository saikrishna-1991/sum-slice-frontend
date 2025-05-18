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
    Layers,
    MoreHorizontal,
    ChevronDown,
    ChevronUp,
    BarChart3,
    ArrowUpDown,
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

// Mock volume tier data
const volumeTierData = [
    {
        id: 1,
        name: "Bronze Tier",
        minVolume: 10000,
        maxVolume: 49999,
        discountPercentage: 5,
        applicableDealTypes: ["Buy Deal", "Sell Deal"],
        isActive: true,
    },
    {
        id: 2,
        name: "Silver Tier",
        minVolume: 50000,
        maxVolume: 99999,
        discountPercentage: 10,
        applicableDealTypes: ["Buy Deal", "Sell Deal", "Bulk Purchase"],
        isActive: true,
    },
    {
        id: 3,
        name: "Gold Tier",
        minVolume: 100000,
        maxVolume: 499999,
        discountPercentage: 15,
        applicableDealTypes: ["Buy Deal", "Sell Deal", "Bulk Purchase", "Wholesale"],
        isActive: true,
    },
    {
        id: 4,
        name: "Platinum Tier",
        minVolume: 500000,
        maxVolume: 999999,
        discountPercentage: 20,
        applicableDealTypes: ["Buy Deal", "Sell Deal", "Bulk Purchase", "Wholesale"],
        isActive: true,
    },
    {
        id: 5,
        name: "Diamond Tier",
        minVolume: 1000000,
        maxVolume: 9999999,
        discountPercentage: 25,
        applicableDealTypes: ["Buy Deal", "Sell Deal", "Bulk Purchase", "Wholesale", "Seasonal Promotion"],
        isActive: false,
    },
]

// Define all available columns
const allColumns = [
    { id: "name", name: "Name", defaultVisible: true },
    { id: "minVolume", name: "Min Volume", defaultVisible: true },
    { id: "maxVolume", name: "Max Volume", defaultVisible: true },
    { id: "discountPercentage", name: "Discount %", defaultVisible: true },
    { id: "applicableDealTypes", name: "Applicable Deal Types", defaultVisible: true },
    { id: "isActive", name: "Active", defaultVisible: true },
]

export default function VolumeTierSetupsPage() {
    const { toast } = useToast()
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState("1")
    const [selectedVolumeTiers, setSelectedVolumeTiers] = useState([])
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [columnFilters, setColumnFilters] = useState({})
    const [activeFilterColumn, setActiveFilterColumn] = useState(null)
    const [filterValue, setFilterValue] = useState("")
    const [filterType, setFilterType] = useState("contains")
    const [selectedVolumeTier, setSelectedVolumeTier] = useState(null)
    const [isAddVolumeTierDialogOpen, setIsAddVolumeTierDialogOpen] = useState(false)
    const [isEditVolumeTierDialogOpen, setIsEditVolumeTierDialogOpen] = useState(false)
    const [isColumnSettingsOpen, setIsColumnSettingsOpen] = useState(false)
    const [visibleColumns, setVisibleColumns] = useState(
        allColumns.filter((col) => col.defaultVisible).map((col) => col.id),
    )
    const [isLoading, setIsLoading] = useState(false)
    const [sortColumn, setSortColumn] = useState(null)
    const [sortDirection, setSortDirection] = useState("asc")
    const [animate, setAnimate] = useState(false)

    // New volume tier form state
    const [newVolumeTier, setNewVolumeTier] = useState({
        name: "",
        minVolume: "",
        maxVolume: "",
        discountPercentage: "",
        applicableDealTypes: [],
        isActive: true,
    })

    // Edit volume tier form state
    const [editVolumeTier, setEditVolumeTier] = useState({
        id: 0,
        name: "",
        minVolume: "",
        maxVolume: "",
        discountPercentage: "",
        applicableDealTypes: [],
        isActive: true,
    })

    // Available deal types for selection
    const availableDealTypes = ["Buy Deal", "Sell Deal", "Bulk Purchase", "Wholesale", "Seasonal Promotion"]

    // Animation effect
    useEffect(() => {
        setAnimate(true)
    }, [])

    const handleVolumeTierSelection = (id) => {
        setSelectedVolumeTiers((prev) => (prev.includes(id) ? prev.filter((tierId) => tierId !== id) : [...prev, id]))
    }

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedVolumeTiers(filteredVolumeTiers.map((tier) => tier.id))
        } else {
            setSelectedVolumeTiers([])
        }
    }

    const handleDeleteVolumeTiers = () => {
        console.log("Deleting volume tiers:", selectedVolumeTiers)
        toast({
            title: "Volume Tiers Deleted",
            description: `${selectedVolumeTiers.length} volume tier(s) have been deleted successfully.`,
        })
        setSelectedVolumeTiers([])
        setIsDeleteDialogOpen(false)
    }

    const handleAddVolumeTier = () => {
        setIsAddVolumeTierDialogOpen(true)
    }

    const handleEditVolumeTier = (volumeTier) => {
        setEditVolumeTier(volumeTier)
        setIsEditVolumeTierDialogOpen(true)
    }

    const handleSaveNewVolumeTier = () => {
        // In a real app, you would save to the database here
        toast({
            title: "Volume Tier Added",
            description: "The volume tier has been added successfully.",
        })
        setIsAddVolumeTierDialogOpen(false)
        setNewVolumeTier({
            name: "",
            minVolume: "",
            maxVolume: "",
            discountPercentage: "",
            applicableDealTypes: [],
            isActive: true,
        })
    }

    const handleSaveEditVolumeTier = () => {
        // In a real app, you would update the database here
        toast({
            title: "Volume Tier Updated",
            description: "The volume tier has been updated successfully.",
        })
        setIsEditVolumeTierDialogOpen(false)
    }

    const handleExport = () => {
        toast({
            title: "Export Started",
            description: "Your volume tier data is being exported. You'll be notified when it's ready.",
        })
    }

    const handleRefresh = () => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast({
                title: "Data Refreshed",
                description: "Volume tier data has been refreshed successfully.",
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

    // Apply filters and sorting to volume tier data
    let filteredVolumeTiers = volumeTierData.filter((volumeTier) => {
        // First apply search term
        const matchesSearch = volumeTier.name.toLowerCase().includes(searchTerm.toLowerCase())

        if (!matchesSearch) return false

        // Apply column filters
        for (const [column, filter] of Object.entries(columnFilters)) {
            let value = volumeTier[column]

            // Handle boolean values
            if (typeof value === "boolean") {
                value = value ? "true" : "false"
            } else if (typeof value === "number") {
                value = value.toString()
            } else if (Array.isArray(value)) {
                value = value.join(", ").toLowerCase()
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
        filteredVolumeTiers = [...filteredVolumeTiers].sort((a, b) => {
            let valueA = a[sortColumn]
            let valueB = b[sortColumn]

            // Handle undefined values
            if (valueA === undefined) valueA = ""
            if (valueB === undefined) valueB = ""

            // Handle arrays
            if (Array.isArray(valueA)) valueA = valueA.join(", ")
            if (Array.isArray(valueB)) valueB = valueB.join(", ")

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
                    <h1 className="text-2xl font-bold">Volume Tier Setups</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and monitor volume tiers</p>
                </div>
            </div>

            {/* Search and Actions */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                        className="pl-8 w-full md:w-[300px]"
                        placeholder="Search volume tiers"
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="outline"
                        onClick={handleAddVolumeTier}
                        className="transition-all duration-300 hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Volume Tier
                    </Button>

                    <Button
                        variant="outline"
                        className={`transition-all duration-300 ${selectedVolumeTiers.length === 0 ? "opacity-50" : "hover:bg-red-50 hover:text-red-600 hover:border-red-200"}`}
                        onClick={() => {
                            if (selectedVolumeTiers.length > 0) {
                                setIsDeleteDialogOpen(true)
                            } else {
                                toast({
                                    title: "No Selection",
                                    description: "Please select at least one volume tier to delete.",
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

            {/* Volume Tiers Table */}
            <Card className="border rounded-lg overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={selectedVolumeTiers.length > 0 && selectedVolumeTiers.length === filteredVolumeTiers.length}
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
                            {visibleColumns.includes("minVolume") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("minVolume")}
                                    >
                                        Min Volume
                                        {sortColumn === "minVolume" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "minVolume"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setActiveFilterColumn("minVolume")
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.minVolume ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Min Volume</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="equals" id="equals-minVolume" />
                                                            <Label htmlFor="equals-minVolume">Equals</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notEquals" id="notEquals-minVolume" />
                                                            <Label htmlFor="notEquals-minVolume">Does Not Equal</Label>
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
                                                                applyFilter("minVolume", filterType, filterValue)
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
                            {visibleColumns.includes("maxVolume") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("maxVolume")}
                                    >
                                        Max Volume
                                        {sortColumn === "maxVolume" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "maxVolume"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setActiveFilterColumn("maxVolume")
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.maxVolume ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Max Volume</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="equals" id="equals-maxVolume" />
                                                            <Label htmlFor="equals-maxVolume">Equals</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notEquals" id="notEquals-maxVolume" />
                                                            <Label htmlFor="notEquals-maxVolume">Does Not Equal</Label>
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
                                                                applyFilter("maxVolume", filterType, filterValue)
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
                            {visibleColumns.includes("discountPercentage") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("discountPercentage")}
                                    >
                                        Discount %
                                        {sortColumn === "discountPercentage" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "discountPercentage"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setActiveFilterColumn("discountPercentage")
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.discountPercentage ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Discount Percentage</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="equals" id="equals-discountPercentage" />
                                                            <Label htmlFor="equals-discountPercentage">Equals</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notEquals" id="notEquals-discountPercentage" />
                                                            <Label htmlFor="notEquals-discountPercentage">Does Not Equal</Label>
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
                                                                applyFilter("discountPercentage", filterType, filterValue)
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
                            {visibleColumns.includes("applicableDealTypes") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("applicableDealTypes")}
                                    >
                                        Applicable Deal Types
                                        {sortColumn === "applicableDealTypes" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "applicableDealTypes"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setActiveFilterColumn("applicableDealTypes")
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.applicableDealTypes ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Applicable Deal Types</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="contains" id="contains-applicableDealTypes" />
                                                            <Label htmlFor="contains-applicableDealTypes">Contains</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notContains" id="notContains-applicableDealTypes" />
                                                            <Label htmlFor="notContains-applicableDealTypes">Does Not Contain</Label>
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
                                                                applyFilter("applicableDealTypes", filterType, filterValue)
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
                        {filteredVolumeTiers.length > 0 ? (
                            filteredVolumeTiers.map((volumeTier) => (
                                <TableRow key={volumeTier.id} className="hover:bg-gray-50 transition-colors">
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedVolumeTiers.includes(volumeTier.id)}
                                            onCheckedChange={() => handleVolumeTierSelection(volumeTier.id)}
                                        />
                                    </TableCell>
                                    {visibleColumns.includes("name") && (
                                        <TableCell>
                                            <button
                                                className="text-green-600 hover:underline focus:outline-none font-medium"
                                                onClick={() => handleEditVolumeTier(volumeTier)}
                                            >
                                                {volumeTier.name}
                                            </button>
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes("minVolume") && (
                                        <TableCell>
                                            <div className="flex items-center">
                                                <ArrowUpDown className="h-4 w-4 text-gray-400 mr-1" />
                                                {formatCurrency(volumeTier.minVolume)}
                                            </div>
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes("maxVolume") && (
                                        <TableCell>
                                            <div className="flex items-center">
                                                <ArrowUpDown className="h-4 w-4 text-gray-400 mr-1" />
                                                {formatCurrency(volumeTier.maxVolume)}
                                            </div>
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes("discountPercentage") && (
                                        <TableCell>
                                            <div className="flex items-center">
                                                <BarChart3 className="h-4 w-4 text-gray-400 mr-1" />
                                                {volumeTier.discountPercentage}%
                                            </div>
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes("applicableDealTypes") && (
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {volumeTier.applicableDealTypes.map((dealType) => (
                                                    <Badge key={dealType} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                        {dealType}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes("isActive") && (
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    volumeTier.isActive
                                                        ? "bg-green-50 text-green-700 border-green-200"
                                                        : "bg-red-50 text-red-700 border-red-200"
                                                }
                                            >
                                                {volumeTier.isActive ? "Active" : "Inactive"}
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
                                                <DropdownMenuItem onClick={() => handleEditVolumeTier(volumeTier)}>Edit</DropdownMenuItem>
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
                                        <Layers className="h-12 w-12 mb-2 text-gray-300" />
                                        <h3 className="text-lg font-medium">No volume tiers found</h3>
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
                    <span>of {Math.max(1, Math.ceil(filteredVolumeTiers.length / 10))}</span>
                    <span>
                        Displaying {filteredVolumeTiers.length > 0 ? `1 - ${Math.min(filteredVolumeTiers.length, 10)}` : "0"} of{" "}
                        {filteredVolumeTiers.length}
                    </span>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {selectedVolumeTiers.length} volume tier(s)? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteVolumeTiers}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Volume Tier Dialog */}
            <Dialog open={isAddVolumeTierDialogOpen} onOpenChange={setIsAddVolumeTierDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Add New Volume Tier</DialogTitle>
                        <DialogDescription>Create a new volume tier with the form below.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={newVolumeTier.name}
                                onChange={(e) => setNewVolumeTier({ ...newVolumeTier, name: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="minVolume" className="text-right">
                                Min Volume
                            </Label>
                            <Input
                                id="minVolume"
                                type="number"
                                value={newVolumeTier.minVolume}
                                onChange={(e) => setNewVolumeTier({ ...newVolumeTier, minVolume: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="maxVolume" className="text-right">
                                Max Volume
                            </Label>
                            <Input
                                id="maxVolume"
                                type="number"
                                value={newVolumeTier.maxVolume}
                                onChange={(e) => setNewVolumeTier({ ...newVolumeTier, maxVolume: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="discountPercentage" className="text-right">
                                Discount %
                            </Label>
                            <Input
                                id="discountPercentage"
                                type="number"
                                value={newVolumeTier.discountPercentage}
                                onChange={(e) => setNewVolumeTier({ ...newVolumeTier, discountPercentage: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="applicableDealTypes" className="text-right pt-2">
                                Applicable Deal Types
                            </Label>
                            <div className="col-span-3 space-y-2">
                                {availableDealTypes.map((dealType) => (
                                    <div key={dealType} className="flex items-center gap-2">
                                        <Checkbox
                                            id={`dealType-${dealType}`}
                                            checked={newVolumeTier.applicableDealTypes.includes(dealType)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setNewVolumeTier({
                                                        ...newVolumeTier,
                                                        applicableDealTypes: [...newVolumeTier.applicableDealTypes, dealType],
                                                    })
                                                } else {
                                                    setNewVolumeTier({
                                                        ...newVolumeTier,
                                                        applicableDealTypes: newVolumeTier.applicableDealTypes.filter((type) => type !== dealType),
                                                    })
                                                }
                                            }}
                                        />
                                        <Label htmlFor={`dealType-${dealType}`}>{dealType}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <div className="text-right">Status</div>
                            <div className="col-span-3 flex items-center gap-2">
                                <Checkbox
                                    id="isActive"
                                    checked={newVolumeTier.isActive}
                                    onCheckedChange={(checked) => setNewVolumeTier({ ...newVolumeTier, isActive: !!checked })}
                                />
                                <Label htmlFor="isActive">Active</Label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddVolumeTierDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveNewVolumeTier} className="bg-green-600 hover:bg-green-700">
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Volume Tier Dialog */}
            <Dialog open={isEditVolumeTierDialogOpen} onOpenChange={setIsEditVolumeTierDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Volume Tier</DialogTitle>
                        <DialogDescription>Update the volume tier details with the form below.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editName" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="editName"
                                value={editVolumeTier.name}
                                onChange={(e) => setEditVolumeTier({ ...editVolumeTier, name: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editMinVolume" className="text-right">
                                Min Volume
                            </Label>
                            <Input
                                id="editMinVolume"
                                type="number"
                                value={editVolumeTier.minVolume}
                                onChange={(e) => setEditVolumeTier({ ...editVolumeTier, minVolume: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editMaxVolume" className="text-right">
                                Max Volume
                            </Label>
                            <Input
                                id="editMaxVolume"
                                type="number"
                                value={editVolumeTier.maxVolume}
                                onChange={(e) => setEditVolumeTier({ ...editVolumeTier, maxVolume: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editDiscountPercentage" className="text-right">
                                Discount %
                            </Label>
                            <Input
                                id="editDiscountPercentage"
                                type="number"
                                value={editVolumeTier.discountPercentage}
                                onChange={(e) => setEditVolumeTier({ ...editVolumeTier, discountPercentage: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="editApplicableDealTypes" className="text-right pt-2">
                                Applicable Deal Types
                            </Label>
                            <div className="col-span-3 space-y-2">
                                {availableDealTypes.map((dealType) => (
                                    <div key={dealType} className="flex items-center gap-2">
                                        <Checkbox
                                            id={`editDealType-${dealType}`}
                                            checked={editVolumeTier.applicableDealTypes.includes(dealType)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setEditVolumeTier({
                                                        ...editVolumeTier,
                                                        applicableDealTypes: [...editVolumeTier.applicableDealTypes, dealType],
                                                    })
                                                } else {
                                                    setEditVolumeTier({
                                                        ...editVolumeTier,
                                                        applicableDealTypes: editVolumeTier.applicableDealTypes.filter((type) => type !== dealType),
                                                    })
                                                }
                                            }}
                                        />
                                        <Label htmlFor={`editDealType-${dealType}`}>{dealType}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <div className="text-right">Status</div>
                            <div className="col-span-3 flex items-center gap-2">
                                <Checkbox
                                    id="editIsActive"
                                    checked={editVolumeTier.isActive}
                                    onCheckedChange={(checked) => setEditVolumeTier({ ...editVolumeTier, isActive: !!checked })}
                                />
                                <Label htmlFor="editIsActive">Active</Label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditVolumeTierDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveEditVolumeTier} className="bg-green-600 hover:bg-green-700">
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
