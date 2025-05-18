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
    Building,
    MoreHorizontal,
    ChevronDown,
    ChevronUp,
    MapPin,
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

// Mock division data
const divisionData = [
    {
        id: 1,
        divisionName: "Northeast",
        location: "New York, NY",
        manager: "John Smith",
        employeeCount: 120,
        establishedDate: "2020-01-15",
        isActive: true,
    },
    {
        id: 2,
        divisionName: "Southeast",
        location: "Miami, FL",
        manager: "Sarah Johnson",
        employeeCount: 85,
        establishedDate: "2020-03-22",
        isActive: true,
    },
    {
        id: 3,
        divisionName: "Midwest",
        location: "Chicago, IL",
        manager: "Michael Brown",
        employeeCount: 95,
        establishedDate: "2020-05-10",
        isActive: true,
    },
    {
        id: 4,
        divisionName: "Southwest",
        location: "Houston, TX",
        manager: "Emily Davis",
        employeeCount: 75,
        establishedDate: "2021-02-18",
        isActive: false,
    },
    {
        id: 5,
        divisionName: "West",
        location: "Los Angeles, CA",
        manager: "Robert Wilson",
        employeeCount: 110,
        establishedDate: "2021-07-05",
        isActive: true,
    },
]

// Define all available columns
const allColumns = [
    { id: "divisionName", name: "Division Name", defaultVisible: true },
    { id: "location", name: "Location", defaultVisible: true },
    { id: "manager", name: "Manager", defaultVisible: true },
    { id: "employeeCount", name: "Employee Count", defaultVisible: true },
    { id: "establishedDate", name: "Established Date", defaultVisible: true },
    { id: "isActive", name: "Active", defaultVisible: true },
]

export default function DivisionSetupPage() {
    const { toast } = useToast()
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState("1")
    const [selectedDivisions, setSelectedDivisions] = useState([])
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [columnFilters, setColumnFilters] = useState({})
    const [activeFilterColumn, setActiveFilterColumn] = useState(null)
    const [filterValue, setFilterValue] = useState("")
    const [filterType, setFilterType] = useState("contains")
    const [selectedDivision, setSelectedDivision] = useState(null)
    const [isAddDivisionDialogOpen, setIsAddDivisionDialogOpen] = useState(false)
    const [isEditDivisionDialogOpen, setIsEditDivisionDialogOpen] = useState(false)
    const [isColumnSettingsOpen, setIsColumnSettingsOpen] = useState(false)
    const [visibleColumns, setVisibleColumns] = useState(
        allColumns.filter((col) => col.defaultVisible).map((col) => col.id),
    )
    const [isLoading, setIsLoading] = useState(false)
    const [sortColumn, setSortColumn] = useState(null)
    const [sortDirection, setSortDirection] = useState("asc")
    const [animate, setAnimate] = useState(false)

    // New division form state
    const [newDivision, setNewDivision] = useState({
        divisionName: "",
        location: "",
        manager: "",
        employeeCount: "",
        establishedDate: "",
        isActive: true,
    })

    // Edit division form state
    const [editDivision, setEditDivision] = useState({
        id: 0,
        divisionName: "",
        location: "",
        manager: "",
        employeeCount: "",
        establishedDate: "",
        isActive: true,
    })

    // Animation effect
    useEffect(() => {
        setAnimate(true)
    }, [])

    const handleDivisionSelection = (id) => {
        setSelectedDivisions((prev) => (prev.includes(id) ? prev.filter((divId) => divId !== id) : [...prev, id]))
    }

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedDivisions(filteredDivisions.map((div) => div.id))
        } else {
            setSelectedDivisions([])
        }
    }

    const handleDeleteDivisions = () => {
        console.log("Deleting divisions:", selectedDivisions)
        toast({
            title: "Divisions Deleted",
            description: `${selectedDivisions.length} division(s) have been deleted successfully.`,
        })
        setSelectedDivisions([])
        setIsDeleteDialogOpen(false)
    }

    const handleAddDivision = () => {
        setIsAddDivisionDialogOpen(true)
    }

    const handleEditDivision = (division) => {
        setEditDivision(division)
        setIsEditDivisionDialogOpen(true)
    }

    const handleSaveNewDivision = () => {
        // In a real app, you would save to the database here
        toast({
            title: "Division Added",
            description: "The division has been added successfully.",
        })
        setIsAddDivisionDialogOpen(false)
        setNewDivision({
            divisionName: "",
            location: "",
            manager: "",
            employeeCount: "",
            establishedDate: "",
            isActive: true,
        })
    }

    const handleSaveEditDivision = () => {
        // In a real app, you would update the database here
        toast({
            title: "Division Updated",
            description: "The division has been updated successfully.",
        })
        setIsEditDivisionDialogOpen(false)
    }

    const handleExport = () => {
        toast({
            title: "Export Started",
            description: "Your division data is being exported. You'll be notified when it's ready.",
        })
    }

    const handleRefresh = () => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast({
                title: "Data Refreshed",
                description: "Division data has been refreshed successfully.",
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

    // Apply filters and sorting to division data
    let filteredDivisions = divisionData.filter((division) => {
        // First apply search term
        const matchesSearch =
            division.divisionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            division.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            division.manager.toLowerCase().includes(searchTerm.toLowerCase())

        if (!matchesSearch) return false

        // Apply column filters
        for (const [column, filter] of Object.entries(columnFilters)) {
            let value = division[column]

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
        filteredDivisions = [...filteredDivisions].sort((a, b) => {
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
                    <h1 className="text-2xl font-bold">Division Setup</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and monitor divisions</p>
                </div>
            </div>

            {/* Search and Actions */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                        className="pl-8 w-full md:w-[300px]"
                        placeholder="Search divisions"
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="outline"
                        onClick={handleAddDivision}
                        className="transition-all duration-300 hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Division
                    </Button>

                    <Button
                        variant="outline"
                        className={`transition-all duration-300 ${selectedDivisions.length === 0 ? "opacity-50" : "hover:bg-red-50 hover:text-red-600 hover:border-red-200"}`}
                        onClick={() => {
                            if (selectedDivisions.length > 0) {
                                setIsDeleteDialogOpen(true)
                            } else {
                                toast({
                                    title: "No Selection",
                                    description: "Please select at least one division to delete.",
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

            {/* Divisions Table */}
            <Card className="border rounded-lg overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={selectedDivisions.length > 0 && selectedDivisions.length === filteredDivisions.length}
                                    onCheckedChange={handleSelectAll}
                                />
                            </TableHead>
                            {visibleColumns.includes("divisionName") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("divisionName")}
                                    >
                                        Division Name
                                        {sortColumn === "divisionName" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "divisionName"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setActiveFilterColumn("divisionName")
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.divisionName ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Division Name</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="equals" id="equals-divisionName" />
                                                            <Label htmlFor="equals-divisionName">Equals</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notEquals" id="notEquals-divisionName" />
                                                            <Label htmlFor="notEquals-divisionName">Does Not Equal</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="beginsWith" id="beginsWith-divisionName" />
                                                            <Label htmlFor="beginsWith-divisionName">Begins With</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="endsWith" id="endsWith-divisionName" />
                                                            <Label htmlFor="endsWith-divisionName">Ends With</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="contains" id="contains-divisionName" />
                                                            <Label htmlFor="contains-divisionName">Contains</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notContains" id="notContains-divisionName" />
                                                            <Label htmlFor="notContains-divisionName">Does Not Contain</Label>
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
                                                                applyFilter("divisionName", filterType, filterValue)
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
                            {visibleColumns.includes("location") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("location")}
                                    >
                                        Location
                                        {sortColumn === "location" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "location"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setActiveFilterColumn("location")
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.location ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Location</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="equals" id="equals-location" />
                                                            <Label htmlFor="equals-location">Equals</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notEquals" id="notEquals-location" />
                                                            <Label htmlFor="notEquals-location">Does Not Equal</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="beginsWith" id="beginsWith-location" />
                                                            <Label htmlFor="beginsWith-location">Begins With</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="endsWith" id="endsWith-location" />
                                                            <Label htmlFor="endsWith-location">Ends With</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="contains" id="contains-location" />
                                                            <Label htmlFor="contains-location">Contains</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notContains" id="notContains-location" />
                                                            <Label htmlFor="notContains-location">Does Not Contain</Label>
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
                                                                applyFilter("location", filterType, filterValue)
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
                            {visibleColumns.includes("manager") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("manager")}
                                    >
                                        Manager
                                        {sortColumn === "manager" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "manager"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setActiveFilterColumn("manager")
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.manager ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Manager</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="equals" id="equals-manager" />
                                                            <Label htmlFor="equals-manager">Equals</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notEquals" id="notEquals-manager" />
                                                            <Label htmlFor="notEquals-manager">Does Not Equal</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="beginsWith" id="beginsWith-manager" />
                                                            <Label htmlFor="beginsWith-manager">Begins With</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="endsWith" id="endsWith-manager" />
                                                            <Label htmlFor="endsWith-manager">Ends With</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="contains" id="contains-manager" />
                                                            <Label htmlFor="contains-manager">Contains</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notContains" id="notContains-manager" />
                                                            <Label htmlFor="notContains-manager">Does Not Contain</Label>
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
                                                                applyFilter("manager", filterType, filterValue)
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
                            {visibleColumns.includes("employeeCount") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("employeeCount")}
                                    >
                                        Employee Count
                                        {sortColumn === "employeeCount" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "employeeCount"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setActiveFilterColumn("employeeCount")
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.employeeCount ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Employee Count</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="equals" id="equals-employeeCount" />
                                                            <Label htmlFor="equals-employeeCount">Equals</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notEquals" id="notEquals-employeeCount" />
                                                            <Label htmlFor="notEquals-employeeCount">Does Not Equal</Label>
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
                                                                applyFilter("employeeCount", filterType, filterValue)
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
                            {visibleColumns.includes("establishedDate") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("establishedDate")}
                                    >
                                        Established Date
                                        {sortColumn === "establishedDate" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "establishedDate"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setActiveFilterColumn("establishedDate")
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.establishedDate ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Established Date</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="equals" id="equals-establishedDate" />
                                                            <Label htmlFor="equals-establishedDate">Equals</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notEquals" id="notEquals-establishedDate" />
                                                            <Label htmlFor="notEquals-establishedDate">Does Not Equal</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="beginsWith" id="beginsWith-establishedDate" />
                                                            <Label htmlFor="beginsWith-establishedDate">Begins With</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="endsWith" id="endsWith-establishedDate" />
                                                            <Label htmlFor="endsWith-establishedDate">Ends With</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="contains" id="contains-establishedDate" />
                                                            <Label htmlFor="contains-establishedDate">Contains</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notContains" id="notContains-establishedDate" />
                                                            <Label htmlFor="notContains-establishedDate">Does Not Contain</Label>
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
                                                                applyFilter("establishedDate", filterType, filterValue)
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
                        {filteredDivisions.length > 0 ? (
                            filteredDivisions.map((division) => (
                                <TableRow key={division.id} className="hover:bg-gray-50 transition-colors">
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedDivisions.includes(division.id)}
                                            onCheckedChange={() => handleDivisionSelection(division.id)}
                                        />
                                    </TableCell>
                                    {visibleColumns.includes("divisionName") && (
                                        <TableCell>
                                            <button
                                                className="text-green-600 hover:underline focus:outline-none font-medium"
                                                onClick={() => handleEditDivision(division)}
                                            >
                                                {division.divisionName}
                                            </button>
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes("location") && (
                                        <TableCell>
                                            <div className="flex items-center">
                                                <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                                                {division.location}
                                            </div>
                                        </TableCell>
                                    )}
                                    {visibleColumns.includes("manager") && <TableCell>{division.manager}</TableCell>}
                                    {visibleColumns.includes("employeeCount") && <TableCell>{division.employeeCount}</TableCell>}
                                    {visibleColumns.includes("establishedDate") && <TableCell>{division.establishedDate}</TableCell>}
                                    {visibleColumns.includes("isActive") && (
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    division.isActive
                                                        ? "bg-green-50 text-green-700 border-green-200"
                                                        : "bg-red-50 text-red-700 border-red-200"
                                                }
                                            >
                                                {division.isActive ? "Active" : "Inactive"}
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
                                                <DropdownMenuItem onClick={() => handleEditDivision(division)}>Edit</DropdownMenuItem>
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
                                        <Building className="h-12 w-12 mb-2 text-gray-300" />
                                        <h3 className="text-lg font-medium">No divisions found</h3>
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
                    <span>of {Math.max(1, Math.ceil(filteredDivisions.length / 10))}</span>
                    <span>
                        Displaying {filteredDivisions.length > 0 ? `1 - ${Math.min(filteredDivisions.length, 10)}` : "0"} of{" "}
                        {filteredDivisions.length}
                    </span>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {selectedDivisions.length} division(s)? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteDivisions}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Division Dialog */}
            <Dialog open={isAddDivisionDialogOpen} onOpenChange={setIsAddDivisionDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Add New Division</DialogTitle>
                        <DialogDescription>Create a new division with the form below.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="divisionName" className="text-right">
                                Division Name
                            </Label>
                            <Input
                                id="divisionName"
                                value={newDivision.divisionName}
                                onChange={(e) => setNewDivision({ ...newDivision, divisionName: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="location" className="text-right">
                                Location
                            </Label>
                            <Input
                                id="location"
                                value={newDivision.location}
                                onChange={(e) => setNewDivision({ ...newDivision, location: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="manager" className="text-right">
                                Manager
                            </Label>
                            <Input
                                id="manager"
                                value={newDivision.manager}
                                onChange={(e) => setNewDivision({ ...newDivision, manager: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="employeeCount" className="text-right">
                                Employee Count
                            </Label>
                            <Input
                                id="employeeCount"
                                type="number"
                                value={newDivision.employeeCount}
                                onChange={(e) => setNewDivision({ ...newDivision, employeeCount: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="establishedDate" className="text-right">
                                Established Date
                            </Label>
                            <Input
                                id="establishedDate"
                                type="date"
                                value={newDivision.establishedDate}
                                onChange={(e) => setNewDivision({ ...newDivision, establishedDate: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <div className="text-right">Status</div>
                            <div className="col-span-3 flex items-center gap-2">
                                <Checkbox
                                    id="isActive"
                                    checked={newDivision.isActive}
                                    onCheckedChange={(checked) => setNewDivision({ ...newDivision, isActive: !!checked })}
                                />
                                <Label htmlFor="isActive">Active</Label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDivisionDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveNewDivision} className="bg-green-600 hover:bg-green-700">
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Division Dialog */}
            <Dialog open={isEditDivisionDialogOpen} onOpenChange={setIsEditDivisionDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Division</DialogTitle>
                        <DialogDescription>Update the division details with the form below.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editDivisionName" className="text-right">
                                Division Name
                            </Label>
                            <Input
                                id="editDivisionName"
                                value={editDivision.divisionName}
                                onChange={(e) => setEditDivision({ ...editDivision, divisionName: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editLocation" className="text-right">
                                Location
                            </Label>
                            <Input
                                id="editLocation"
                                value={editDivision.location}
                                onChange={(e) => setEditDivision({ ...editDivision, location: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editManager" className="text-right">
                                Manager
                            </Label>
                            <Input
                                id="editManager"
                                value={editDivision.manager}
                                onChange={(e) => setEditDivision({ ...editDivision, manager: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editEmployeeCount" className="text-right">
                                Employee Count
                            </Label>
                            <Input
                                id="editEmployeeCount"
                                type="number"
                                value={editDivision.employeeCount}
                                onChange={(e) => setEditDivision({ ...editDivision, employeeCount: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editEstablishedDate" className="text-right">
                                Established Date
                            </Label>
                            <Input
                                id="editEstablishedDate"
                                type="date"
                                value={editDivision.establishedDate}
                                onChange={(e) => setEditDivision({ ...editDivision, establishedDate: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <div className="text-right">Status</div>
                            <div className="col-span-3 flex items-center gap-2">
                                <Checkbox
                                    id="editIsActive"
                                    checked={editDivision.isActive}
                                    onCheckedChange={(checked) => setEditDivision({ ...editDivision, isActive: !!checked })}
                                />
                                <Label htmlFor="editIsActive">Active</Label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDivisionDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveEditDivision} className="bg-green-600 hover:bg-green-700">
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
