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
    FileText,
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

// Mock deal type data
const dealTypeData = [
    {
        id: 1,
        name: "AFP",
        dealTypeAccess: "Administration Fee",
        dealTypeAccessSecondary: "Both",
        startDate: "01/01/2023",
        endDate: "12/31/2023",
        isActive: true,
        customer: "N",
        dealType: "N",
        lumpsum: "N",
        products: "N",
        naturalAccount: "10160",
        integrationClass: "Sell Side Allowance",
        category: "Deal",
        terms: "Broker Terms",
        calendar: "AFP",
        displayProducts: true,
        displayDealDate: true,
        displayLumpsum: true,
        displayCustomer: true,
        displayAllowance: true,
        allowAmendment: true,
        enableCascadeDeal: true,
    },
    {
        id: 2,
        name: "BFP",
        dealTypeAccess: "Broker Fee",
        dealTypeAccessSecondary: "Both",
        startDate: "02/15/2023",
        endDate: "12/31/2023",
        isActive: true,
        customer: "Y",
        dealType: "Y",
        lumpsum: "N",
        products: "Y",
        naturalAccount: "10170",
        integrationClass: "Buy Side Allowance",
        category: "Deal",
        terms: "Standard Terms",
        calendar: "BFP",
        displayProducts: true,
        displayDealDate: false,
        displayLumpsum: false,
        displayCustomer: true,
        displayAllowance: true,
        allowAmendment: false,
        enableCascadeDeal: false,
    },
    {
        id: 3,
        name: "CFP",
        dealTypeAccess: "Client Fee",
        dealTypeAccessSecondary: "Administration",
        startDate: "03/01/2023",
        endDate: "12/31/2023",
        isActive: false,
        customer: "Y",
        dealType: "N",
        lumpsum: "Y",
        products: "N",
        naturalAccount: "10180",
        integrationClass: "Client Side Allowance",
        category: "Fee",
        terms: "Client Terms",
        calendar: "CFP",
        displayProducts: false,
        displayDealDate: true,
        displayLumpsum: true,
        displayCustomer: true,
        displayAllowance: false,
        allowAmendment: true,
        enableCascadeDeal: false,
    },
];

// Define all available columns
const allColumns = [
    { id: "name", name: "Deal Type", defaultVisible: true },
    { id: "dealTypeAccess", name: "Deal Type Access", defaultVisible: true },
    { id: "dealTypeAccessSecondary", name: "Deal Type Access", defaultVisible: true },
    { id: "startDate", name: "Start Date", defaultVisible: true },
    { id: "endDate", name: "End Date", defaultVisible: true },
    { id: "isActive", name: "Active", defaultVisible: true },
    { id: "customer", name: "Customer", defaultVisible: true },
    { id: "dealType", name: "Deal Type", defaultVisible: true },
    { id: "lumpsum", name: "Lumpsum", defaultVisible: true },
    { id: "products", name: "Products", defaultVisible: true },
];

export default function DealTypePage() {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState("1");
    const [pageSize, setPageSize] = useState("10");
    const [selectedDealTypes, setSelectedDealTypes] = useState([]);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [columnFilters, setColumnFilters] = useState({});
    const [activeFilterColumn, setActiveFilterColumn] = useState(null);
    const [filterValue, setFilterValue] = useState("");
    const [filterType, setFilterType] = useState("contains");
    const [isAddDealTypeDialogOpen, setIsAddDealTypeDialogOpen] = useState(false);
    const [isEditDealTypeDialogOpen, setIsEditDealTypeDialogOpen] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState(
        allColumns.filter((col) => col.defaultVisible).map((col) => col.id),
    );
    const [isLoading, setIsLoading] = useState(false);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc");
    const [animate, setAnimate] = useState(false);

    // New deal type form state
    const [newDealType, setNewDealType] = useState({
        name: "",
        dealTypeAccess: "",
        dealTypeAccessSecondary: "Both",
        startDate: "",
        endDate: "",
        isActive: true,
        customer: "N",
        dealType: "N",
        lumpsum: "N",
        products: "N",
        naturalAccount: "",
        integrationClass: "",
        category: "",
        terms: "",
        calendar: "",
        displayProducts: false,
        displayDealDate: false,
        displayLumpsum: false,
        displayCustomer: false,
        displayAllowance: false,
        allowAmendment: false,
        enableCascadeDeal: false,
    });

    // Edit deal type form state
    const [editDealType, setEditDealType] = useState({
        id: 0,
        name: "",
        dealTypeAccess: "",
        dealTypeAccessSecondary: "Both",
        startDate: "",
        endDate: "",
        isActive: true,
        customer: "N",
        dealType: "N",
        lumpsum: "N",
        products: "N",
        naturalAccount: "",
        integrationClass: "",
        category: "",
        terms: "",
        calendar: "",
        displayProducts: false,
        displayDealDate: false,
        displayLumpsum: false,
        displayCustomer: false,
        displayAllowance: false,
        allowAmendment: false,
        enableCascadeDeal: false,
    });

    // Animation effect
    useEffect(() => {
        setAnimate(true);
    }, []);

    const handleDealTypeSelection = (id) => {
        setSelectedDealTypes((prev) =>
            prev.includes(id) ? prev.filter((dealId) => dealId !== id) : [...prev, id],
        );
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedDealTypes(paginatedDealTypes.map((deal) => deal.id));
        } else {
            setSelectedDealTypes([]);
        }
    };

    const handleDeleteDealTypes = () => {
        console.log("Deleting deal types:", selectedDealTypes);
        toast({
            title: "Deal Types Deleted",
            description: `${selectedDealTypes.length} deal type(s) have been deleted successfully.`,
        });
        setSelectedDealTypes([]);
        setIsDeleteDialogOpen(false);
    };

    const handleAddDealType = () => {
        setIsAddDealTypeDialogOpen(true);
    };

    const handleEditDealType = (dealType) => {
        setEditDealType(dealType);
        setIsEditDealTypeDialogOpen(true);
    };

    const handleSaveNewDealType = () => {
        toast({
            title: "Deal Type Added",
            description: "The deal type has been added successfully.",
        });
        setIsAddDealTypeDialogOpen(false);
        setNewDealType({
            name: "",
            dealTypeAccess: "",
            dealTypeAccessSecondary: "Both",
            startDate: "",
            endDate: "",
            isActive: true,
            customer: "N",
            dealType: "N",
            lumpsum: "N",
            products: "N",
            naturalAccount: "",
            integrationClass: "",
            category: "",
            terms: "",
            calendar: "",
            displayProducts: false,
            displayDealDate: false,
            displayLumpsum: false,
            displayCustomer: false,
            displayAllowance: false,
            allowAmendment: false,
            enableCascadeDeal: false,
        });
    };

    const handleSaveEditDealType = () => {
        toast({
            title: "Deal Type Updated",
            description: "The deal type has been updated successfully.",
        });
        setIsEditDealTypeDialogOpen(false);
    };

    const handleExport = () => {
        toast({
            title: "Export Started",
            description: "Your deal type data is being exported. You'll be notified when it's ready.",
        });
    };

    const handleRefresh = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            toast({
                title: "Data Refreshed",
                description: "Deal type data has been refreshed successfully.",
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
        setVisibleColumns((prev) =>
            prev.includes(columnId) ? prev.filter((id) => id !== columnId) : [...prev, columnId],
        );
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

    // Apply filters and sorting to deal type data
    let filteredDealTypes = dealTypeData.filter((dealType) => {
        const matchesSearch =
            dealType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dealType.dealTypeAccess.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dealType.category.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        for (const [column, filter] of Object.entries(columnFilters)) {
            let value = dealType[column];

            if (typeof value === "boolean") {
                value = value ? "true" : "false";
            } else if (typeof value === "number") {
                value = value.toString();
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
        filteredDealTypes = [...filteredDealTypes].sort((a, b) => {
            let valueA = a[sortColumn];
            let valueB = b[sortColumn];

            if (valueA === undefined) valueA = "";
            if (valueB === undefined) valueB = "";

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
    const paginatedDealTypes = filteredDealTypes.slice(startIndex, endIndex);

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
                        className={`transition-all duration-300 ${selectedDealTypes.length === 0
                                ? "opacity-50"
                                : "hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                            }`}
                        onClick={() => {
                            if (selectedDealTypes.length > 0) {
                                setIsDeleteDialogOpen(true);
                            } else {
                                toast({
                                    title: "No Selection",
                                    description: "Please select at least one deal type to delete.",
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

            {/* Deal Types Table */}
            <Card className="border rounded-lg overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    checked={selectedDealTypes.length > 0 && selectedDealTypes.length === paginatedDealTypes.length}
                                    onCheckedChange={handleSelectAll}
                                />
                            </TableHead>
                            {visibleColumns.includes("name") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("name")}
                                    >
                                        Deal Type
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
                                                    <h4 className="font-medium">Filter Deal Type</h4>
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
                            {visibleColumns.includes("dealTypeAccess") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("dealTypeAccess")}
                                    >
                                        Deal Type Access
                                        {sortColumn === "dealTypeAccess" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "dealTypeAccess"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveFilterColumn("dealTypeAccess");
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.dealTypeAccess ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Deal Type Access</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="equals" id="equals-dealTypeAccess" />
                                                            <Label htmlFor="equals-dealTypeAccess">Equals</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notEquals" id="notEquals-dealTypeAccess" />
                                                            <Label htmlFor="notEquals-dealTypeAccess">Does Not Equal</Label>
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
                                                                applyFilter("dealTypeAccess", filterType, filterValue);
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
                            {visibleColumns.includes("dealTypeAccessSecondary") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("dealTypeAccessSecondary")}
                                    >
                                        Deal Type Access
                                        {sortColumn === "dealTypeAccessSecondary" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "dealTypeAccessSecondary"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveFilterColumn("dealTypeAccessSecondary");
                                                    }}
                                                >
                                                    <Filter
                                                        className={`h-3 w-3 ${columnFilters.dealTypeAccessSecondary ? "text-green-600" : ""}`}
                                                    />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Deal Type Access</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="equals" id="equals-dealTypeAccessSecondary" />
                                                            <Label htmlFor="equals-dealTypeAccessSecondary">Equals</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notEquals" id="notEquals-dealTypeAccessSecondary" />
                                                            <Label htmlFor="notEquals-dealTypeAccessSecondary">Does Not Equal</Label>
                                                        </div>
                                                    </RadioGroup>
                                                    <Select value={filterValue} onValueChange={setFilterValue}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select value" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Both">Both</SelectItem>
                                                            <SelectItem value="Administration">Administration</SelectItem>
                                                            <SelectItem value="Client">Client</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <div className="flex justify-between">
                                                        <Button variant="outline" onClick={() => setActiveFilterColumn(null)}>
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            onClick={() => {
                                                                applyFilter("dealTypeAccessSecondary", filterType, filterValue);
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
                                                        e.stopPropagation();
                                                        setActiveFilterColumn("startDate");
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
                                                    </RadioGroup>
                                                    <Input
                                                        placeholder="MM/DD/YYYY"
                                                        value={filterValue}
                                                        onChange={(e) => setFilterValue(e.target.value)}
                                                    />
                                                    <div className="flex justify-between">
                                                        <Button variant="outline" onClick={() => setActiveFilterColumn(null)}>
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            onClick={() => {
                                                                applyFilter("startDate", filterType, filterValue);
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
                                                        e.stopPropagation();
                                                        setActiveFilterColumn("endDate");
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
                                                    </RadioGroup>
                                                    <Input
                                                        placeholder="MM/DD/YYYY"
                                                        value={filterValue}
                                                        onChange={(e) => setFilterValue(e.target.value)}
                                                    />
                                                    <div className="flex justify-between">
                                                        <Button variant="outline" onClick={() => setActiveFilterColumn(null)}>
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            onClick={() => {
                                                                applyFilter("endDate", filterType, filterValue);
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
                            {visibleColumns.includes("customer") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("customer")}
                                    >
                                        Customer
                                        {sortColumn === "customer" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "customer"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveFilterColumn("customer");
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.customer ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Customer</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="equals" id="equals-customer" />
                                                            <Label htmlFor="equals-customer">Equals</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notEquals" id="notEquals-customer" />
                                                            <Label htmlFor="notEquals-customer">Does Not Equal</Label>
                                                        </div>
                                                    </RadioGroup>
                                                    <Select value={filterValue} onValueChange={setFilterValue}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select value" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Y">Y</SelectItem>
                                                            <SelectItem value="N">N</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <div className="flex justify-between">
                                                        <Button variant="outline" onClick={() => setActiveFilterColumn(null)}>
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            onClick={() => {
                                                                applyFilter("customer", filterType, filterValue);
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
                            {visibleColumns.includes("dealType") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("dealType")}
                                    >
                                        Deal Type
                                        {sortColumn === "dealType" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "dealType"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveFilterColumn("dealType");
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.dealType ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Deal Type</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="equals" id="equals-dealType" />
                                                            <Label htmlFor="equals-dealType">Equals</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notEquals" id="notEquals-dealType" />
                                                            <Label htmlFor="notEquals-dealType">Does Not Equal</Label>
                                                        </div>
                                                    </RadioGroup>
                                                    <Select value={filterValue} onValueChange={setFilterValue}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select value" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Y">Y</SelectItem>
                                                            <SelectItem value="N">N</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <div className="flex justify-between">
                                                        <Button variant="outline" onClick={() => setActiveFilterColumn(null)}>
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            onClick={() => {
                                                                applyFilter("dealType", filterType, filterValue);
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
                            {visibleColumns.includes("lumpsum") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("lumpsum")}
                                    >
                                        Lumpsum
                                        {sortColumn === "lumpsum" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "lumpsum"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveFilterColumn("lumpsum");
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.lumpsum ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Lumpsum</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="equals" id="equals-lumpsum" />
                                                            <Label htmlFor="equals-lumpsum">Equals</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notEquals" id="notEquals-lumpsum" />
                                                            <Label htmlFor="notEquals-lumpsum">Does Not Equal</Label>
                                                        </div>
                                                    </RadioGroup>
                                                    <Select value={filterValue} onValueChange={setFilterValue}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select value" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Y">Y</SelectItem>
                                                            <SelectItem value="N">N</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <div className="flex justify-between">
                                                        <Button variant="outline" onClick={() => setActiveFilterColumn(null)}>
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            onClick={() => {
                                                                applyFilter("lumpsum", filterType, filterValue);
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
                            {visibleColumns.includes("products") && (
                                <TableHead>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                                        onClick={() => handleSort("products")}
                                    >
                                        Products
                                        {sortColumn === "products" &&
                                            (sortDirection === "asc" ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            ))}
                                        <Popover
                                            open={activeFilterColumn === "products"}
                                            onOpenChange={(open) => !open && setActiveFilterColumn(null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveFilterColumn("products");
                                                    }}
                                                >
                                                    <Filter className={`h-3 w-3 ${columnFilters.products ? "text-green-600" : ""}`} />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="space-y-4">
                                                    <h4 className="font-medium">Filter Products</h4>
                                                    <RadioGroup
                                                        defaultValue={filterType}
                                                        onValueChange={setFilterType}
                                                        className="grid grid-cols-2 gap-2"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="equals" id="equals-products" />
                                                            <Label htmlFor="equals-products">Equals</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="notEquals" id="notEquals-products" />
                                                            <Label htmlFor="notEquals-products">Does Not Equal</Label>
                                                        </div>
                                                    </RadioGroup>
                                                    <Select value={filterValue} onValueChange={setFilterValue}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select value" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Y">Y</SelectItem>
                                                            <SelectItem value="N">N</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <div className="flex justify-between">
                                                        <Button variant="outline" onClick={() => setActiveFilterColumn(null)}>
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            onClick={() => {
                                                                applyFilter("products", filterType, filterValue);
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
                        {paginatedDealTypes.length > 0 ? (
                            paginatedDealTypes.map((dealType) => (
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
                                    {visibleColumns.includes("dealTypeAccess") && <TableCell>{dealType.dealTypeAccess}</TableCell>}
                                    {visibleColumns.includes("dealTypeAccessSecondary") && (
                                        <TableCell>{dealType.dealTypeAccessSecondary}</TableCell>
                                    )}
                                    {visibleColumns.includes("startDate") && <TableCell>{dealType.startDate}</TableCell>}
                                    {visibleColumns.includes("endDate") && <TableCell>{dealType.endDate}</TableCell>}
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
                                    {visibleColumns.includes("customer") && <TableCell>{dealType.customer}</TableCell>}
                                    {visibleColumns.includes("dealType") && <TableCell>{dealType.dealType}</TableCell>}
                                    {visibleColumns.includes("lumpsum") && <TableCell>{dealType.lumpsum}</TableCell>}
                                    {visibleColumns.includes("products") && <TableCell>{dealType.products}</TableCell>}
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
                    <span>of {Math.max(1, Math.ceil(filteredDealTypes.length / parseInt(pageSize)))}</span>
                    <span>
                        Displaying{" "}
                        {paginatedDealTypes.length > 0
                            ? `${startIndex + 1} - ${Math.min(startIndex + paginatedDealTypes.length, filteredDealTypes.length)}`
                            : "0"}{" "}
                        of {filteredDealTypes.length}
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

            {/* Add/Edit Deal Type Dialog */}
            <Dialog
                open={isAddDealTypeDialogOpen || isEditDealTypeDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsAddDealTypeDialogOpen(false);
                        setIsEditDealTypeDialogOpen(false);
                    }
                }}
            >
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{isAddDealTypeDialogOpen ? "Add New Deal Type" : "Edit Deal Type"}</DialogTitle>
                        <DialogDescription>
                            {isAddDealTypeDialogOpen
                                ? "Create a new deal type with the form below."
                                : "Update the deal type details with the form below."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                        <div className="space-y-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="dealTypeName" className="text-right">
                                    Deal Type Name
                                </Label>
                                <Input
                                    id="dealTypeName"
                                    value={isAddDealTypeDialogOpen ? newDealType.dealTypeAccess : editDealType.dealTypeAccess}
                                    onChange={(e) => {
                                        if (isAddDealTypeDialogOpen) {
                                            setNewDealType({ ...newDealType, dealTypeAccess: e.target.value });
                                        } else {
                                            setEditDealType({ ...editDealType, dealTypeAccess: e.target.value });
                                        }
                                    }}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="dealTypeCode" className="text-right">
                                    Deal Type Code
                                </Label>
                                <Input
                                    id="dealTypeCode"
                                    value={isAddDealTypeDialogOpen ? newDealType.name : editDealType.name}
                                    onChange={(e) => {
                                        if (isAddDealTypeDialogOpen) {
                                            setNewDealType({ ...newDealType, name: e.target.value });
                                        } else {
                                            setEditDealType({ ...editDealType, name: e.target.value });
                                        }
                                    }}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="dealTypeAccess" className="text-right">
                                    Deal Type Access
                                </Label>
                                <Select
                                    value={
                                        isAddDealTypeDialogOpen
                                            ? newDealType.dealTypeAccessSecondary
                                            : editDealType.dealTypeAccessSecondary
                                    }
                                    onValueChange={(value) => {
                                        if (isAddDealTypeDialogOpen) {
                                            setNewDealType({ ...newDealType, dealTypeAccessSecondary: value });
                                        } else {
                                            setEditDealType({ ...editDealType, dealTypeAccessSecondary: value });
                                        }
                                    }}
                                    className="col-span-3"
                                >
                                    <SelectTrigger id="dealTypeAccess">
                                        <SelectValue placeholder="Select access type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Both">Both</SelectItem>
                                        <SelectItem value="Administration">Administration</SelectItem>
                                        <SelectItem value="Client">Client</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="startDate" className="text-right">
                                    Start Date
                                </Label>
                                <Input
                                    id="startDate"
                                    placeholder="MM/DD/YYYY"
                                    value={isAddDealTypeDialogOpen ? newDealType.startDate : editDealType.startDate}
                                    onChange={(e) => {
                                        if (isAddDealTypeDialogOpen) {
                                            setNewDealType({ ...newDealType, startDate: e.target.value });
                                        } else {
                                            setEditDealType({ ...editDealType, startDate: e.target.value });
                                        }
                                    }}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="endDate" className="text-right">
                                    End Date
                                </Label>
                                <Input
                                    id="endDate"
                                    placeholder="MM/DD/YYYY"
                                    value={isAddDealTypeDialogOpen ? newDealType.endDate : editDealType.endDate}
                                    onChange={(e) => {
                                        if (isAddDealTypeDialogOpen) {
                                            setNewDealType({ ...newDealType, endDate: e.target.value });
                                        } else {
                                            setEditDealType({ ...editDealType, endDate: e.target.value });
                                        }
                                    }}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="naturalAccount" className="text-right">
                                    Natural Account
                                </Label>
                                <Input
                                    id="naturalAccount"
                                    value={isAddDealTypeDialogOpen ? newDealType.naturalAccount : editDealType.naturalAccount}
                                    onChange={(e) => {
                                        if (isAddDealTypeDialogOpen) {
                                            setNewDealType({ ...newDealType, naturalAccount: e.target.value });
                                        } else {
                                            setEditDealType({ ...editDealType, naturalAccount: e.target.value });
                                        }
                                    }}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="integrationClass" className="text-right">
                                    Integration Class
                                </Label>
                                <Input
                                    id="integrationClass"
                                    value={isAddDealTypeDialogOpen ? newDealType.integrationClass : editDealType.integrationClass}
                                    onChange={(e) => {
                                        if (isAddDealTypeDialogOpen) {
                                            setNewDealType({ ...newDealType, integrationClass: e.target.value });
                                        } else {
                                            setEditDealType({ ...editDealType, integrationClass: e.target.value });
                                        }
                                    }}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="category" className="text-right">
                                    Category
                                </Label>
                                <Input
                                    id="category"
                                    value={isAddDealTypeDialogOpen ? newDealType.category : editDealType.category}
                                    onChange={(e) => {
                                        if (isAddDealTypeDialogOpen) {
                                            setNewDealType({ ...newDealType, category: e.target.value });
                                        } else {
                                            setEditDealType({ ...editDealType, category: e.target.value });
                                        }
                                    }}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="terms" className="text-right">
                                    Terms
                                </Label>
                                <Input
                                    id="terms"
                                    value={isAddDealTypeDialogOpen ? newDealType.terms : editDealType.terms}
                                    onChange={(e) => {
                                        if (isAddDealTypeDialogOpen) {
                                            setNewDealType({ ...newDealType, terms: e.target.value });
                                        } else {
                                            setEditDealType({ ...editDealType, terms: e.target.value });
                                        }
                                    }}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="calendar" className="text-right">
                                    Calendar
                                </Label>
                                <Input
                                    id="calendar"
                                    value={isAddDealTypeDialogOpen ? newDealType.calendar : editDealType.calendar}
                                    onChange={(e) => {
                                        if (isAddDealTypeDialogOpen) {
                                            setNewDealType({ ...newDealType, calendar: e.target.value });
                                        } else {
                                            setEditDealType({ ...editDealType, calendar: e.target.value });
                                        }
                                    }}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Display Options</Label>
                                <div className="col-span-3 space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="displayProducts"
                                            checked={isAddDealTypeDialogOpen ? newDealType.displayProducts : editDealType.displayProducts}
                                            onCheckedChange={(checked) => {
                                                if (isAddDealTypeDialogOpen) {
                                                    setNewDealType({ ...newDealType, displayProducts: !!checked });
                                                } else {
                                                    setEditDealType({ ...editDealType, displayProducts: !!checked });
                                                }
                                            }}
                                        />
                                        <Label htmlFor="displayProducts">Display Products</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="displayDealDate"
                                            checked={isAddDealTypeDialogOpen ? newDealType.displayDealDate : editDealType.displayDealDate}
                                            onCheckedChange={(checked) => {
                                                if (isAddDealTypeDialogOpen) {
                                                    setNewDealType({ ...newDealType, displayDealDate: !!checked });
                                                } else {
                                                    setEditDealType({ ...editDealType, displayDealDate: !!checked });
                                                }
                                            }}
                                        />
                                        <Label htmlFor="displayDealDate">Display Deal Date</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="displayLumpsum"
                                            checked={isAddDealTypeDialogOpen ? newDealType.displayLumpsum : editDealType.displayLumpsum}
                                            onCheckedChange={(checked) => {
                                                if (isAddDealTypeDialogOpen) {
                                                    setNewDealType({ ...newDealType, displayLumpsum: !!checked });
                                                } else {
                                                    setEditDealType({ ...editDealType, displayLumpsum: !!checked });
                                                }
                                            }}
                                        />
                                        <Label htmlFor="displayLumpsum">Display Lumpsum</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="displayCustomer"
                                            checked={isAddDealTypeDialogOpen ? newDealType.displayCustomer : editDealType.displayCustomer}
                                            onCheckedChange={(checked) => {
                                                if (isAddDealTypeDialogOpen) {
                                                    setNewDealType({ ...newDealType, displayCustomer: !!checked });
                                                } else {
                                                    setEditDealType({ ...editDealType, displayCustomer: !!checked });
                                                }
                                            }}
                                        />
                                        <Label htmlFor="displayCustomer">Display Customer</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="displayAllowance"
                                            checked={isAddDealTypeDialogOpen ? newDealType.displayAllowance : editDealType.displayAllowance}
                                            onCheckedChange={(checked) => {
                                                if (isAddDealTypeDialogOpen) {
                                                    setNewDealType({ ...newDealType, displayAllowance: !!checked });
                                                } else {
                                                    setEditDealType({ ...editDealType, displayAllowance: !!checked });
                                                }
                                            }}
                                        />
                                        <Label htmlFor="displayAllowance">Display Allowance</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="allowAmendment"
                                            checked={isAddDealTypeDialogOpen ? newDealType.allowAmendment : editDealType.allowAmendment}
                                            onCheckedChange={(checked) => {
                                                if (isAddDealTypeDialogOpen) {
                                                    setNewDealType({ ...newDealType, allowAmendment: !!checked });
                                                } else {
                                                    setEditDealType({ ...editDealType, allowAmendment: !!checked });
                                                }
                                            }}
                                        />
                                        <Label htmlFor="allowAmendment">Allow Amendment</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="enableCascadeDeal"
                                            checked={
                                                isAddDealTypeDialogOpen ? newDealType.enableCascadeDeal : editDealType.enableCascadeDeal
                                            }
                                            onCheckedChange={(checked) => {
                                                if (isAddDealTypeDialogOpen) {
                                                    setNewDealType({ ...newDealType, enableCascadeDeal: !!checked });
                                                } else {
                                                    setEditDealType({ ...editDealType, enableCascadeDeal: !!checked });
                                                }
                                            }}
                                        />
                                        <Label htmlFor="enableCascadeDeal">Enable Cascade Deal</Label>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <div className="text-right">Status</div>
                                <div className="col-span-3 flex items-center gap-2">
                                    <Checkbox
                                        id="isActive"
                                        checked={isAddDealTypeDialogOpen ? newDealType.isActive : editDealType.isActive}
                                        onCheckedChange={(checked) => {
                                            if (isAddDealTypeDialogOpen) {
                                                setNewDealType({ ...newDealType, isActive: !!checked });
                                            } else {
                                                setEditDealType({ ...editDealType, isActive: !!checked });
                                            }
                                        }}
                                    />
                                    <Label htmlFor="isActive">Active</Label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsAddDealTypeDialogOpen(false);
                                setIsEditDealTypeDialogOpen(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={isAddDealTypeDialogOpen ? handleSaveNewDealType : handleSaveEditDealType}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {isAddDealTypeDialogOpen ? "Save" : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}