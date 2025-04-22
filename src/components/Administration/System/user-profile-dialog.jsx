"use client"

import { useState, useEffect } from "react"
import { Copy, Edit, Save, Camera, XCircle } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export function UserProfileDialog({ user, open, onOpenChange, isEditMode }) {
    const { toast } = useToast()
    const [isEditing, setIsEditing] = useState(false)
    const [activeTab, setActiveTab] = useState("personal")
    const [profileImage, setProfileImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)

    // Create a form state with all user data
    const [formData, setFormData] = useState({
        ...user,
        personalInfo: { ...user.personalInfo },
        accountInfo: { ...user.accountInfo },
        workFields: { ...user.workFields },
        customInfo: { ...user.customInfo },
        services: { ...user.services },
    })

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text)
        toast({
            title: "Copied to clipboard",
            description: `${label} has been copied to clipboard.`,
        })
    }

    const handleEditToggle = () => {
        if (isEditing) {
            // If we're currently editing, this acts as a cancel button
            setIsEditing(false)
            // Reset form data to original user data
            setFormData({
                ...user,
                personalInfo: { ...user.personalInfo },
                accountInfo: { ...user.accountInfo },
                workFields: { ...user.workFields },
                customInfo: { ...user.customInfo },
                services: { ...user.services },
            })
            setImagePreview(null)
            setProfileImage(null)
        } else {
            // Start editing
            setIsEditing(true)
        }
    }
    useEffect(() => {
        setIsEditing(true)
    }, [isEditMode])
    const handleInputChange = (e, section = null) => {
        const { name, value } = e.target

        if (section) {
            setFormData((prev) => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [name]: value,
                },
            }))
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }))
        }
    }

    const handleServiceToggle = (service, value) => {
        setFormData((prev) => ({
            ...prev,
            services: {
                ...prev.services,
                [service]: value ? "Enabled" : "Disabled",
            },
        }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setProfileImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSave = () => {
        // Here you would typically send the updated data to your API
        console.log("Saving user data:", formData)
        console.log("Profile image:", profileImage)

        // Show success toast
        toast({
            title: "Profile Updated",
            description: "User profile has been updated successfully.",
        })

        // Exit edit mode
        setIsEditing(false)
    }

    // Render form fields or read-only data based on edit mode
    const renderField = (label, value, name, section = null, type = "text") => {
        return (
            <div className="space-y-1">
                <label className="text-sm text-gray-500">{label}</label>
                {isEditing ? (
                    <Input
                        type={type}
                        name={name}
                        value={section ? formData[section]?.[name] || "" : formData[name] || ""}
                        onChange={(e) => handleInputChange(e, section)}
                        className="h-8 text-sm min-h-[24px]"
                    />
                ) : (
                    <div className="text-sm min-h-[24px] py-1">{value || "-"}</div>
                )}
            </div>
        )
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(newOpen) => {
                if (!newOpen && isEditing) {
                    // Confirm before closing if in edit mode
                    if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
                        setIsEditing(false)
                        onOpenChange(false)
                    }
                } else {
                    onOpenChange(newOpen)
                }
            }}
        >
            <DialogContent className="max-w-3xl p-5 overflow-hidden">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-lg font-medium">
                            {formData.fullName} ({formData.email})
                        </h2>
                        <div className="flex items-center gap-2">
                            {isEditing ? (
                                <>
                                    <Button variant="outline" size="sm" onClick={handleEditToggle} className="flex items-center gap-1">
                                        <XCircle className="h-4 w-4" />
                                        Cancel
                                    </Button>
                                    <Button variant="default" size="sm" onClick={handleSave} className="flex items-center gap-1">
                                        <Save className="h-4 w-4" />
                                        Save Changes
                                    </Button>
                                </>
                            ) : (
                                <Button variant="outline" size="sm" onClick={handleEditToggle} className="flex items-center gap-1">
                                    <Edit className="h-4 w-4" />
                                    Edit Profile
                                </Button>
                            )}
                        </div>
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
                                    <div className="relative">
                                        <Avatar className="h-24 w-24">
                                            {imagePreview ? (
                                                <AvatarImage src={imagePreview || "/placeholder.svg"} />
                                            ) : (
                                                <AvatarFallback className="text-2xl bg-gray-300">
                                                    {formData.fullName
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                        {isEditing && (
                                            <div className="absolute bottom-0 right-0">
                                                <label htmlFor="profile-image" className="cursor-pointer">
                                                    <div className="bg-blue-600 text-white rounded-full p-1.5">
                                                        <Camera className="h-4 w-4" />
                                                    </div>
                                                    <input
                                                        id="profile-image"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={handleImageChange}
                                                    />
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-center">
                                        {isEditing ? (
                                            <Input
                                                value={formData.fullName}
                                                name="fullName"
                                                onChange={(e) => handleInputChange(e)}
                                                className="text-center font-medium h-6 min-h-[24px]"
                                            />
                                        ) : (
                                            <h3 className="font-medium">{formData.fullName}</h3>
                                        )}
                                        <div className="flex items-center text-sm text-gray-500">
                                            {isEditing ? (
                                                <Input
                                                    value={formData.email}
                                                    name="email"
                                                    onChange={(e) => handleInputChange(e)}
                                                    className="text-center h-6 min-h-[24px]"
                                                />
                                            ) : (
                                                <>
                                                    <span>{formData.email}</span>
                                                    <button
                                                        onClick={() => copyToClipboard(formData.email, "Email")}
                                                        className="ml-1 text-gray-400 hover:text-gray-600"
                                                    >
                                                        <Copy className="h-3 w-3" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium w-32">Role</span>
                                        {isEditing ? (
                                            <Select
                                                value={formData.role}
                                                onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
                                            >
                                                <SelectTrigger className="w-[180px] h-8 min-h-[24px]">
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Administrator">Administrator</SelectItem>
                                                    <SelectItem value="Super Administrator">Super Administrator</SelectItem>
                                                    <SelectItem value="Custom Administrator">Custom Administrator</SelectItem>
                                                    <SelectItem value="User">User</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <Badge variant="outline">{formData.role}</Badge>
                                        )}
                                    </div>

                                    <div className="flex items-center">
                                        <span className="text-sm font-medium w-32">Used Storage</span>
                                        <span className="text-sm">
                                            {formData.storage?.used} / {formData.storage?.total}
                                        </span>
                                    </div>

                                    <div className="flex items-center">
                                        <span className="text-sm font-medium w-32">Status</span>
                                        {isEditing ? (
                                            <Select
                                                value={formData.status}
                                                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                                            >
                                                <SelectTrigger className="w-[180px] h-8 min-h-[24px]">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Active">Active</SelectItem>
                                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                                    <SelectItem value="Blocked">Blocked</SelectItem>
                                                    <SelectItem value="Expired">Expired</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <Badge
                                                variant="outline"
                                                className={formData.status === "Active" ? "text-green-600 border-green-600" : "text-gray-600"}
                                            >
                                                {formData.status}
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Service toggles */}
                                    {["mail", "calendar", "contacts"].map((service) => (
                                        <div key={service} className="flex items-center min-h-[24px]">
                                            <span className="text-sm font-medium w-32">
                                                {service.charAt(0).toUpperCase() + service.slice(1)} Service
                                            </span>
                                            {isEditing ? (
                                                <div className="flex items-center">
                                                    <Switch
                                                        checked={formData.services?.[service] === "Enabled"}
                                                        onCheckedChange={(checked) => handleServiceToggle(service, checked)}
                                                    />
                                                    <span className="ml-2 text-sm">
                                                        {formData.services?.[service] === "Enabled" ? "Enabled" : "Disabled"}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-sm">{formData.services?.[service]}</span>
                                            )}
                                        </div>
                                    ))}

                                    <div className="flex items-center">
                                        <span className="text-sm font-medium w-32">Auto-expiry</span>
                                        {isEditing ? (
                                            <div className="flex items-center">
                                                <Switch
                                                    checked={formData.services?.autoExpiry === "on"}
                                                    onCheckedChange={(checked) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            services: {
                                                                ...prev.services,
                                                                autoExpiry: checked ? "on" : "off",
                                                            },
                                                        }))
                                                    }
                                                />
                                                <span className="ml-2 text-sm">{formData.services?.autoExpiry === "on" ? "On" : "Off"}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm">{formData.services?.autoExpiry}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Middle and Right Columns - Personal Information */}
                            <div className="col-span-2 space-y-8">
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {renderField("First Name", formData.personalInfo?.firstName, "firstName", "personalInfo")}
                                        {renderField("Last Name", formData.personalInfo?.lastName, "lastName", "personalInfo")}
                                        {renderField("Nick Name", formData.personalInfo?.nickName, "nickName", "personalInfo")}

                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-500">Gender</label>
                                            {isEditing ? (
                                                <Select
                                                    value={formData.personalInfo?.gender || "Not specified"}
                                                    onValueChange={(value) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            personalInfo: {
                                                                ...prev.personalInfo,
                                                                gender: value,
                                                            },
                                                        }))
                                                    }
                                                >
                                                    <SelectTrigger className="w-full h-8 min-h-[24px]">
                                                        <SelectValue placeholder="Select gender" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Male">Male</SelectItem>
                                                        <SelectItem value="Female">Female</SelectItem>
                                                        <SelectItem value="Not specified">Not specified</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <div className="text-sm">{formData.personalInfo?.gender || "-"}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium mb-4">Personal Address</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {renderField("Street", formData.personalInfo?.street, "street", "personalInfo")}
                                        {renderField("City", formData.personalInfo?.city, "city", "personalInfo")}
                                        {renderField("State", formData.personalInfo?.state, "state", "personalInfo")}
                                        {renderField("Postal code", formData.personalInfo?.postalCode, "postalCode", "personalInfo")}

                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-500">Country/Region</label>
                                            {isEditing ? (
                                                <Select
                                                    value={formData.personalInfo?.country || ""}
                                                    onValueChange={(value) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            personalInfo: {
                                                                ...prev.personalInfo,
                                                                country: value,
                                                            },
                                                        }))
                                                    }
                                                >
                                                    <SelectTrigger className="w-full h-8 min-h-[24px]">
                                                        <SelectValue placeholder="Select country" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="United States">🇺🇸 United States</SelectItem>
                                                        <SelectItem value="Canada">🇨🇦 Canada</SelectItem>
                                                        <SelectItem value="United Kingdom">🇬🇧 United Kingdom</SelectItem>
                                                        <SelectItem value="Australia">🇦🇺 Australia</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <div className="text-sm flex items-center">
                                                    {formData.personalInfo?.country === "United States" && <span className="mr-2">🇺🇸</span>}
                                                    {formData.personalInfo?.country || "-"}
                                                </div>
                                            )}
                                        </div>

                                        {renderField(
                                            "Mobile number",
                                            formData.personalInfo?.mobileNumber,
                                            "mobileNumber",
                                            "personalInfo",
                                            "tel",
                                        )}
                                        {renderField(
                                            "Phone number",
                                            formData.personalInfo?.phoneNumber,
                                            "phoneNumber",
                                            "personalInfo",
                                            "tel",
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium mb-4">Account Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {renderField(
                                            "Account Creation Time",
                                            formData.accountInfo?.creationTime,
                                            "creationTime",
                                            "accountInfo",
                                        )}
                                        {renderField(
                                            "Last Password Reset Time",
                                            formData.accountInfo?.lastPasswordResetTime,
                                            "lastPasswordResetTime",
                                            "accountInfo",
                                        )}
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
                                    <div className="relative">
                                        <Avatar className="h-24 w-24">
                                            {imagePreview ? (
                                                <AvatarImage src={imagePreview || "/placeholder.svg"} />
                                            ) : (
                                                <AvatarFallback className="text-2xl bg-gray-300">
                                                    {formData.fullName
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                        {isEditing && (
                                            <div className="absolute bottom-0 right-0">
                                                <label htmlFor="profile-image-account" className="cursor-pointer">
                                                    <div className="bg-blue-600 text-white rounded-full p-1.5">
                                                        <Camera className="h-4 w-4" />
                                                    </div>
                                                    <input
                                                        id="profile-image-account"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={handleImageChange}
                                                    />
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-center">
                                        {isEditing ? (
                                            <Input
                                                value={formData.fullName}
                                                name="fullName"
                                                onChange={(e) => handleInputChange(e)}
                                                className="text-center font-medium h-6 min-h-[24px]"
                                            />
                                        ) : (
                                            <h3 className="font-medium">{formData.fullName}</h3>
                                        )}
                                        <div className="flex items-center text-sm text-gray-500">
                                            {isEditing ? (
                                                <Input
                                                    value={formData.email}
                                                    name="email"
                                                    onChange={(e) => handleInputChange(e)}
                                                    className="text-center h-6 min-h-[24px]"
                                                />
                                            ) : (
                                                <>
                                                    <span>{formData.email}</span>
                                                    <button
                                                        onClick={() => copyToClipboard(formData.email, "Email")}
                                                        className="ml-1 text-gray-400 hover:text-gray-600"
                                                    >
                                                        <Copy className="h-3 w-3" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium w-32">Role</span>
                                        {isEditing ? (
                                            <Select
                                                value={formData.role}
                                                onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
                                            >
                                                <SelectTrigger className="w-[180px] h-8 min-h-[24px]">
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Administrator">Administrator</SelectItem>
                                                    <SelectItem value="Super Administrator">Super Administrator</SelectItem>
                                                    <SelectItem value="Custom Administrator">Custom Administrator</SelectItem>
                                                    <SelectItem value="User">User</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <Badge variant="outline">{formData.role}</Badge>
                                        )}
                                    </div>

                                    <div className="flex items-center">
                                        <span className="text-sm font-medium w-32">Used Storage</span>
                                        <span className="text-sm">
                                            {formData.storage?.used} / {formData.storage?.total}
                                        </span>
                                    </div>

                                    <div className="flex items-center">
                                        <span className="text-sm font-medium w-32">Status</span>
                                        {isEditing ? (
                                            <Select
                                                value={formData.status}
                                                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                                            >
                                                <SelectTrigger className="w-[180px] h-8 min-h-[24px]">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Active">Active</SelectItem>
                                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                                    <SelectItem value="Blocked">Blocked</SelectItem>
                                                    <SelectItem value="Expired">Expired</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <Badge
                                                variant="outline"
                                                className={formData.status === "Active" ? "text-green-600 border-green-600" : "text-gray-600"}
                                            >
                                                {formData.status}
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Service toggles */}
                                    {["mail", "calendar", "contacts"].map((service) => (
                                        <div key={service} className="flex items-center min-h-[24px]">
                                            <span className="text-sm font-medium w-32">
                                                {service.charAt(0).toUpperCase() + service.slice(1)} Service
                                            </span>
                                            {isEditing ? (
                                                <div className="flex items-center">
                                                    <Switch
                                                        checked={formData.services?.[service] === "Enabled"}
                                                        onCheckedChange={(checked) => handleServiceToggle(service, checked)}
                                                    />
                                                    <span className="ml-2 text-sm">
                                                        {formData.services?.[service] === "Enabled" ? "Enabled" : "Disabled"}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-sm">{formData.services?.[service]}</span>
                                            )}
                                        </div>
                                    ))}

                                    <div className="flex items-center">
                                        <span className="text-sm font-medium w-32">Auto-expiry</span>
                                        {isEditing ? (
                                            <div className="flex items-center">
                                                <Switch
                                                    checked={formData.services?.autoExpiry === "on"}
                                                    onCheckedChange={(checked) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            services: {
                                                                ...prev.services,
                                                                autoExpiry: checked ? "on" : "off",
                                                            },
                                                        }))
                                                    }
                                                />
                                                <span className="ml-2 text-sm">{formData.services?.autoExpiry === "on" ? "On" : "Off"}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm">{formData.services?.autoExpiry}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Middle and Right Columns - Account Information */}
                            <div className="col-span-2 space-y-8">
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Account Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {renderField(
                                            "Account Creation Time",
                                            formData.accountInfo?.creationTime,
                                            "creationTime",
                                            "accountInfo",
                                        )}
                                        {renderField(
                                            "Last Password Reset Time",
                                            formData.accountInfo?.lastPasswordResetTime,
                                            "lastPasswordResetTime",
                                            "accountInfo",
                                        )}
                                        {renderField(
                                            "Last Login Time",
                                            formData.accountInfo?.lastLoginTime,
                                            "lastLoginTime",
                                            "accountInfo",
                                        )}
                                        {renderField("Time Zone", formData.accountInfo?.timeZone, "timeZone", "accountInfo")}

                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-500">User ID</label>
                                            {isEditing ? (
                                                <Input
                                                    name="userId"
                                                    value={formData.accountInfo?.userId || ""}
                                                    onChange={(e) => handleInputChange(e, "accountInfo")}
                                                    className="h-8 text-sm"
                                                />
                                            ) : (
                                                <div className="text-sm flex items-center">
                                                    {formData.accountInfo?.userId || "-"}
                                                    {formData.accountInfo?.userId && (
                                                        <button
                                                            onClick={() => copyToClipboard(formData.accountInfo.userId, "User ID")}
                                                            className="ml-1 text-gray-400 hover:text-gray-600"
                                                        >
                                                            <Copy className="h-3 w-3" />
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium mb-4">Custom Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-500">az.active.company</label>
                                            {isEditing ? (
                                                <Input
                                                    name="az.active.company"
                                                    value={formData.customInfo?.["az.active.company"] || ""}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            customInfo: {
                                                                ...prev.customInfo,
                                                                ["az.active.company"]: e.target.value,
                                                            },
                                                        }))
                                                    }
                                                    className="h-8 text-sm"
                                                />
                                            ) : (
                                                <div className="text-sm">{formData.customInfo?.["az.active.company"] || "-"}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium mb-4">Work Fields</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {renderField("Employee ID", formData.workFields?.employeeId, "employeeId", "workFields")}
                                        {renderField("Designation", formData.workFields?.designation, "designation", "workFields")}
                                        {renderField("Department", formData.workFields?.department, "department", "workFields")}
                                        {renderField(
                                            "Mobile Number",
                                            formData.workFields?.mobileNumber,
                                            "mobileNumber",
                                            "workFields",
                                            "tel",
                                        )}
                                        {renderField("Extension", formData.workFields?.extension, "extension", "workFields")}
                                        {renderField("Phone Number", formData.workFields?.phoneNumber, "phoneNumber", "workFields", "tel")}
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
