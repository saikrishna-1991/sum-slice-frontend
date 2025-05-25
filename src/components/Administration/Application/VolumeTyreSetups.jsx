"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// Mock volume tier data
const volumeTierData = [
    {
        id: 1,
        name: "Admin Fee",
        tieringCriteria: "Administration Fee",
        integrationClass: "613 MFS Rookey",
        tierTargetValue: "Percent",
        targetAggregation: "Purchase Cost",
        targetDetermination: "Sum",
        tierPeriod: "Annual",
        periodDetermination: "Same Period",
        tierPeriodValue: "1",
        tierBreak: "Back to Dollar 1",
        isActive: true,
    },
    {
        id: 2,
        name: "Annual Growth",
        tieringCriteria: "Tiered Growth",
        integrationClass: "Buy Side Allowance",
        tierTargetValue: "Percent",
        targetAggregation: "Purchase Cost",
        targetDetermination: "Sum",
        tierPeriod: "Annual",
        periodDetermination: "Same Period",
        tierPeriodValue: "1",
        tierBreak: "Back to Dollar 1",
        isActive: true,
    },
    {
        id: 3,
        name: "Quarterly Rebate",
        tieringCriteria: "Flat Rate",
        integrationClass: "512 MFS Allowance",
        tierTargetValue: "Dollar",
        targetAggregation: "Sales Volume",
        targetDetermination: "Average",
        tierPeriod: "Quarterly",
        periodDetermination: "Calendar Quarter",
        tierPeriodValue: "3",
        tierBreak: "Incremental",
        isActive: true,
    },
    {
        id: 4,
        name: "Monthly Incentive",
        tieringCriteria: "Stepped Rate",
        integrationClass: "721 Sales Incentive",
        tierTargetValue: "Units",
        targetAggregation: "Unit Count",
        targetDetermination: "Total",
        tierPeriod: "Monthly",
        periodDetermination: "Calendar Month",
        tierPeriodValue: "1",
        tierBreak: "Incremental",
        isActive: false,
    },
    {
        id: 5,
        name: "Seasonal Promotion",
        tieringCriteria: "Progressive",
        integrationClass: "815 Promotion",
        tierTargetValue: "Percent",
        targetAggregation: "Gross Margin",
        targetDetermination: "Weighted Average",
        tierPeriod: "Custom",
        periodDetermination: "Date Range",
        tierPeriodValue: "90",
        tierBreak: "Back to Threshold",
        isActive: true,
    },
];

// Define all available columns
const allColumns = [
    { id: "name", name: "Volume Tier Name", defaultVisible: true },
    { id: "tieringCriteria", name: "Tiering Criteria", defaultVisible: true },
    { id: "integrationClass", name: "Integration Class", defaultVisible: true },
    { id: "tierTargetValue", name: "Tier Target Value", defaultVisible: true },
    { id: "targetAggregation", name: "Target Aggregation", defaultVisible: true },
    { id: "targetDetermination", name: "Target Determination", defaultVisible: true },
    { id: "tierPeriod", name: "Tier Period", defaultVisible: true },
    { id: "periodDetermination", name: "Period Determination", defaultVisible: true },
    { id: "tierPeriodValue", name: "Tier Period Value", defaultVisible: true },
    { id: "tierBreak", name: "Tier Break", defaultVisible: true },
    { id: "isActive", name: "Active", defaultVisible: true },
];

export default function VolumeTierSetupsPage() {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState("1");
    const [pageSize, setPageSize] = useState("10");
    const [selectedVolumeTiers, setSelectedVolumeTiers] = useState([]);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [columnFilters, setColumnFilters] = useState({});
    const [activeFilterColumn, setActiveFilterColumn] = useState(null);
    const [filterValue, setFilterValue] = useState("");
    const [filterType, setFilterType] = useState("contains");
    const [isAddVolumeTierDialogOpen, setIsAddVolumeTierDialogOpen] = useState(false);
    const [isEditVolumeTierDialogOpen, setIsEditVolumeTierDialogOpen] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState(
        allColumns.filter((col) => col.defaultVisible).map((col) => col.id),
    );
    const [isLoading, setIsLoading] = useState(false);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc");
    const [animate, setAnimate] = useState(false);

    // New volume tier form state
    const [newVolumeTier, setNewVolumeTier] = useState({
        name: "",
        tieringCriteria: "",
        integrationClass: "",
        tierTargetValue: "",
        targetAggregation: "",
        targetDetermination: "",
        tierPeriod: "",
        periodDetermination: "",
        tierPeriodValue: "",
        tierBreak: "",
        isActive: true,
    });

    // Edit volume tier form state
    const [editVolumeTier, setEditVolumeTier] = useState({
        id: 0,
        name: "",
        tieringCriteria: "",
        integrationClass: "",
        tierTargetValue: "",
        targetAggregation: "",
        targetDetermination: "",
        tierPeriod: "",
        periodDetermination: "",
        tierPeriodValue: "",
        tierBreak: "",
        isActive: true,
    });

    // Animation effect
    useEffect(() => {
        setAnimate(true);
    }, []);

    const handleVolumeTierSelection = (id) => {
        setSelectedVolumeTiers((prev) => (prev.includes(id) ? prev.filter((tierId) => tierId !== id) : [...prev, id]));
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedVolumeTiers(paginatedVolumeTiers.map((tier) => tier.id));
        } else {
            setSelectedVolumeTiers([]);
        }
    };

    const handleDeleteVolumeTiers = () => {
        console.log("Deleting volume tiers:", selectedVolumeTiers);
        toast({
            title: "Volume Tiers Deleted",
            description: `${selectedVolumeTiers.length} volume tier(s) have been deleted successfully.`,
        });
        setSelectedVolumeTiers([]);
        setIsDeleteDialogOpen(false);
    };

    const handleAddVolumeTier = () => {
        setIsAddVolumeTierDialogOpen(true);
    };

    const handleEditVolumeTier = (volumeTier) => {
        setEditVolumeTier(volumeTier);
        setIsEditVolumeTierDialogOpen(true);
    };

    const handleSaveNewVolumeTier = () => {
        // In a real app, you would save to the database here
        toast({
            title: "Volume Tier Added",
            description: "The volume tier has been added successfully.",
        });
        setIsAddVolumeTierDialogOpen(false);
        setNewVolumeTier({
            name: "",
            tieringCriteria: "",
            integrationClass: "",
            tierTargetValue: "",
            targetAggregation: "",
            targetDetermination: "",
            tierPeriod: "",
            periodDetermination: "",
            tierPeriodValue: "",
            tierBreak: "",
            isActive: true,
        });
    };

    const handleSaveEditVolumeTier = () => {
        // In a real app, you would update the database here
        toast({
            title: "Volume Tier Updated",
            description: "The volume tier has been updated successfully.",
        });
        setIsEditVolumeTierDialogOpen(false);
    };

    const handleExport = () => {
        toast({
            title: "Export Started",
            description: "Your volume tier data is being exported. You'll be notified when it's ready.",
        });
    };

    const handleRefresh = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            toast({
                title: "Data Refreshed",
                description: "Volume tier data has been refreshed successfully.",
            });
        }, 1000);
    };

    const applyFilter = (column, type, value) => {
        setColumnFilters((prev) => ({
            ...prev,
            [column]: { type, value },
        }));
        setActiveFilterColumn(null);
    };

    const clearFilter = (column) => {
        setColumnFilters((prev) => {
            const newFilters = { ...prev };
            delete newFilters[column];
            return newFilters;
        });
    };

    const clearAllFilters = () => {
        setColumnFilters({});
    };

    const toggleColumnVisibility = (columnId) => {
        setVisibleColumns((prev) => (prev.includes(columnId) ? prev.filter((id) => id !== columnId) : [...prev, columnId]));
    };

    const resetColumnVisibility = () => {
        setVisibleColumns(allColumns.filter((col) => col.defaultVisible).map((col) => col.id));
    };

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    // Apply filters and sorting to volume tier data
    let filteredVolumeTiers = volumeTierData.filter((volumeTier) => {
        // First apply search term
        const matchesSearch = volumeTier.name.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        // Apply column filters
        for (const [column, filter] of Object.entries(columnFilters)) {
            let value = volumeTier[column];

            // Handle boolean values
            if (typeof value === "boolean") {
                value = value ? "true" : "false";
            } else if (typeof value === "number") {
                value = value.toString();
            } else if (Array.isArray(value)) {
                value = value.join(", ").toLowerCase();
            } else {
                value = (value?.toString() || "").toLowerCase();
            }

            const filterVal = filter.value.toLowerCase();

            switch (filter.type) {
                case "equals":
                    if (value !== filterVal) return false;
                    break;
                case "notEquals":
                    if (value === filterVal) return false;
                    break;
                case "beginsWith":
                    if (!value.startsWith(filterVal)) return false;
                    break;
                case "endsWith":
                    if (!value.endsWith(filterVal)) return false;
                    break;
                case "contains":
                    if (!value.includes(filterVal)) return false;
                    break;
                case "notContains":
                    if (value.includes(filterVal)) return false;
                    break;
                default:
                    break;
            }
        }
        return true;
    });

    // Apply sorting
    if (sortColumn) {
        filteredVolumeTiers = [...filteredVolumeTiers].sort((a, b) => {
            let valueA = a[sortColumn];
            let valueB = b[sortColumn];

            // Handle undefined values
            if (valueA === undefined) valueA = "";
            if (valueB === undefined) valueB = "";

            // Handle arrays
            if (Array.isArray(valueA)) valueA = valueA.join(", ");
            if (Array.isArray(valueB)) valueB = valueB.join(", ");

            // Convert to strings for comparison
            valueA = valueA?.toString() || "";
            valueB = valueB?.toString() || "";

            if (sortDirection === "asc") {
                return valueA.localeCompare(valueB);
            } else {
                return valueB.localeCompare(valueA);
            }
        });
    }

    // Pagination logic
    const startIndex = (parseInt(currentPage) - 1) * parseInt(pageSize);
    const endIndex = startIndex + parseInt(pageSize);
    const paginatedVolumeTiers = filteredVolumeTiers.slice(startIndex, endIndex);

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
                        className={`transition-all duration-300 ${selectedVolumeTiers.length === 0 ? "opacity-50" : "hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                            }`}
                        onClick={() => {
                            if (selectedVolumeTiers.length > 0) {
                                setIsDeleteDialogOpen(true);
                            } else {
                                toast({
                                    title: "No Selection",
                                    description: "Please select at least one volume tier to delete.",
                                    variant: "destructive",
                                });
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
                                    checked={selectedVolumeTiers.length > 0 && selectedVolumeTiers.length === paginatedVolumeTiers.length}
                                    onCheckedChange={handleSelectAll}
                                />
                            </TableHead>
                            {visibleColumns.includes("name") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("name")}
                                    >
                                        Volume Tier Name
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
                                                        e.stopPropagation();
                                                        setActiveFilterColumn("name");
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.name ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Volume Tier Name</h4>
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
                                                                applyFilter("name", filterType, filterValue);
                                                                setFilterValue("");
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
                            {visibleColumns.includes("tieringCriteria") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("tieringCriteria")}
                                    >
                                        Tiering Criteria
                                        {sortColumn === "tieringCriteria" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "tieringCriteria"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveFilterColumn("tieringCriteria");
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.tieringCriteria ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Tiering Criteria</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="contains" id="contains-tieringCriteria" />
                                                            <Label htmlFor="contains-tieringCriteria">Contains</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notContains" id="notContains-tieringCriteria" />
                                                            <Label htmlFor="notContains-tieringCriteria">Does Not Contain</Label>
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
                                                                applyFilter("tieringCriteria", filterType, filterValue);
                                                                setFilterValue("");
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
                            {visibleColumns.includes("integrationClass") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("integrationClass")}
                                    >
                                        Integration Class
                                        {sortColumn === "integrationClass" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "integrationClass"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveFilterColumn("integrationClass");
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.integrationClass ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Integration Class</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="contains" id="contains-integrationClass" />
                                                            <Label htmlFor="contains-integrationClass">Contains</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notContains" id="notContains-integrationClass" />
                                                            <Label htmlFor="notContains-integrationClass">Does Not Contain</Label>
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
                                                                applyFilter("integrationClass", filterType, filterValue);
                                                                setFilterValue("");
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
                            {visibleColumns.includes("tierTargetValue") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("tierTargetValue")}
                                    >
                                        Tier Target Value
                                        {sortColumn === "tierTargetValue" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "tierTargetValue"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveFilterColumn("tierTargetValue");
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.tierTargetValue ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Tier Target Value</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="equals" id="equals-tierTargetValue" />
                                                            <Label htmlFor="equals-tierTargetValue">Equals</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notEquals" id="notEquals-tierTargetValue" />
                                                            <Label htmlFor="notEquals-tierTargetValue">Does Not Equal</Label>
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
                                                                applyFilter("tierTargetValue", filterType, filterValue);
                                                                setFilterValue("");
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
                            {visibleColumns.includes("targetAggregation") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("targetAggregation")}
                                    >
                                        Target Aggregation
                                        {sortColumn === "targetAggregation" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "targetAggregation"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveFilterColumn("targetAggregation");
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.targetAggregation ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Target Aggregation</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="contains" id="contains-targetAggregation" />
                                                            <Label htmlFor="contains-targetAggregation">Contains</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notContains" id="notContains-targetAggregation" />
                                                            <Label htmlFor="notContains-targetAggregation">Does Not Contain</Label>
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
                                                                applyFilter("targetAggregation", filterType, filterValue);
                                                                setFilterValue("");
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
                            {visibleColumns.includes("targetDetermination") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("targetDetermination")}
                                    >
                                        Target Determination
                                        {sortColumn === "targetDetermination" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "targetDetermination"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveFilterColumn("targetDetermination");
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.targetDetermination ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Target Determination</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="contains" id="contains-targetDetermination" />
                                                            <Label htmlFor="contains-targetDetermination">Contains</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notContains" id="notContains-targetDetermination" />
                                                            <Label htmlFor="notContains-targetDetermination">Does Not Contain</Label>
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
                                                                applyFilter("targetDetermination", filterType, filterValue);
                                                                setFilterValue("");
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
                            {visibleColumns.includes("tierPeriod") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("tierPeriod")}
                                    >
                                        Tier Period
                                        {sortColumn === "tierPeriod" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "tierPeriod"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveFilterColumn("tierPeriod");
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.tierPeriod ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Tier Period</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="equals" id="equals-tierPeriod" />
                                                            <Label htmlFor="equals-tierPeriod">Equals</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notEquals" id="notEquals-tierPeriod" />
                                                            <Label htmlFor="notEquals-tierPeriod">Does Not Equal</Label>
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
                                                                applyFilter("tierPeriod", filterType, filterValue);
                                                                setFilterValue("");
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
                            {visibleColumns.includes("periodDetermination") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("periodDetermination")}
                                    >
                                        Period Determination
                                        {sortColumn === "periodDetermination" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "periodDetermination"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveFilterColumn("periodDetermination");
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.periodDetermination ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Period Determination</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="contains" id="contains-periodDetermination" />
                                                            <Label htmlFor="contains-periodDetermination">Contains</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notContains" id="notContains-periodDetermination" />
                                                            <Label htmlFor="notContains-periodDetermination">Does Not Contain</Label>
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
                                                                applyFilter("periodDetermination", filterType, filterValue);
                                                                setFilterValue("");
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
                            {visibleColumns.includes("tierPeriodValue") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("tierPeriodValue")}
                                    >
                                        Tier Period Value
                                        {sortColumn === "tierPeriodValue" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "tierPeriodValue"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveFilterColumn("tierPeriodValue");
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.tierPeriodValue ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Tier Period Value</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="equals" id="equals-tierPeriodValue" />
                                                            <Label htmlFor="equals-tierPeriodValue">Equals</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notEquals" id="notEquals-tierPeriodValue" />
                                                            <Label htmlFor="notEquals-tierPeriodValue">Does Not Equal</Label>
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
                                                                applyFilter("tierPeriodValue", filterType, filterValue);
                                                                setFilterValue("");
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
                            {visibleColumns.includes("tierBreak") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("tierBreak")}
                                    >
                                        Tier Break
                                        {sortColumn === "tierBreak" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "tierBreak"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveFilterColumn("tierBreak");
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.tierBreak ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Tier Break</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="contains" id="contains-tierBreak" />
                                                            <Label htmlFor="contains-tierBreak">Contains</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notContains" id="notContains-tierBreak" />
                                                            <Label htmlFor="notContains-tierBreak">Does Not Contain</Label>
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
                                                                applyFilter("tierBreak", filterType, filterValue);
                                                                setFilterValue("");
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
                                                        e.stopPropagation();
                                                        setActiveFilterColumn("isActive");
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
                                                                applyFilter("isActive", filterType, filterValue);
                                                                setFilterValue("");
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
                        {paginatedVolumeTiers.length > 0 ? (
                            paginatedVolumeTiers.map((volumeTier) => (
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
                                    {visibleColumns.includes("tieringCriteria") && (
                                        <TableCell>{volumeTier.tieringCriteria}</TableCell>
                                    )}
                                    {visibleColumns.includes("integrationClass") && (
                                        <TableCell>{volumeTier.integrationClass}</TableCell>
                                    )}
                                    {visibleColumns.includes("tierTargetValue") && (
                                        <TableCell>{volumeTier.tierTargetValue}</TableCell>
                                    )}
                                    {visibleColumns.includes("targetAggregation") && (
                                        <TableCell>{volumeTier.targetAggregation}</TableCell>
                                    )}
                                    {visibleColumns.includes("targetDetermination") && (
                                        <TableCell>{volumeTier.targetDetermination}</TableCell>
                                    )}
                                    {visibleColumns.includes("tierPeriod") && (
                                        <TableCell>{volumeTier.tierPeriod}</TableCell>
                                    )}
                                    {visibleColumns.includes("periodDetermination") && (
                                        <TableCell>{volumeTier.periodDetermination}</TableCell>
                                    )}
                                    {visibleColumns.includes("tierPeriodValue") && (
                                        <TableCell>{volumeTier.tierPeriodValue}</TableCell>
                                    )}
                                    {visibleColumns.includes("tierBreak") && (
                                        <TableCell>{volumeTier.tierBreak}</TableCell>
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
                    <Select
                        value={pageSize}
                        onValueChange={(value) => {
                            setPageSize(value);
                            setCurrentPage("1"); // Reset to first page when page size changes
                        }}
                    >
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
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                                setCurrentPage(value || "1"); // Default to "1" if empty
                            }
                        }}
                    />
                    <span>of {Math.max(1, Math.ceil(filteredVolumeTiers.length / parseInt(pageSize)))}</span>
                    <span>
                        Displaying{" "}
                        {paginatedVolumeTiers.length > 0
                            ? `${startIndex + 1} - ${Math.min(startIndex + paginatedVolumeTiers.length, filteredVolumeTiers.length)}`
                            : "0"}{" "}
                        of {filteredVolumeTiers.length}
                    </span>
                </div>
            </div>

            {/* Delete Dialog */}
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
                        <DialogTitle>Volume Tier Setup</DialogTitle>
                        <DialogDescription>Create a new volume tier with the form below.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Volume Tier Name
                            </Label>
                            <Input
                                id="name"
                                value={newVolumeTier.name}
                                onChange={(e) => setNewVolumeTier({ ...newVolumeTier, name: e.target.value })}
                                className="col-span-3"
                                placeholder="Annual Growth"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="tieringCriteria" className="text-right">
                                Tiering Criteria
                            </Label>
                            <Input
                                id="tieringCriteria"
                                value={newVolumeTier.tieringCriteria}
                                onChange={(e) => setNewVolumeTier({ ...newVolumeTier, tieringCriteria: e.target.value })}
                                className="col-span-3"
                                placeholder="Tiered Growth"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="integrationClass" className="text-right">
                                Integration Class
                            </Label>
                            <Input
                                id="integrationClass"
                                value={newVolumeTier.integrationClass}
                                onChange={(e) => setNewVolumeTier({ ...newVolumeTier, integrationClass: e.target.value })}
                                className="col-span-3"
                                placeholder="Buy Side Allowance"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="tierTargetValue" className="text-right">
                                Tier Target Value
                            </Label>
                            <Input
                                id="tierTargetValue"
                                value={newVolumeTier.tierTargetValue}
                                onChange={(e) => setNewVolumeTier({ ...newVolumeTier, tierTargetValue: e.target.value })}
                                className="col-span-3"
                                placeholder="Percent"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="targetAggregation" className="text-right">
                                Target Aggregation
                            </Label>
                            <Input
                                id="targetAggregation"
                                value={newVolumeTier.targetAggregation}
                                onChange={(e) => setNewVolumeTier({ ...newVolumeTier, targetAggregation: e.target.value })}
                                className="col-span-3"
                                placeholder="Purchase Cost"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="targetDetermination" className="text-right">
                                Target Determination
                            </Label>
                            <Input
                                id="targetDetermination"
                                value={newVolumeTier.targetDetermination}
                                onChange={(e) => setNewVolumeTier({ ...newVolumeTier, targetDetermination: e.target.value })}
                                className="col-span-3"
                                placeholder="Sum"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="tierPeriod" className="text-right">
                                Tier Period
                            </Label>
                            <Input
                                id="tierPeriod"
                                value={newVolumeTier.tierPeriod}
                                onChange={(e) => setNewVolumeTier({ ...newVolumeTier, tierPeriod: e.target.value })}
                                className="col-span-3"
                                placeholder="Annual"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="periodDetermination" className="text-right">
                                Period Determination
                            </Label>
                            <Input
                                id="periodDetermination"
                                value={newVolumeTier.periodDetermination}
                                onChange={(e) => setNewVolumeTier({ ...newVolumeTier, periodDetermination: e.target.value })}
                                className="col-span-3"
                                placeholder="Same Period"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="tierPeriodValue" className="text-right">
                                Tier Period Value
                            </Label>
                            <Input
                                id="tierPeriodValue"
                                value={newVolumeTier.tierPeriodValue}
                                onChange={(e) => setNewVolumeTier({ ...newVolumeTier, tierPeriodValue: e.target.value })}
                                className="col-span-3"
                                placeholder="1"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="tierBreak" className="text-right">
                                Tier Break
                            </Label>
                            <Input
                                id="tierBreak"
                                value={newVolumeTier.tierBreak}
                                onChange={(e) => setNewVolumeTier({ ...newVolumeTier, tierBreak: e.target.value })}
                                className="col-span-3"
                                placeholder="Back to Dollar 1"
                            />
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
                            Reset
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
                        <DialogTitle>Volume Tier Setup</DialogTitle>
                        <DialogDescription>Update the volume tier details with the form below.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editName" className="text-right">
                                Volume Tier Name
                            </Label>
                            <Input
                                id="editName"
                                value={editVolumeTier.name}
                                onChange={(e) => setEditVolumeTier({ ...editVolumeTier, name: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editTieringCriteria" className="text-right">
                                Tiering Criteria
                            </Label>
                            <Input
                                id="editTieringCriteria"
                                value={editVolumeTier.tieringCriteria}
                                onChange={(e) => setEditVolumeTier({ ...editVolumeTier, tieringCriteria: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editIntegrationClass" className="text-right">
                                Integration Class
                            </Label>
                            <Input
                                id="editIntegrationClass"
                                value={editVolumeTier.integrationClass}
                                onChange={(e) => setEditVolumeTier({ ...editVolumeTier, integrationClass: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editTierTargetValue" className="text-right">
                                Tier Target Value
                            </Label>
                            <Input
                                id="editTierTargetValue"
                                value={editVolumeTier.tierTargetValue}
                                onChange={(e) => setEditVolumeTier({ ...editVolumeTier, tierTargetValue: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editTargetAggregation" className="text-right">
                                Target Aggregation
                            </Label>
                            <Input
                                id="editTargetAggregation"
                                value={editVolumeTier.targetAggregation}
                                onChange={(e) => setEditVolumeTier({ ...editVolumeTier, targetAggregation: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editTargetDetermination" className="text-right">
                                Target Determination
                            </Label>
                            <Input
                                id="editTargetDetermination"
                                value={editVolumeTier.targetDetermination}
                                onChange={(e) => setEditVolumeTier({ ...editVolumeTier, targetDetermination: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editTierPeriod" className="text-right">
                                Tier Period
                            </Label>
                            <Input
                                id="editTierPeriod"
                                value={editVolumeTier.tierPeriod}
                                onChange={(e) => setEditVolumeTier({ ...editVolumeTier, tierPeriod: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editPeriodDetermination" className="text-right">
                                Period Determination
                            </Label>
                            <Input
                                id="editPeriodDetermination"
                                value={editVolumeTier.periodDetermination}
                                onChange={(e) => setEditVolumeTier({ ...editVolumeTier, periodDetermination: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editTierPeriodValue" className="text-right">
                                Tier Period Value
                            </Label>
                            <Input
                                id="editTierPeriodValue"
                                value={editVolumeTier.tierPeriodValue}
                                onChange={(e) => setEditVolumeTier({ ...editVolumeTier, tierPeriodValue: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="editTierBreak" className="text-right">
                                Tier Break
                            </Label>
                            <Input
                                id="editTierBreak"
                                value={editVolumeTier.tierBreak}
                                onChange={(e) => setEditVolumeTier({ ...editVolumeTier, tierBreak: e.target.value })}
                                className="col-span-3"
                            />
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
                            Reset
                        </Button>
                        <Button onClick={handleSaveEditVolumeTier} className="bg-green-600 hover:bg-green-700">
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}