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

// Updated division data to match the fields from the image
const divisionData = [
    {
        id: 1,
        divisionType: "Company",
        divisionCode: "601",
        divisionName: "601-MF Rocky Mt",
        parentDivision: "Rocky Mount",
        warehouse: "WH-RM01",
        startDate: "2021-01-01",
        endDate: "",
        accountedCurrency: "USD",
        isActive: true,
    },
    {
        id: 2,
        divisionType: "Branch",
        divisionCode: "602",
        divisionName: "602-MF Denver",
        parentDivision: "Mountain Region",
        warehouse: "WH-DN02",
        startDate: "2021-05-15",
        endDate: "",
        accountedCurrency: "USD",
        isActive: true,
    },
    {
        id: 3,
        divisionType: "Branch",
        divisionCode: "603",
        divisionName: "603-MF Phoenix",
        parentDivision: "Southwest",
        warehouse: "WH-PX03",
        startDate: "2022-03-01",
        endDate: "",
        accountedCurrency: "USD",
        isActive: true,
    },
    {
        id: 4,
        divisionType: "Company",
        divisionCode: "604",
        divisionName: "604-MF Seattle",
        parentDivision: "Pacific Northwest",
        warehouse: "WH-ST04",
        startDate: "2020-11-10",
        endDate: "",
        accountedCurrency: "USD",
        isActive: false,
    },
    {
        id: 5,
        divisionType: "Branch",
        divisionCode: "605",
        divisionName: "605-MF Dallas",
        parentDivision: "Texas Region",
        warehouse: "WH-DL05",
        startDate: "2023-06-20",
        endDate: "",
        accountedCurrency: "USD",
        isActive: true,
    },
];


// Define all available columns based on the image
const allColumns = [
    { id: "divisionType", name: "Division Type", defaultVisible: true },
    { id: "divisionCode", name: "Division Code", defaultVisible: true },
    { id: "divisionName", name: "Division Name", defaultVisible: true },
    { id: "parentDivision", name: "Parent Division", defaultVisible: true },
    { id: "warehouse", name: "Warehouse", defaultVisible: true },
    { id: "startDate", name: "Start Date", defaultVisible: true },
    { id: "endDate", name: "End Date", defaultVisible: true },
    { id: "accountedCurrency", name: "Accounted Currency", defaultVisible: true },
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

    // Updated new division form state
    const [newDivision, setNewDivision] = useState({
        divisionType: "",
        divisionCode: "",
        divisionName: "",
        parentDivision: "",
        warehouse: "",
        startDate: "",
        endDate: "",
        accountedCurrency: "",
        isActive: true,
    })

    // Updated edit division form state
    const [editDivision, setEditDivision] = useState({
        id: 0,
        divisionType: "",
        divisionCode: "",
        divisionName: "",
        parentDivision: "",
        warehouse: "",
        startDate: "",
        endDate: "",
        accountedCurrency: "",
        isActive: true,
    })

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
        toast({
            title: "Division Added",
            description: "The division has been added successfully.",
        })
        setIsAddDivisionDialogOpen(false)
        setNewDivision({
            divisionType: "",
            divisionCode: "",
            divisionName: "",
            parentDivision: "",
            warehouse: "",
            startDate: "",
            endDate: "",
            accountedCurrency: "",
            isActive: true,
        })
    }

    const handleSaveEditDivision = () => {
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

    let filteredDivisions = divisionData.filter((division) => {
        const matchesSearch =
            division.divisionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            division.divisionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            division.divisionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            division.parentDivision.toLowerCase().includes(searchTerm.toLowerCase()) ||
            division.warehouse.toLowerCase().includes(searchTerm.toLowerCase()) ||
            division.startDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
            division.endDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
            division.accountedCurrency.toLowerCase().includes(searchTerm.toLowerCase())

        if (!matchesSearch) return false

        for (const [column, filter] of Object.entries(columnFilters)) {
            let value = division[column]

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

    if (sortColumn) {
        filteredDivisions = [...filteredDivisions].sort((a, b) => {
            let valueA = a[sortColumn]
            let valueB = b[sortColumn]

            if (valueA === undefined) valueA = ""
            if (valueB === undefined) valueB = ""

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
                            {visibleColumns.includes("divisionType") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("divisionType")}
                                    >
                                        Division Type
                                        {sortColumn === "divisionType" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "divisionType"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setActiveFilterColumn("divisionType")
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.divisionType ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Division Type</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="equals" id="equals-divisionType" />
                                                            <Label htmlFor="equals-divisionType">Equals</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notEquals" id="notEquals-divisionType" />
                                                            <Label htmlFor="notEquals-divisionType">Does Not Equal</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="beginsWith" id="beginsWith-divisionType" />
                                                            <Label htmlFor="beginsWith-divisionType">Begins With</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="endsWith" id="endsWith-divisionType" />
                                                            <Label htmlFor="endsWith-divisionType">Ends With</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="contains" id="contains-divisionType" />
                                                            <Label htmlFor="contains-divisionType">Contains</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notContains" id="notContains-divisionType" />
                                                            <Label htmlFor="notContains-divisionType">Does Not Contain</Label>
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
                                                                applyFilter("divisionType", filterType, filterValue)
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
                            {visibleColumns.includes("divisionCode") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("divisionCode")}
                                    >
                                        Division Code
                                        {sortColumn === "divisionCode" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "divisionCode"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setActiveFilterColumn("divisionCode")
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.divisionCode ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Division Code</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="equals" id="equals-divisionCode" />
                                                            <Label htmlFor="equals-divisionCode">Equals</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notEquals" id="notEquals-divisionCode" />
                                                            <Label htmlFor="notEquals-divisionCode">Does Not Equal</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="beginsWith" id="beginsWith-divisionCode" />
                                                            <Label htmlFor="beginsWith-divisionCode">Begins With</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="endsWith" id="endsWith-divisionCode" />
                                                            <Label htmlFor="endsWith-divisionCode">Ends With</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="contains" id="contains-divisionCode" />
                                                            <Label htmlFor="contains-divisionCode">Contains</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notContains" id="notContains-divisionCode" />
                                                            <Label htmlFor="notContains-divisionCode">Does Not Contain</Label>
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
                                                                applyFilter("divisionCode", filterType, filterValue)
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
                            {visibleColumns.includes("parentDivision") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("parentDivision")}
                                    >
                                        Parent Division
                                        {sortColumn === "parentDivision" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "parentDivision"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setActiveFilterColumn("parentDivision")
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.parentDivision ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Parent Division</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="equals" id="equals-parentDivision" />
                                                            <Label htmlFor="equals-parentDivision">Equals</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notEquals" id="notEquals-parentDivision" />
                                                            <Label htmlFor="notEquals-parentDivision">Does Not Equal</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="beginsWith" id="beginsWith-parentDivision" />
                                                            <Label htmlFor="beginsWith-parentDivision">Begins With</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="endsWith" id="endsWith-parentDivision" />
                                                            <Label htmlFor="endsWith-parentDivision">Ends With</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="contains" id="contains-parentDivision" />
                                                            <Label htmlFor="contains-parentDivision">Contains</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notContains" id="notContains-parentDivision" />
                                                            <Label htmlFor="notContains-parentDivision">Does Not Contain</Label>
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
                                                                applyFilter("parentDivision", filterType, filterValue)
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
                            {visibleColumns.includes("warehouse") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("warehouse")}
                                    >
                                        Warehouse
                                        {sortColumn === "warehouse" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "warehouse"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setActiveFilterColumn("warehouse")
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.warehouse ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Warehouse</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="equals" id="equals-warehouse" />
                                                            <Label htmlFor="equals-warehouse">Equals</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notEquals" id="notEquals-warehouse" />
                                                            <Label htmlFor="notEquals-warehouse">Does Not Equal</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="beginsWith" id="beginsWith-warehouse" />
                                                            <Label htmlFor="beginsWith-warehouse">Begins With</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="endsWith" id="endsWith-warehouse" />
                                                            <Label htmlFor="endsWith-warehouse">Ends With</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="contains" id="contains-warehouse" />
                                                            <Label htmlFor="contains-warehouse">Contains</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notContains" id="notContains-warehouse" />
                                                            <Label htmlFor="notContains-warehouse">Does Not Contain</Label>
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
                                                                applyFilter("warehouse", filterType, filterValue)
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
                            {visibleColumns.includes("accountedCurrency") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("accountedCurrency")}
                                    >
                                        Accounted Currency
                                        {sortColumn === "accountedCurrency" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "accountedCurrency"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setActiveFilterColumn("accountedCurrency")
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.accountedCurrency ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Accounted Currency</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="equals" id="equals-accountedCurrency" />
                                                            <Label htmlFor="equals-accountedCurrency">Equals</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notEquals" id="notEquals-accountedCurrency" />
                                                            <Label htmlFor="notEquals-accountedCurrency">Does Not Equal</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="beginsWith" id="beginsWith-accountedCurrency" />
                                                            <Label htmlFor="beginsWith-accountedCurrency">Begins With</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="endsWith" id="endsWith-accountedCurrency" />
                                                            <Label htmlFor="endsWith-accountedCurrency">Ends With</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="contains" id="contains-accountedCurrency" />
                                                            <Label htmlFor="contains-accountedCurrency">Contains</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notContains" id="notContains-accountedCurrency" />
                                                            <Label htmlFor="notContains-accountedCurrency">Does Not Contain</Label>
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
                                                                applyFilter("accountedCurrency", filterType, filterValue)
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
                                    {visibleColumns.includes("divisionType") && <TableCell>{division.divisionType}</TableCell>}
                                    {visibleColumns.includes("divisionCode") && <TableCell>{division.divisionCode}</TableCell>}
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
                                    {visibleColumns.includes("parentDivision") && <TableCell>{division.parentDivision}</TableCell>}
                                    {visibleColumns.includes("warehouse") && <TableCell>{division.warehouse}</TableCell>}
                                    {visibleColumns.includes("startDate") && <TableCell>{division.startDate}</TableCell>}
                                    {visibleColumns.includes("endDate") && <TableCell>{division.endDate}</TableCell>}
                                    {visibleColumns.includes("accountedCurrency") && <TableCell>{division.accountedCurrency}</TableCell>}
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

            <Dialog open={isAddDivisionDialogOpen} onOpenChange={setIsAddDivisionDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Add New Division</DialogTitle>
                        <DialogDescription>Create a new division with the form below.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="divisionType" className="text-right">
                                Division Type
                            </Label>
                            <Input
                                id="divisionType"
                                value={newDivision.divisionType}
                                onChange={(e) => setNewDivision({ ...newDivision, divisionType: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="divisionCode" className="text-right">
                                Division Code
                            </Label>
                            <Input
                                id="divisionCode"
                                value={newDivision.divisionCode}
                                onChange={(e) => setNewDivision({ ...newDivision, divisionCode: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
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
                            <Label htmlFor="parentDivision" className="text-right">
                                Parent Division
                            </Label>
                            <Input
                                id="parentDivision"
                                value={newDivision.parentDivision}
                                onChange={(e) => setNewDivision({ ...newDivision, parentDivision: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="warehouse" className="text-right">
                                Warehouse
                            </Label>
                            <Input
                                id="warehouse"
                                value={newDivision.warehouse}
                                onChange={(e) => setNewDivision({ ...newDivision, warehouse: e.target.value })}
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
                                value={newDivision.startDate}
                                onChange={(e) => setNewDivision({ ...newDivision, startDate: e.target.value })}
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
                                value={newDivision.endDate}
                                onChange={(e) => setNewDivision({ ...newDivision, endDate: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="accountedCurrency" className="text-right">
                                Accounted Currency
                            </Label>
                            <Input
                                id="accountedCurrency"
                                value={newDivision.accountedCurrency}
                                onChange={(e) => setNewDivision({ ...newDivision, accountedCurrency: e.target.value })}
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

            <Dialog open={isEditDivisionDialogOpen} onOpenChange={setIsEditDivisionDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Division</DialogTitle>
                        <DialogDescription>Update the division details with the form below.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editDivisionType" className="text-right">
                                Division Type
                            </Label>
                            <Input
                                id="editDivisionType"
                                value={editDivision.divisionType}
                                onChange={(e) => setEditDivision({ ...editDivision, divisionType: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editDivisionCode" className="text-right">
                                Division Code
                            </Label>
                            <Input
                                id="editDivisionCode"
                                value={editDivision.divisionCode}
                                onChange={(e) => setEditDivision({ ...editDivision, divisionCode: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
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
                            <Label htmlFor="editParentDivision" className="text-right">
                                Parent Division
                            </Label>
                            <Input
                                id="editParentDivision"
                                value={editDivision.parentDivision}
                                onChange={(e) => setEditDivision({ ...editDivision, parentDivision: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editWarehouse" className="text-right">
                                Warehouse
                            </Label>
                            <Input
                                id="editWarehouse"
                                value={editDivision.warehouse}
                                onChange={(e) => setEditDivision({ ...editDivision, warehouse: e.target.value })}
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
                                value={editDivision.startDate}
                                onChange={(e) => setEditDivision({ ...editDivision, startDate: e.target.value })}
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
                                value={editDivision.endDate}
                                onChange={(e) => setEditDivision({ ...editDivision, endDate: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editAccountedCurrency" className="text-right">
                                Accounted Currency
                            </Label>
                            <Input
                                id="editAccountedCurrency"
                                value={editDivision.accountedCurrency}
                                onChange={(e) => setEditDivision({ ...editDivision, accountedCurrency: e.target.value })}
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