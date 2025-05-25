"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Download, Edit, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { TerritoryModal } from "./territory-modal"

// Mock data for territories
const mockTerritories = [
    {
        id: 1,
        name: "OU USA",
        type: "Business Unit",
        rank: 106,
        winners: 1,
        startDate: "12-Jul-2012",
        endDate: "31-Dec-2099",
        level: 0,
        expanded: true,
        children: [
            {
                id: 2,
                name: "CONFECTIONERY",
                type: "Business Unit",
                rank: 106,
                winners: 1,
                startDate: "12-Jul-2012",
                endDate: "31-Dec-2099",
                level: 1,
                expanded: true,
                children: [
                    {
                        id: 3,
                        name: "1 - CATEGORY",
                        type: "Unison",
                        rank: 90,
                        winners: 1,
                        startDate: "12-Jul-2012",
                        endDate: "31-Dec-2099",
                        level: 2,
                        expanded: false,
                        children: [],
                    },
                    {
                        id: 4,
                        name: "1 - GROCERY & CHANNELS",
                        type: "Division",
                        rank: 90,
                        winners: 1,
                        startDate: "12-Jul-2012",
                        endDate: "31-Dec-2099",
                        level: 2,
                        expanded: false,
                        children: [],
                    },
                    {
                        id: 5,
                        name: "10 - C2 TRADE SPENDING OFFSITE",
                        type: "Division",
                        rank: 90,
                        winners: 1,
                        startDate: "12-Jul-2012",
                        endDate: "31-Dec-2099",
                        level: 2,
                        expanded: false,
                        children: [],
                    },
                    {
                        id: 6,
                        name: "3 - C & S (Sample)",
                        type: "Division",
                        rank: 90,
                        winners: 1,
                        startDate: "24-Jan-2016",
                        endDate: "31-Dec-2099",
                        level: 2,
                        expanded: false,
                        children: [],
                    },
                    {
                        id: 7,
                        name: "7 - MARS & CLUB",
                        type: "Unison",
                        rank: 90,
                        winners: 1,
                        startDate: "12-Jul-2012",
                        endDate: "31-Dec-2099",
                        level: 2,
                        expanded: false,
                        children: [],
                    },
                    {
                        id: 8,
                        name: "2 - VOLUME (sample)",
                        type: "Division",
                        rank: 90,
                        winners: 1,
                        startDate: "12-Jul-2012",
                        endDate: "31-Dec-2099",
                        level: 2,
                        expanded: false,
                        children: [],
                    },
                    {
                        id: 9,
                        name: "5 - COMMERCIAL",
                        type: "Division",
                        rank: 90,
                        winners: 1,
                        startDate: "15-Mar-2013",
                        endDate: "31-Dec-2099",
                        level: 2,
                        expanded: false,
                        children: [],
                    },
                    {
                        id: 10,
                        name: "8 - MISCELLANEOUS BILLING",
                        type: "Division",
                        rank: 90,
                        winners: 1,
                        startDate: "12-Jul-2012",
                        endDate: "31-Dec-2099",
                        level: 2,
                        expanded: false,
                        children: [],
                    },
                    {
                        id: 11,
                        name: "9 - CANADA",
                        type: "Unison",
                        rank: 90,
                        winners: 1,
                        startDate: "12-Jul-2012",
                        endDate: "31-Dec-2099",
                        level: 2,
                        expanded: false,
                        children: [],
                    },
                    {
                        id: 12,
                        name: "9 - MEXICO/CARIPBRA",
                        type: "Division",
                        rank: 90,
                        winners: 1,
                        startDate: "12-Jul-2012",
                        endDate: "31-Dec-2099",
                        level: 2,
                        expanded: false,
                        children: [],
                    },
                ],
            },
            {
                id: 13,
                name: "DIGITAL",
                type: "Business Unit",
                rank: 106,
                winners: 1,
                startDate: "26-Jun-2013",
                endDate: "31-Dec-2099",
                level: 1,
                expanded: false,
                children: [],
            },
            {
                id: 14,
                name: "SPORTS AND ENTERTAINMENT",
                type: "Business Unit",
                rank: 106,
                winners: 1,
                startDate: "25-Jul-2012",
                endDate: "31-Dec-2099",
                level: 1,
                expanded: false,
                children: [],
            },
        ],
    },
]

export default function TerritoriesPage() {
    const [territories, setTerritories] = useState(mockTerritories)
    const [selectedRows, setSelectedRows] = useState([])
    const [operatingUnit, setOperatingUnit] = useState("OU USA")
    const [usage, setUsage] = useState("Trade Management")
    const [view, setView] = useState("Active On")
    const [date, setDate] = useState("02-May-2025")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState("create")
    const [selectedTerritory, setSelectedTerritory] = useState(null)

    // Function to toggle expansion of a territory
    const toggleExpand = (id) => {
        const updateExpansion = (items) => {
            return items.map((item) => {
                if (item.id === id) {
                    return { ...item, expanded: !item.expanded }
                }
                if (item.children && item.children.length > 0) {
                    return { ...item, children: updateExpansion(item.children) }
                }
                return item
            })
        }

        setTerritories(updateExpansion(territories))
    }

    // Function to expand all territories
    const expandAll = () => {
        const expandAllItems = (items) => {
            return items.map((item) => {
                if (item.children && item.children.length > 0) {
                    return { ...item, expanded: true, children: expandAllItems(item.children) }
                }
                return { ...item, expanded: true }
            })
        }

        setTerritories(expandAllItems(territories))
    }

    // Function to collapse all territories
    const collapseAll = () => {
        const collapseAllItems = (items) => {
            return items.map((item) => {
                if (item.children && item.children.length > 0) {
                    return { ...item, expanded: false, children: collapseAllItems(item.children) }
                }
                return { ...item, expanded: false }
            })
        }

        setTerritories(collapseAllItems(territories))
    }

    // Function to toggle selection of a row
    const toggleRowSelection = (id) => {
        if (selectedRows.includes(id)) {
            setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
        } else {
            setSelectedRows([...selectedRows, id])
        }
    }

    // Function to open the create territory modal
    const handleCreateTerritory = () => {
        setModalMode("create")
        setSelectedTerritory(null)
        setIsModalOpen(true)
    }

    // Function to open the edit territory modal
    const handleEditTerritory = (territory) => {
        setModalMode("edit")
        setSelectedTerritory(territory)
        setIsModalOpen(true)
    }

    // Function to find a territory by ID
    const findTerritoryById = (id, items) => {
        for (const item of items) {
            if (item.id === id) {
                return item
            }
            if (item.children && item.children.length > 0) {
                const found = findTerritoryById(id, item.children)
                if (found) {
                    return found
                }
            }
        }
        return null
    }

    // Function to render the table rows recursively
    const renderRows = (items) => {
        const rows = []

        items.forEach((item) => {
            rows.push(
                <TableRow key={item.id} className="border-b border-gray-200">
                    <TableCell className="py-2">
                        <Checkbox checked={selectedRows.includes(item.id)} onCheckedChange={() => toggleRowSelection(item.id)} />
                    </TableCell>
                    <TableCell className="py-2">
                        <div className="flex items-center">
                            <div style={{ marginLeft: `${item.level * 20}px` }} className="flex items-center">
                                {item.children && item.children.length > 0 ? (
                                    <button onClick={() => toggleExpand(item.id)} className="mr-1 text-gray-500 hover:text-gray-700">
                                        {item.expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                    </button>
                                ) : (
                                    <div className="w-4 mr-1"></div>
                                )}
                                <span className="font-medium">{item.name}</span>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell className="py-2">{item.type}</TableCell>
                    <TableCell className="py-2 text-center">{item.rank}</TableCell>
                    <TableCell className="py-2 text-center">{item.winners}</TableCell>
                    <TableCell className="py-2">{item.startDate}</TableCell>
                    <TableCell className="py-2">{item.endDate}</TableCell>
                    <TableCell className="py-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                        </Button>
                    </TableCell>
                    <TableCell className="py-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-yellow-500"
                            onClick={() => handleEditTerritory(item)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                    </TableCell>
                    <TableCell className="py-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </TableCell>
                </TableRow>,
            )

            if (item.expanded && item.children && item.children.length > 0) {
                rows.push(...renderRows(item.children))
            }
        })

        return rows
    }

    return (
        <div className="p-6">
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-bold">Territories</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <h2 className="text-sm font-semibold mb-2 border-b pb-1">Views</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div>
                                <div className="flex items-center mb-1">
                                    <span className="text-sm font-medium mr-2">Operating Unit</span>
                                </div>
                                <Select value={operatingUnit} onValueChange={setOperatingUnit}>
                                    <SelectTrigger className="h-8">
                                        <SelectValue placeholder="Select operating unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="OU USA">OU USA</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <div className="flex items-center mb-1">
                                    <span className="text-sm font-medium mr-2">Usage</span>
                                </div>
                                <Select value={usage} onValueChange={setUsage}>
                                    <SelectTrigger className="h-8">
                                        <SelectValue placeholder="Select usage" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Trade Management">Trade Management</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <div className="flex items-center mb-1">
                                    <span className="text-sm font-medium mr-2">View</span>
                                </div>
                                <Select value={view} onValueChange={setView}>
                                    <SelectTrigger className="h-8">
                                        <SelectValue placeholder="Select view" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active On">Active On</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <div className="flex items-center mb-1">
                                    <span className="text-sm font-medium mr-2">Date</span>
                                </div>
                                <div className="flex items-center">
                                    <Input type="text" value={date} onChange={(e) => setDate(e.target.value)} className="h-8 mr-2" />
                                    <Button size="sm" className="h-8">
                                        Go
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                                Select Territory
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleCreateTerritory}>
                                <Plus className="h-4 w-4 mr-1" />
                                Create
                            </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="link" size="sm" className="text-blue-600 h-8 px-2" onClick={expandAll}>
                                Expand All
                            </Button>
                            <span className="text-gray-400">|</span>
                            <Button variant="link" size="sm" className="text-blue-600 h-8 px-2" onClick={collapseAll}>
                                Collapse All
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="w-[40px]">
                                        <Checkbox />
                                    </TableHead>
                                    <TableHead>Focus Name</TableHead>
                                    <TableHead>Territory Type</TableHead>
                                    <TableHead className="text-center">Rank</TableHead>
                                    <TableHead className="text-center">Winners</TableHead>
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>End Date</TableHead>
                                    <TableHead className="w-[50px]">Export</TableHead>
                                    <TableHead className="w-[50px]">Update</TableHead>
                                    <TableHead className="w-[50px]">Delete</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>{renderRows(territories)}</TableBody>
                        </Table>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                                Select Territory
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleCreateTerritory}>
                                <Plus className="h-4 w-4 mr-1" />
                                Create
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <TerritoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={selectedTerritory}
                mode={modalMode}
            />
        </div>
    )
}
