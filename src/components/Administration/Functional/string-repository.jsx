"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronRight, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Sample data for string categories
const stringCategories = {
    buttonLabels: [
        { name: "DEALS", expanded: false, items: ["Add Deal", "Edit Deal", "Delete Deal", "Save Deal"] },
        { name: "FUNDS", expanded: false, items: ["Create Fund", "Update Fund", "Remove Fund"] },
        { name: "ITEMS", expanded: false, items: ["New Item", "Edit Item", "Delete Item"] },
        { name: "PAYMENTS", expanded: false, items: ["Process Payment", "Cancel Payment", "Refund"] },
        { name: "PLANS", expanded: false, items: ["Create Plan", "Modify Plan", "Archive Plan"] },
        { name: "PRICELIST", expanded: false, items: ["Add Price", "Update Price", "Remove Price"] },
        { name: "SETUP", expanded: false, items: ["Configure", "Initialize", "Reset"] },
        { name: "VENDORDASHBOARD", expanded: false, items: ["View Dashboard", "Export Data", "Refresh"] },
    ],
    formFieldLabels: [
        { name: "BIDS", expanded: false, items: ["Bid Amount", "Bid Date", "Bidder Name"] },
        { name: "BILLBACK", expanded: false, items: ["Invoice Number", "Amount Due", "Due Date"] },
        { name: "CLAIMS", expanded: false, items: ["Claim ID", "Claim Type", "Status"] },
        { name: "COMMON", expanded: false, items: ["Name", "Description", "Date Created"] },
        { name: "COMPANIES", expanded: false, items: ["Company Name", "Address", "Phone"] },
        { name: "CUSTOMERDASHBOARD", expanded: false, items: ["Customer ID", "Last Login", "Status"] },
        { name: "DASHBOARD", expanded: false, items: ["Total Sales", "Active Users", "Revenue"] },
    ],
    panelTitles: [
        { name: "DIALOGS", expanded: false, items: ["Confirmation Dialog", "Error Dialog", "Info Dialog"] },
        { name: "WINDOWS", expanded: false, items: ["Main Window", "Settings Window", "Help Window"] },
        { name: "POPUPS", expanded: false, items: ["Quick Actions", "Notifications", "Alerts"] },
    ],
    navigationTitles: [
        { name: "MAIN_MENU", expanded: false, items: ["Home", "Dashboard", "Reports"] },
        { name: "SUB_MENU", expanded: false, items: ["Settings", "Profile", "Logout"] },
        { name: "BREADCRUMBS", expanded: false, items: ["Home > Dashboard", "Settings > Profile"] },
    ],
}

const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
]

export default function StringRepositoryPage() {
    const [selectedLanguage, setSelectedLanguage] = useState("en")
    const [activeTab, setActiveTab] = useState("button-labels")
    const [expandedCategories, setExpandedCategories] = useState({})
    const [selectedString, setSelectedString] = useState(null)

    const toggleCategory = (categoryName) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [categoryName]: !prev[categoryName],
        }))
    }

    const handleStringSelect = (category, item) => {
        setSelectedString({
            category,
            item,
            value: item, // Default value, in real app this would come from database
        })
    }

    const handleSave = () => {
        // Implement save logic
        console.log("Saving string repository changes...")
    }

    const handleClearChanges = () => {
        // Implement clear changes logic
        console.log("Clearing changes...")
        setSelectedString(null)
    }

    const getCurrentCategories = () => {
        switch (activeTab) {
            case "button-labels":
                return stringCategories.buttonLabels
            case "form-field-labels":
                return stringCategories.formFieldLabels
            case "panel-titles":
                return stringCategories.panelTitles
            case "navigation-titles":
                return stringCategories.navigationTitles
            default:
                return stringCategories.buttonLabels
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">String Repository</h2>
                <div className="flex items-center gap-2">
                    <Button onClick={handleSave}>Save</Button>
                    <Button variant="outline" onClick={handleClearChanges}>
                        Clear Changes
                    </Button>
                </div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-2">
                <Label htmlFor="language" className="text-sm font-medium">
                    Language:
                </Label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-48">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {languages.map((lang) => (
                            <SelectItem key={lang.code} value={lang.code}>
                                {lang.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel - Categories and Tabs */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardContent className="p-0">
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <TabsList className="grid w-full grid-cols-4 rounded-none border-b">
                                    <TabsTrigger value="button-labels" className="text-xs">
                                        Button Labels
                                    </TabsTrigger>
                                    <TabsTrigger value="form-field-labels" className="text-xs">
                                        Form Field Labels & Grid Column Names
                                    </TabsTrigger>
                                    <TabsTrigger value="panel-titles" className="text-xs">
                                        Panel, Window & Popup Titles
                                    </TabsTrigger>
                                    <TabsTrigger value="navigation-titles" className="text-xs">
                                        Navigation Menu Titles
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value={activeTab} className="p-4 space-y-2">
                                    {getCurrentCategories().map((category) => (
                                        <Collapsible
                                            key={category.name}
                                            open={expandedCategories[category.name]}
                                            onOpenChange={() => toggleCategory(category.name)}
                                        >
                                            <CollapsibleTrigger className="flex items-center gap-2 w-full text-left p-2 hover:bg-gray-50 rounded">
                                                {expandedCategories[category.name] ? (
                                                    <ChevronDown className="h-4 w-4" />
                                                ) : (
                                                    <ChevronRight className="h-4 w-4" />
                                                )}
                                                <span className="font-medium text-sm">{category.name}</span>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="ml-6 space-y-1">
                                                {category.items.map((item, index) => (
                                                    <button
                                                        key={index}
                                                        className="block w-full text-left p-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                                                        onClick={() => handleStringSelect(category.name, item)}
                                                    >
                                                        {item}
                                                    </button>
                                                ))}
                                            </CollapsibleContent>
                                        </Collapsible>
                                    ))}
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Panel - String Editor */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardContent className="p-4">
                            <h3 className="text-lg font-semibold mb-4">String Editor</h3>
                            {selectedString ? (
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="category" className="text-sm font-medium">
                                            Category
                                        </Label>
                                        <Input id="category" value={selectedString.category} disabled className="mt-1" />
                                    </div>
                                    <div>
                                        <Label htmlFor="string-key" className="text-sm font-medium">
                                            String Key
                                        </Label>
                                        <Input id="string-key" value={selectedString.item} disabled className="mt-1" />
                                    </div>
                                    <div>
                                        <Label htmlFor="string-value" className="text-sm font-medium">
                                            String Value ({languages.find((l) => l.code === selectedLanguage)?.name})
                                        </Label>
                                        <Textarea
                                            id="string-value"
                                            value={selectedString.value}
                                            onChange={(e) =>
                                                setSelectedString({
                                                    ...selectedString,
                                                    value: e.target.value,
                                                })
                                            }
                                            className="mt-1"
                                            rows={3}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                // Save individual string
                                                console.log("Saving string:", selectedString)
                                            }}
                                        >
                                            Save String
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => setSelectedString(null)}>
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    <p>Select a string from the categories to edit</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
