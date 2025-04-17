"use client"

import { X, Copy } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"



export function UserProfileDialog({ user, open, onOpenChange }) {
    const toast = useToast()
    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text)
        toast({
            title: "Copied to clipboard",
            description: `${label} has been copied to clipboard.`,
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl p-5 overflow-hidden">
                <Tabs defaultValue="personal" className="w-full">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-lg font-medium">
                            {user.fullName} ({user.email})
                        </h2>
                        {/* <div className="flex items-center gap-2">
                            <button
                                onClick={() => onOpenChange(false)}
                                className="rounded-full p-1 hover:bg-gray-100 focus:outline-none"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div> */}
                    </div>

                    <TabsList className="w-full justify-start rounded-none border-b px-4">
                        <TabsTrigger
                            value="personal"
                            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                        >
                            Personal Information
                        </TabsTrigger>
                        <TabsTrigger
                            value="account"
                            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                        >
                            Account Information
                        </TabsTrigger>
                    </TabsList>

                    {/* Personal Information Tab */}
                    <TabsContent value="personal" className="p-0">
                        <div className="grid grid-cols-3 gap-6 p-6">
                            {/* Left Column - Profile Summary */}
                            <div className="space-y-6">
                                <div className="flex flex-col items-center space-y-2 bg-gray-100 p-4 rounded">
                                    <Avatar className="h-24 w-24">
                                        <AvatarFallback className="text-2xl bg-gray-300">
                                            {user.fullName
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-center">
                                        <h3 className="font-medium">{user.fullName}</h3>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <span>{user.email}</span>
                                            <button
                                                onClick={() => copyToClipboard(user.email, "Email")}
                                                className="ml-1 text-gray-400 hover:text-gray-600"
                                            >
                                                <Copy className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium w-32">Role</span>
                                        <Badge variant="outline">{user.role}</Badge>
                                    </div>

                                    <div className="flex items-center">
                                        <span className="text-sm font-medium w-32">Used Storage</span>
                                        <span className="text-sm">
                                            {user.storage?.used} / {user.storage?.total}
                                        </span>
                                    </div>

                                    <div className="flex items-center">
                                        <span className="text-sm font-medium w-32">Status</span>
                                        <Badge
                                            variant="outline"
                                            className={user.status === "Active" ? "text-green-600 border-green-600" : "text-gray-600"}
                                        >
                                            {user.status}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center">
                                        <span className="text-sm font-medium w-32">Mail Service</span>
                                        <span className="text-sm">{user.services?.mail}</span>
                                    </div>

                                    <div className="flex items-center">
                                        <span className="text-sm font-medium w-32">Calendar Service</span>
                                        <span className="text-sm">{user.services?.calendar}</span>
                                    </div>

                                    <div className="flex items-center">
                                        <span className="text-sm font-medium w-32">Contacts Service</span>
                                        <span className="text-sm">{user.services?.contacts}</span>
                                    </div>

                                    <div className="flex items-center">
                                        <span className="text-sm font-medium w-32">Auto-expiry</span>
                                        <span className="text-sm">{user.services?.autoExpiry}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Middle and Right Columns - Personal Information */}
                            <div className="col-span-2 space-y-8">
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-500">First Name</label>
                                            <div className="text-sm">{user.personalInfo?.firstName || "-"}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-500">Last Name</label>
                                            <div className="text-sm">{user.personalInfo?.lastName || "-"}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-500">Nick Name</label>
                                            <div className="text-sm">{user.personalInfo?.nickName || "-"}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-500">Gender</label>
                                            <div className="text-sm">{user.personalInfo?.gender || "-"}</div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium mb-4">Personal Address</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-500">Street</label>
                                            <div className="text-sm">{user.personalInfo?.street || "-"}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-500">City</label>
                                            <div className="text-sm">{user.personalInfo?.city || "-"}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-500">State</label>
                                            <div className="text-sm">{user.personalInfo?.state || "-"}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-500">Postal code</label>
                                            <div className="text-sm">{user.personalInfo?.postalCode || "-"}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-500">Country/Region</label>
                                            <div className="text-sm flex items-center">
                                                {user.personalInfo?.country === "United States" && <span className="mr-2">🇺🇸</span>}
                                                {user.personalInfo?.country || "-"}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-500">Mobile number</label>
                                            <div className="text-sm">{user.personalInfo?.mobileNumber || "-"}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-500">Phone number</label>
                                            <div className="text-sm">{user.personalInfo?.phoneNumber || "-"}</div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium mb-4">Account Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-500">Account Creation Time</label>
                                            <div className="text-sm">{user.accountInfo?.creationTime || "-"}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-500">Last Password Reset Time</label>
                                            <div className="text-sm">{user.accountInfo?.lastPasswordResetTime || "-"}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Account Information Tab */}
                    <TabsContent value="account" className="p-0">
                        <div className="grid grid-cols-3 gap-6 p-6">
                            {/* Left Column - Profile Summary */}
                            <div className="space-y-6">
                                <div className="flex flex-col items-center space-y-2 bg-gray-100 p-4 rounded">
                                    <Avatar className="h-24 w-24">
                                        <AvatarFallback className="text-2xl bg-gray-300">
                                            {user.fullName
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-center">
                                        <h3 className="font-medium">{user.fullName}</h3>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <span>{user.email}</span>
                                            <button
                                                onClick={() => copyToClipboard(user.email, "Email")}
                                                className="ml-1 text-gray-400 hover:text-gray-600"
                                            >
                                                <Copy className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium w-32">Role</span>
                                        <Badge variant="outline">{user.role}</Badge>
                                    </div>

                                    <div className="flex items-center">
                                        <span className="text-sm font-medium w-32">Used Storage</span>
                                        <span className="text-sm">
                                            {user.storage?.used} / {user.storage?.total}
                                        </span>
                                    </div>

                                    <div className="flex items-center">
                                        <span className="text-sm font-medium w-32">Status</span>
                                        <Badge
                                            variant="outline"
                                            className={user.status === "Active" ? "text-green-600 border-green-600" : "text-gray-600"}
                                        >
                                            {user.status}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center">
                                        <span className="text-sm font-medium w-32">Mail Service</span>
                                        <span className="text-sm">{user.services?.mail}</span>
                                    </div>

                                    <div className="flex items-center">
                                        <span className="text-sm font-medium w-32">Calendar Service</span>
                                        <span className="text-sm">{user.services?.calendar}</span>
                                    </div>

                                    <div className="flex items-center">
                                        <span className="text-sm font-medium w-32">Contacts Service</span>
                                        <span className="text-sm">{user.services?.contacts}</span>
                                    </div>

                                    <div className="flex items-center">
                                        <span className="text-sm font-medium w-32">Auto-expiry</span>
                                        <span className="text-sm">{user.services?.autoExpiry}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Middle and Right Columns - Account Information */}
                            <div className="col-span-2 space-y-8">
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Account Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-500">Account Creation Time</label>
                                            <div className="text-sm">{user.accountInfo?.creationTime || "-"}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-500">Last Password Reset Time</label>
                                            <div className="text-sm">{user.accountInfo?.lastPasswordResetTime || "-"}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-500">Last Login Time</label>
                                            <div className="text-sm">{user.accountInfo?.lastLoginTime || "-"}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-500">Time Zone</label>
                                            <div className="text-sm">{user.accountInfo?.timeZone || "-"}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-500">User ID</label>
                                            <div className="text-sm flex items-center">
                                                {user.accountInfo?.userId || "-"}
                                                {user.accountInfo?.userId && (
                                                    <button
                                                        onClick={() => copyToClipboard(user.accountInfo.userId, "User ID")}
                                                        className="ml-1 text-gray-400 hover:text-gray-600"
                                                    >
                                                        <Copy className="h-3 w-3" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium mb-4">Custom Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-500">az.active.company</label>
                                            <div className="text-sm">{user.customInfo?.["az.active.company"] || "-"}</div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium mb-4">Work Fields</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-500">Employee ID</label>
                                            <div className="text-sm">{user.workFields?.employeeId || "-"}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-500">Designation</label>
                                            <div className="text-sm">{user.workFields?.designation || "-"}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-500">Department</label>
                                            <div className="text-sm">{user.workFields?.department || "-"}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-500">Mobile Number</label>
                                            <div className="text-sm">{user.workFields?.mobileNumber || "-"}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-500">Extension</label>
                                            <div className="text-sm">{user.workFields?.extension || "-"}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-500">Phone Number</label>
                                            <div className="text-sm">{user.workFields?.phoneNumber || "-"}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
