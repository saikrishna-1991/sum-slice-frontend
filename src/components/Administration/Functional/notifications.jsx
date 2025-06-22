"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Download, RotateCcw, Save } from "lucide-react"

// Sample data for notification actions
const notificationActions = [
    {
        id: 1,
        objectType: "DEAL",
        description: "Approve",
        enabled: true,
    },
    {
        id: 2,
        objectType: "DEAL",
        description: "Submit",
        enabled: true,
    },
    {
        id: 3,
        objectType: "PLAN",
        description: "Create",
        enabled: true,
    },
    {
        id: 4,
        objectType: "PLAN",
        description: "Approve",
        enabled: true,
    },
    {
        id: 5,
        objectType: "DEAL",
        description: "Expire",
        enabled: true,
    },
]

export default function NotificationsPage() {
    const [additionalSettingsOpen, setAdditionalSettingsOpen] = useState(true)
    const [notificationActionsOpen, setNotificationActionsOpen] = useState(true)

    const [settings, setSettings] = useState({
        closeEndedDealsAfter: "10",
        resendPendingNotificationsAfter: "3",
    })

    const [actions, setActions] = useState(notificationActions)

    const handleSettingsSave = () => {
        console.log("Saving additional settings:", settings)
        // Implement save logic for additional settings
    }

    const handleSettingsReset = () => {
        setSettings({
            closeEndedDealsAfter: "10",
            resendPendingNotificationsAfter: "3",
        })
        console.log("Reset additional settings")
    }

    const handleActionsSave = () => {
        console.log("Saving notification actions:", actions)
        // Implement save logic for notification actions
    }

    const handleActionsReset = () => {
        setActions(notificationActions)
        console.log("Reset notification actions")
    }

    const handleExport = () => {
        console.log("Exporting notification settings...")
        // Implement export logic
    }

    const toggleActionEnabled = (id) => {
        setActions((prev) => prev.map((action) => (action.id === id ? { ...action, enabled: !action.enabled } : action)))
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-900">User Notification Settings</h2>
                <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>

            {/* Additional Settings Section */}
            <Card>
                <Collapsible open={additionalSettingsOpen} onOpenChange={setAdditionalSettingsOpen}>
                    <CollapsibleTrigger className="w-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="flex items-center gap-2">
                                {additionalSettingsOpen ? (
                                    <ChevronDown className="h-4 w-4 text-blue-600" />
                                ) : (
                                    <ChevronRight className="h-4 w-4 text-blue-600" />
                                )}
                                <CardTitle className="text-base font-medium text-blue-600">Additional Settings</CardTitle>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button size="sm" onClick={handleSettingsSave}>
                                    <Save className="h-4 w-4 mr-1" />
                                    Save
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleSettingsReset}>
                                    <RotateCcw className="h-4 w-4 mr-1" />
                                    Reset
                                </Button>
                            </div>
                        </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center gap-4">
                                    <Label htmlFor="close-deals" className="text-sm font-medium whitespace-nowrap">
                                        Close Ended Deals after
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="close-deals"
                                            type="number"
                                            value={settings.closeEndedDealsAfter}
                                            onChange={(e) => setSettings({ ...settings, closeEndedDealsAfter: e.target.value })}
                                            className="w-20"
                                        />
                                        <span className="text-sm text-gray-600">days</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Label htmlFor="resend-notifications" className="text-sm font-medium whitespace-nowrap">
                                        Resend pending notifications after
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="resend-notifications"
                                            type="number"
                                            value={settings.resendPendingNotificationsAfter}
                                            onChange={(e) => setSettings({ ...settings, resendPendingNotificationsAfter: e.target.value })}
                                            className="w-20"
                                        />
                                        <span className="text-sm text-gray-600">days</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </CollapsibleContent>
                </Collapsible>
            </Card>

            {/* Notifications Actions Section */}
            <Card>
                <Collapsible open={notificationActionsOpen} onOpenChange={setNotificationActionsOpen}>
                    <CollapsibleTrigger className="w-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="flex items-center gap-2">
                                {notificationActionsOpen ? (
                                    <ChevronDown className="h-4 w-4 text-blue-600" />
                                ) : (
                                    <ChevronRight className="h-4 w-4 text-blue-600" />
                                )}
                                <CardTitle className="text-base font-medium text-blue-600">Notifications Actions</CardTitle>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button size="sm" onClick={handleActionsSave}>
                                    <Save className="h-4 w-4 mr-1" />
                                    Save
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleActionsReset}>
                                    <RotateCcw className="h-4 w-4 mr-1" />
                                    Reset
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleExport}>
                                    <Download className="h-4 w-4 mr-1" />
                                    Export
                                </Button>
                            </div>
                        </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Object Type</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Enabled</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {actions.map((action) => (
                                        <TableRow key={action.id}>
                                            <TableCell className="font-medium">{action.objectType}</TableCell>
                                            <TableCell>{action.description}</TableCell>
                                            <TableCell>
                                                <Checkbox checked={action.enabled} onCheckedChange={() => toggleActionEnabled(action.id)} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </CollapsibleContent>
                </Collapsible>
            </Card>
        </div>
    )
}
