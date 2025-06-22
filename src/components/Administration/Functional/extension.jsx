"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Download } from "lucide-react"

// Sample data for extension tables
const extensionTables = [
    {
        id: 1,
        name: "Efer Deal Headers Extn",
        description: "Deal headers extension table",
        tableName: "efer_deal_headers_ext",
        selected: false,
    },
    {
        id: 2,
        name: "Efer Deal Allowances Extn",
        description: "Deal Allowances extension table",
        tableName: "efer_deal_item_allowances_ext",
        selected: false,
    },
    {
        id: 3,
        name: "Efer Deal Dates Extn",
        description: "Deal dates extension table",
        tableName: "efer_deal_dates_ext",
        selected: false,
    },
    {
        id: 4,
        name: "Efer Deal Lumpsum Extn",
        description: "Deal lumpsum extn table",
        tableName: "efer_deal_other_fees_ext",
        selected: false,
    },
    {
        id: 5,
        name: "Efer Deal Customers Extn",
        description: "Deal customers extn table",
        tableName: "efer_deal_customers_ext",
        selected: false,
    },
    {
        id: 6,
        name: "Efer Deal Products Extn",
        description: "Deal products extn table",
        tableName: "efer_deal_products_ext",
        selected: false,
    },
    {
        id: 7,
        name: "Efer Bid Headers Extn",
        description: "Bid headers extension table",
        tableName: "efer_bid_headers_ext",
        selected: false,
    },
    {
        id: 8,
        name: "Efer Bid Products Extn",
        description: "Bid Products extension table",
        tableName: "efer_bid_products_ext",
        selected: false,
    },
    {
        id: 9,
        name: "Efer Claim Headers Extn",
        description: "Claim Header extension table",
        tableName: "efer_claim_header_ext",
        selected: false,
    },
    {
        id: 10,
        name: "Efer Claim Products Extn",
        description: "Claim Products extension table",
        tableName: "efer_claim_products_ext",
        selected: false,
    },
    {
        id: 11,
        name: "Efer Pricelist Headers Extn",
        description: "Pricelist Headers extension table",
        tableName: "efer_price_lists_ext",
        selected: false,
    },
    {
        id: 12,
        name: "Efer Pricelist Products Extn",
        description: "Pricelist Products extension table",
        tableName: "efer_price_list_items_ext",
        selected: false,
    },
    {
        id: 13,
        name: "Efer Payments Headers Extn",
        description: "Payments Headers extension table",
        tableName: "efer_payment_headers_ext",
        selected: false,
    },
    {
        id: 14,
        name: "Efer Payments Products Extn",
        description: "Payments Products extension table",
        tableName: "efer_rebate_items_ext",
        selected: false,
    },
    {
        id: 15,
        name: "Efer Payments Rebates Extn",
        description: "Payments Rebates extension table",
        tableName: "efer_payment_rebates_ext",
        selected: false,
    },
    {
        id: 16,
        name: "Efer Billback Headers Extn",
        description: "Billback Headers extension table",
        tableName: "efer_billback_headers_ext",
        selected: false,
    },
    {
        id: 17,
        name: "Efer Billback Items Extn",
        description: "Billback Items extension table",
        tableName: "efer_billback_items_ext",
        selected: false,
    },
    {
        id: 18,
        name: "Efer Fund Headers Extn",
        description: "Fund Headers extension table",
        tableName: "efer_fund_headers_ext",
        selected: false,
    },
    {
        id: 19,
        name: "Efer Fund Allocations Extn",
        description: "Fund Allocations extension table",
        tableName: "efer_fundallocations_ext",
        selected: false,
    },
]

export default function ExtensionPage() {
    const [tables, setTables] = useState(extensionTables)
    const [selectAll, setSelectAll] = useState(false)

    const handleSelectAll = (checked) => {
        setSelectAll(checked)
        setTables(tables.map((table) => ({ ...table, selected: checked })))
    }

    const handleSelectTable = (id, checked) => {
        const updatedTables = tables.map((table) => (table.id === id ? { ...table, selected: checked } : table))
        setTables(updatedTables)

        // Update select all state
        const allSelected = updatedTables.every((table) => table.selected)
        const noneSelected = updatedTables.every((table) => !table.selected)
        setSelectAll(allSelected)
    }

    const handleExport = () => {
        const selectedTables = tables.filter((table) => table.selected)
        console.log("Exporting selected tables:", selectedTables)
        // Implement export logic
    }

    const handleTableClick = (tableName) => {
        console.log("Opening table details for:", tableName)
        // Implement table detail view logic
    }

    const selectedCount = tables.filter((table) => table.selected).length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Extension Tables</h2>
            </div>

            {/* Export Button */}
            <div className="flex justify-start">
                <Button variant="outline" onClick={handleExport} disabled={selectedCount === 0}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                </Button>
            </div>

            {/* Extension Tables */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
                                </TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Table Name</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tables.map((table) => (
                                <TableRow key={table.id} className="hover:bg-gray-50">
                                    <TableCell>
                                        <Checkbox
                                            checked={table.selected}
                                            onCheckedChange={(checked) => handleSelectTable(table.id)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <button
                                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-left"
                                            onClick={() => handleTableClick(table.name)}
                                        >
                                            {table.name}
                                        </button>
                                    </TableCell>
                                    <TableCell className="text-gray-600">{table.description}</TableCell>
                                    <TableCell className="font-mono text-sm text-gray-800">{table.tableName}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Selection Summary */}
            <div className="text-sm text-gray-600">
                {selectedCount > 0 ? (
                    <span>
                        {selectedCount} of {tables.length} extension tables selected
                    </span>
                ) : (
                    <span>Showing {tables.length} extension tables</span>
                )}
            </div>
        </div>
    )
}
