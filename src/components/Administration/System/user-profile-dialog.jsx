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

export function UserProfileDialog({ user, open, onOpenChange, isEditMode }) {
    const { toast } = useToast()
    const [isEditing, setIsEditing] = useState(isEditMode)
    const [activeTab, setActiveTab] = useState("personal")
    const [profileImage, setProfileImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)

    // Initialize formData with the flat userData structure, mapping fields appropriately
    const [formData, setFormData] = useState({
        id: user?.id || "",
        user_name: user?.user_name || "",
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        email: user?.email || "",
        role_type: user?.role_type || "",
        active: user?.active || false,
        phone: user?.phone || "",
        activation_date: user?.activation_date || "",
        creation_date: user?.creation_date || "",
        created_by: user?.created_by || "",
        last_updated_by: user?.last_updated_by || "",
        last_update_date: user?.last_update_date || ""
    })

    // Derive fullName for display
    const fullName = `${formData.first_name} ${formData.last_name}`.trim()

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text)
        toast({
            title: "Copied to clipboard",
            description: `${label} has been copied to clipboard.`,
        })
    }

    const handleEditToggle = () => {
        if (isEditing) {
            // Reset form data to original user data when canceling
            setFormData({
                id: user?.id || "",
                user_name: user?.user_name || "",
                first_name: user?.first_name || "",
                last_name: user?.last_name || "",
                email: user?.email || "",
                role_type: user?.role_type || "",
                active: user?.active || false,
                phone: user?.phone || "",
                activation_date: user?.activation_date || "",
                creation_date: user?.creation_date || "",
                created_by: user?.created_by || "",
                last_updated_by: user?.last_updated_by || "",
                last_update_date: user?.last_update_date || ""
            })
            setImagePreview(null)
            setProfileImage(null)
            setIsEditing(false)
        } else {
            setIsEditing(true)
        }
    }

    // Update isEditing when isEditMode changes
    useEffect(() => {
        setIsEditing(isEditMode)
    }, [isEditMode])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value
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
        // Log or send updated data to an API
        console.log("Saving user data:", formData)
        console.log("Profile image:", profileImage)

        toast({
            title: "Profile Updated",
            description: "User profile has been updated successfully.",
        })

        setIsEditing(false)
    }

    // Render form fields or read-only data
    const renderField = (label, value, name, type = "text") => {
        return (
            <div className="space-y-1">
                <label className="text-sm text-gray-500">{label}</label>
                {isEditing ? (
                    <Input
                        type={type}
                        name={name}
                        value={formData[name] || ""}
                        onChange={handleInputChange}
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
                    if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
                        setIsEditing(false)
                        setImagePreview(null)
                        setProfileImage(null)
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
                            {fullName} ({formData.email})
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
                                                <AvatarImage src={imagePreview} />
                                            ) : (
                                                <AvatarFallback className="text-2xl bg-gray-300">
                                                    {fullName
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
                                            <div className="space-y-2">
                                                <Input
                                                    value={formData.first_name}
                                                    name="first_name"
                                                    onChange={handleInputChange}
                                                    className="text-center font-medium h-6 min-h-[24px]"
                                                    placeholder="First Name"
                                                />
                                                <Input
                                                    value={formData.last_name}
                                                    name="last_name"
                                                    onChange={handleInputChange}
                                                    className="text-center font-medium h-6 min-h-[24px]"
                                                    placeholder="Last Name"
                                                />
                                            </div>
                                        ) : (
                                            <h3 className="font-medium">{fullName}</h3>
                                        )}
                                        <div className="flex items-center justify-center text-sm text-gray-500">
                                            {isEditing ? (
                                                <Input
                                                    value={formData.email}
                                                    name="email"
                                                    onChange={handleInputChange}
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
                                                value={formData.role_type}
                                                onValueChange={(value) => handleSelectChange("role_type", value)}
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
                                            <Badge variant="outline">{formData.role_type}</Badge>
                                        )}
                                    </div>

                                    <div className="flex items-center">
                                        <span className="text-sm font-medium w-32">Status</span>
                                        {isEditing ? (
                                            <Select
                                                value={formData.active ? "Active" : "Inactive"}
                                                onValueChange={(value) => handleSelectChange("active", value === "Active")}
                                            >
                                                <SelectTrigger className="w-[180px] h-8 min-h-[24px]">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Active">Active</SelectItem>
                                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <Badge
                                                variant="outline"
                                                className={formData.active ? "text-green-600 border-green-600" : "text-gray-600"}
                                            >
                                                {formData.active ? "Active" : "Inactive"}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Middle and Right Columns - Personal Information */}
                            <div className="col-span-2 space-y-8">
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {renderField("First Name", formData.first_name, "first_name")}
                                        {renderField("Last Name", formData.last_name, "last_name")}
                                        {renderField("Email", formData.email, "email", "email")}
                                        {renderField("Phone", formData.phone, "phone", "tel")}
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
                                                <AvatarImage src={imagePreview} />
                                            ) : (
                                                <AvatarFallback className="text-2xl bg-gray-300">
                                                    {fullName
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
                                            <div className="space-y-2">
                                                <Input
                                                    value={formData.first_name}
                                                    name="first_name"
                                                    onChange={handleInputChange}
                                                    className="text-center font-medium h-6 min-h-[24px]"
                                                    placeholder="First Name"
                                                />
                                                <Input
                                                    value={formData.last_name}
                                                    name="last_name"
                                                    onChange={handleInputChange}
                                                    className="text-center font-medium h-6 min-h-[24px]"
                                                    placeholder="Last Name"
                                                />
                                            </div>
                                        ) : (
                                            <h3 className="font-medium">{fullName}</h3>
                                        )}
                                        <div className="flex items-center justify-center text-sm text-gray-500">
                                            {isEditing ? (
                                                <Input
                                                    value={formData.email}
                                                    name="email"
                                                    onChange={handleInputChange}
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
                                                value={formData.role_type}
                                                onValueChange={(value) => handleSelectChange("role_type", value)}
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
                                            <Badge variant="outline">{formData.role_type}</Badge>
                                        )}
                                    </div>

                                    <div className="flex items-center">
                                        <span className="text-sm font-medium w-32">Status</span>
                                        {isEditing ? (
                                            <Select
                                                value={formData.active ? "Active" : "Inactive"}
                                                onValueChange={(value) => handleSelectChange("active", value === "Active")}
                                            >
                                                <SelectTrigger className="w-[180px] h-8 min-h-[24px]">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Active">Active</SelectItem>
                                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <Badge
                                                variant="outline"
                                                className={formData.active ? "text-green-600 border-green-600" : "text-gray-600"}
                                            >
                                                {formData.active ? "Active" : "Inactive"}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Middle and Right Columns - Account Information */}
                            <div className="col-span-2 space-y-8">
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Account Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {renderField("Username", formData.user_name, "user_name")}
                                        {renderField("Role Type", formData.role_type, "role_type")}
                                        {renderField("Activation Date", formData.activation_date, "activation_date", "date")}
                                        {renderField("Creation Date", formData.creation_date, "creation_date")}
                                        {renderField("Created By", formData.created_by, "created_by")}
                                        {renderField("Last Updated By", formData.last_updated_by, "last_updated_by")}
                                        {renderField("Last Update Date", formData.last_update_date, "last_update_date")}
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