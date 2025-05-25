"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Search, X } from "lucide-react"

// Mock data for regions
const regions = [
    "North America",
    "South America",
    "Europe",
    "Asia Pacific",
    "Middle East",
    "Africa",
    "Central America",
    "Caribbean",
    "Oceania",
    "Eastern Europe",
    "Western Europe",
    "Northern Europe",
    "Southern Europe",
    "Southeast Asia",
    "East Asia",
    "South Asia",
    "Central Asia",
    "North Africa",
    "Sub-Saharan Africa",
    "Nordic Countries",
]

// Mock data for postal codes
const postalCodes = [
    "10001-10999",
    "20001-20999",
    "30001-30999",
    "40001-40999",
    "50001-50999",
    "60001-60999",
    "70001-70999",
    "80001-80999",
    "90001-90999",
    "11001-11999",
    "21001-21999",
    "31001-31999",
    "41001-41999",
    "51001-51999",
    "61001-61999",
    "71001-71999",
    "81001-81999",
    "91001-91999",
    "12001-12999",
    "22001-22999",
]

export function TerritoryGeographyForm({
    onNext,
    onBack,
    onCancel,
    onFinish,
    initialData,
    updateFormData,
}) {
    const [activeTab, setActiveTab] = useState("regions")
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedRegions, setSelectedRegions] = useState([])
    const [selectedPostalCodes, setSelectedPostalCodes] = useState([])

    // Initialize form data only once when component mounts
    useEffect(() => {
        if (initialData) {
            setSelectedRegions(initialData.selectedRegions || [])
            setSelectedPostalCodes(initialData.selectedPostalCodes || [])
        }
    }, []) // Only run once on mount

    const filteredRegions = regions.filter((region) => region.toLowerCase().includes(searchTerm.toLowerCase()))

    const filteredPostalCodes = postalCodes.filter((code) => code.toLowerCase().includes(searchTerm.toLowerCase()))

    const toggleRegion = (region) => {
        setSelectedRegions((prev) => (prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]))
    }

    const togglePostalCode = (code) => {
        setSelectedPostalCodes((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]))
    }

    const removeRegion = (region) => {
        setSelectedRegions((prev) => prev.filter((r) => r !== region))
    }

    const removePostalCode = (code) => {
        setSelectedPostalCodes((prev) => prev.filter((c) => c !== code))
    }

    const handleNext = () => {
        // Update parent form data only when advancing to next step
        updateFormData({
            selectedRegions,
            selectedPostalCodes,
        })
        onNext()
    }

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Define Geography</h3>
                <p className="text-sm text-blue-600">
                    Select the regions and postal codes that define this territory's geographical boundaries.
                </p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <Input
                        placeholder={`Search ${activeTab === "regions" ? "regions" : "postal codes"}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-md"
                    />
                </div>

                <Tabs defaultValue="regions" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="regions">Regions</TabsTrigger>
                        <TabsTrigger value="postalCodes">Postal Codes</TabsTrigger>
                    </TabsList>
                    <TabsContent value="regions" className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto p-2 border rounded-md">
                            {filteredRegions.length > 0 ? (
                                filteredRegions.map((region) => (
                                    <div key={region} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`region-${region}`}
                                            checked={selectedRegions.includes(region)}
                                            onCheckedChange={() => toggleRegion(region)}
                                        />
                                        <Label htmlFor={`region-${region}`} className="text-sm cursor-pointer">
                                            {region}
                                        </Label>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-4 text-gray-500">No regions found</div>
                            )}
                        </div>

                        {selectedRegions.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium mb-2">Selected Regions ({selectedRegions.length})</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedRegions.map((region) => (
                                        <Badge key={region} variant="secondary" className="flex items-center gap-1">
                                            {region}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-4 w-4 p-0 hover:bg-transparent"
                                                onClick={() => removeRegion(region)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="postalCodes" className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto p-2 border rounded-md">
                            {filteredPostalCodes.length > 0 ? (
                                filteredPostalCodes.map((code) => (
                                    <div key={code} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`code-${code}`}
                                            checked={selectedPostalCodes.includes(code)}
                                            onCheckedChange={() => togglePostalCode(code)}
                                        />
                                        <Label htmlFor={`code-${code}`} className="text-sm cursor-pointer">
                                            {code}
                                        </Label>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-4 text-gray-500">No postal codes found</div>
                            )}
                        </div>

                        {selectedPostalCodes.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium mb-2">Selected Postal Codes ({selectedPostalCodes.length})</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedPostalCodes.map((code) => (
                                        <Badge key={code} variant="outline" className="flex items-center gap-1">
                                            {code}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-4 w-4 p-0 hover:bg-transparent"
                                                onClick={() => removePostalCode(code)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
