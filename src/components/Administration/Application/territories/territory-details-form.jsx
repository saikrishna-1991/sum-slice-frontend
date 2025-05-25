"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Info, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"

export function TerritoryDetailsForm({
    onNext,
    onCancel,
    initialData,
    updateFormData,
    errors = {},
}) {
    const [formData, setFormData] = useState({
        operatingUnit: initialData?.operatingUnit || "OU USA",
        parentTerritoryName: initialData?.parentTerritoryName || "OU USA",
        parentTerritoryEffectivity: initialData?.parentTerritoryEffectivity || "",
        territoryName: initialData?.territoryName || "CONFECTIONERY",
        description: initialData?.description || "CONFECTIONERY",
        rank: initialData?.rank || "100",
        winners: initialData?.winners || "1",
        startDate: initialData?.startDate ? new Date(initialData.startDate) : new Date("2012-02-12"),
        endDate: initialData?.endDate ? new Date(initialData.endDate) : new Date("2099-12-31"),
        brokerCommission: initialData?.brokerCommission || "0",
        region: initialData?.region || "",
        countryUnit: initialData?.countryUnit || "",
        alternateApproval: initialData?.alternateApproval || "",
        priceList: initialData?.priceList || "",
        allocationEnabled: initialData?.allocationEnabled || false,
        color: initialData?.color || "#3B82F6",
        priority: initialData?.priority || "Medium",
    })

    // Only initialize form data when component mounts or initialData changes significantly
    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setFormData({
                operatingUnit: initialData.operatingUnit || "OU USA",
                parentTerritoryName: initialData.parentTerritoryName || "OU USA",
                parentTerritoryEffectivity: initialData.parentTerritoryEffectivity || "",
                territoryName: initialData.territoryName || "CONFECTIONERY",
                description: initialData.description || "CONFECTIONERY",
                rank: initialData.rank || "100",
                winners: initialData.winners || "1",
                startDate: initialData.startDate ? new Date(initialData.startDate) : new Date("2012-02-12"),
                endDate: initialData.endDate ? new Date(initialData.endDate) : new Date("2099-12-31"),
                brokerCommission: initialData.brokerCommission || "0",
                region: initialData.region || "",
                countryUnit: initialData.countryUnit || "",
                alternateApproval: initialData.alternateApproval || "",
                priceList: initialData.priceList || "",
                allocationEnabled: initialData.allocationEnabled || false,
                color: initialData.color || "#3B82F6",
                priority: initialData.priority || "Medium",
            })
        }
    }, []) // Only run once on mount

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSwitchChange = (checked) => {
        setFormData((prev) => ({ ...prev, allocationEnabled: checked }))
    }

    const handleSliderChange = (value) => {
        setFormData((prev) => ({ ...prev, brokerCommission: value[0].toString() }))
    }

    const handleNext = () => {
        // Update parent form data only when advancing to next step
        updateFormData(formData)
        onNext()
    }

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Territory Details</h3>
                <p className="text-sm text-blue-600">
                    Enter the basic information for this territory. All fields are optional.
                </p>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-y-6 items-start">
                <Label htmlFor="operatingUnit" className="text-right mr-4 mt-2">
                    Operating Unit
                </Label>
                <div className="space-y-1">
                    <Input
                        id="operatingUnit"
                        name="operatingUnit"
                        value={formData.operatingUnit}
                        onChange={handleInputChange}
                        className="max-w-md"
                    />
                </div>

                <Label htmlFor="parentTerritoryName" className="text-right mr-4 mt-2">
                    Parent Territory Name
                </Label>
                <div className="space-y-1">
                    <div className="flex items-center max-w-md">
                        <Input
                            id="parentTerritoryName"
                            name="parentTerritoryName"
                            value={formData.parentTerritoryName}
                            onChange={handleInputChange}
                            className="flex-1"
                        />
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="ml-1">
                                        <Search className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    <p>Search for parent territories</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

                <Label htmlFor="territoryName" className="text-right mr-4 mt-2">
                    Territory Name
                </Label>
                <div className="space-y-1">
                    <Input
                        id="territoryName"
                        name="territoryName"
                        value={formData.territoryName}
                        onChange={handleInputChange}
                        className="max-w-md"
                    />
                </div>

                <Label htmlFor="description" className="text-right mr-4 mt-2">
                    Description
                </Label>
                <div className="space-y-1">
                    <div className="relative max-w-md">
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                </div>

                <Label htmlFor="color" className="text-right mr-4 mt-2">
                    Territory Color
                </Label>
                <div className="space-y-1">
                    <div className="flex items-center max-w-md gap-2">
                        <Input
                            type="color"
                            id="color"
                            name="color"
                            value={formData.color}
                            onChange={handleInputChange}
                            className="w-12 h-8 p-1"
                        />
                        <div className="w-8 h-8 rounded-md border" style={{ backgroundColor: formData.color }}></div>
                        <span className="text-sm text-gray-500">{formData.color}</span>
                    </div>
                    <p className="text-xs text-gray-500">Choose a color to visually identify this territory</p>
                </div>

                <Label htmlFor="priority" className="text-right mr-4 mt-2">
                    Priority
                </Label>
                <div className="space-y-1">
                    <div className="flex items-center max-w-md">
                        <div className="flex items-center space-x-2">
                            {["Low", "Medium", "High"].map((priority) => (
                                <Button
                                    key={priority}
                                    type="button"
                                    variant={formData.priority === priority ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setFormData((prev) => ({ ...prev, priority }))}
                                    className={cn(
                                        "min-w-[80px]",
                                        formData.priority === priority &&
                                        (priority === "Low"
                                            ? "bg-blue-500 hover:bg-blue-600"
                                            : priority === "Medium"
                                                ? "bg-yellow-500 hover:bg-yellow-600"
                                                : "bg-red-500 hover:bg-red-600"),
                                    )}
                                >
                                    {priority}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                <Label htmlFor="rank" className="text-right mr-4 mt-2">
                    Rank
                </Label>
                <div className="space-y-1">
                    <Input
                        id="rank"
                        name="rank"
                        value={formData.rank}
                        onChange={handleInputChange}
                        className="max-w-[100px]"
                        type="number"
                    />
                    <p className="text-xs text-gray-500">Determines the display order (lower ranks appear first)</p>
                </div>

                <Label htmlFor="winners" className="text-right mr-4 mt-2">
                    Winners
                </Label>
                <div className="space-y-1">
                    <Input
                        id="winners"
                        name="winners"
                        value={formData.winners}
                        onChange={handleInputChange}
                        className="max-w-[100px]"
                        type="number"
                    />
                </div>

                <Label htmlFor="startDate" className="text-right mr-4 mt-2">
                    Start Date
                </Label>
                <div className="space-y-1">
                    <div className="flex max-w-md">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-[200px] justify-start text-left font-normal",
                                        !formData.startDate && "text-muted-foreground",
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {formData.startDate ? format(formData.startDate, "dd-MMM-yyyy") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={formData.startDate}
                                    onSelect={(date) => setFormData((prev) => ({ ...prev, startDate: date || new Date() }))}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="ml-1">
                                        <CalendarIcon className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    <p>Select the date when this territory becomes active</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

                <Label htmlFor="endDate" className="text-right mr-4 mt-2">
                    End Date
                </Label>
                <div className="space-y-1">
                    <div className="flex max-w-md">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-[200px] justify-start text-left font-normal",
                                        !formData.endDate && "text-muted-foreground",
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {formData.endDate ? format(formData.endDate, "dd-MMM-yyyy") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={formData.endDate}
                                    onSelect={(date) => setFormData((prev) => ({ ...prev, endDate: date || new Date() }))}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="ml-1">
                                        <CalendarIcon className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    <p>Select the date when this territory becomes inactive</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

                <Label htmlFor="brokerCommission" className="text-right mr-4 mt-2">
                    Broker Commission %
                </Label>
                <div className="space-y-1 max-w-md">
                    <div className="flex items-center gap-4">
                        <Slider
                            defaultValue={[Number.parseFloat(formData.brokerCommission) || 0]}
                            max={100}
                            step={1}
                            onValueChange={handleSliderChange}
                            className="flex-1"
                        />
                        <span className="w-12 text-center font-medium">{formData.brokerCommission}%</span>
                    </div>
                </div>

                <Label htmlFor="region" className="text-right mr-4 mt-2">
                    Region
                </Label>
                <div className="space-y-1">
                    <Input id="region" name="region" value={formData.region} onChange={handleInputChange} className="max-w-md" />
                </div>

                <Label htmlFor="countryUnit" className="text-right mr-4 mt-2">
                    Country Unit
                </Label>
                <div className="space-y-1">
                    <Input
                        id="countryUnit"
                        name="countryUnit"
                        value={formData.countryUnit}
                        onChange={handleInputChange}
                        className="max-w-md"
                    />
                </div>

                <Label htmlFor="alternateApproval" className="text-right mr-4 mt-2">
                    Alternate Approval #
                </Label>
                <div className="space-y-1">
                    <Input
                        id="alternateApproval"
                        name="alternateApproval"
                        value={formData.alternateApproval}
                        onChange={handleInputChange}
                        className="max-w-md"
                    />
                </div>

                <Label htmlFor="priceList" className="text-right mr-4 mt-2">
                    Price List
                </Label>
                <div className="space-y-1">
                    <Input
                        id="priceList"
                        name="priceList"
                        value={formData.priceList}
                        onChange={handleInputChange}
                        className="max-w-md"
                    />
                </div>

                <Label htmlFor="allocationEnabled" className="text-right mr-4 mt-2">
                    Allocation Enabled
                </Label>
                <div className="flex items-center space-x-2">
                    <Switch id="allocationEnabled" checked={formData.allocationEnabled} onCheckedChange={handleSwitchChange} />
                    <span className="text-sm text-gray-700">{formData.allocationEnabled ? "Enabled" : "Disabled"}</span>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <Info className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="max-w-xs">
                                <p>
                                    When enabled, this territory will be included in the allocation process. This allows resources to be
                                    automatically distributed based on territory settings.
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </div>
    )
}
