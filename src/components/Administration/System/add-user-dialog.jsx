"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useForm, Controller, FormProvider } from "react-hook-form"

export function AddUserDialog({ open, onOpenChange, onUserAdded }) {
    const [activeTab, setActiveTab] = useState("personal")
    const { toast } = useToast()
    const methods = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            username: "",
            role: "User",
            status: "Active",
            phone: "",
            activation_date: "",
        },
    })

    const {
        handleSubmit,
        control,
        register,
        formState: { errors },
    } = methods

    const onSubmit = (data) => {
        // Generate the user object in the required format
        const newUser = {
            id: Math.max(...userData.map(u => u.id), 0) + 1, // Generate new ID
            user_name: data.username,
            password: "securePass123!", // Default password (or generate dynamically)
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            role_type: data.role,
            role_use_type: data.role === "User" ? "Basic Access" : "Full Access", // Default based on role
            active: data.status === "Active",
            activation_date: data.activation_date || new Date().toISOString().split('T')[0], // Use provided or current date
            phone: data.phone,
            creation_date: new Date().toISOString().replace('T', ' ').substring(0, 19), // Current timestamp
            created_by: "system_admin", // Default value
            last_updated_by: "system_admin", // Default value
            last_update_date: new Date().toISOString().replace('T', ' ').substring(0, 19), // Current timestamp
        }

        console.log("New user created:", newUser)
        toast({
            title: "User Added",
            description: `User ${newUser.first_name} ${newUser.last_name} has been added successfully.`,
        })

        // Pass the new user to the parent component (e.g., to update userData)
        if (onUserAdded) {
            onUserAdded(newUser)
        }

        onOpenChange(false)
    }

    const navigateToTab = (tab) => {
        setActiveTab(tab)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full overflow-hidden">
                        <Tabs
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="w-full flex flex-col h-full overflow-hidden"
                        >
                            <div className="flex justify-between items-center p-4 border-b flex-shrink-0">
                                <h2 className="text-lg font-medium">Add New User</h2>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => onOpenChange(false)}
                                        className="rounded-full p-1 hover:bg-gray-100 focus:outline-none"
                                    >
                                    </button>
                                </div>
                            </div>

                            <TabsList className="w-full justify-start rounded-none border-b px-4 flex-shrink-0">
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
                            <TabsContent value="personal" className="p-6 space-y-6 overflow-y-auto flex-grow">
                                <div className="grid grid-cols-2 gap-6">
                                    {/* Basic Information */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Basic Information</h3>

                                        <div className="space-y-2">
                                            <Label htmlFor="firstName" className="text-sm font-medium">
                                                First Name <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="firstName"
                                                {...register("firstName", { required: "First name is required" })}
                                                className={errors.firstName ? "border-red-500" : ""}
                                            />
                                            {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="lastName" className="text-sm font-medium">
                                                Last Name <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="lastName"
                                                {...register("lastName", { required: "Last name is required" })}
                                                className={errors.lastName ? "border-red-500" : ""}
                                            />
                                            {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-sm font-medium">
                                                Email <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                {...register("email", {
                                                    required: "Email is required",
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: "Invalid email address",
                                                    },
                                                })}
                                                className={errors.email ? "border-red-500" : ""}
                                            />
                                            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="text-sm font-medium">
                                                Phone Number
                                            </Label>
                                            <Input
                                                id="phone"
                                                {...register("phone")}
                                            />
                                        </div>
                                    </div>

                                    {/* Account Credentials */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Account Credentials</h3>

                                        <div className="space-y-2">
                                            <Label htmlFor="username" className="text-sm font-medium">
                                                Username <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="username"
                                                {...register("username", { required: "Username is required" })}
                                                className={errors.username ? "border-red-500" : ""}
                                            />
                                            {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="activation_date" className="text-sm font-medium">
                                                Activation Date
                                            </Label>
                                            <Input
                                                id="activation_date"
                                                type="date"
                                                {...register("activation_date")}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between pt-4 flex-shrink-0">
                                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="button" onClick={() => navigateToTab("account")}>
                                        Next
                                    </Button>
                                </div>
                            </TabsContent>

                            {/* Account Information Tab */}
                            <TabsContent value="account" className="p-6 space-y-6 overflow-y-auto flex-grow">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Account Settings</h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="role" className="text-sm font-medium">
                                                Role <span className="text-red-500">*</span>
                                            </Label>
                                            <Controller
                                                name="role"
                                                control={control}
                                                rules={{ required: "Role is required" }}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                                                            <SelectValue placeholder="Select role" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="User">User</SelectItem>
                                                            <SelectItem value="Administrator">Administrator</SelectItem>
                                                            <SelectItem value="Super Administrator">Super Administrator</SelectItem>
                                                            <SelectItem value="Custom Administrator">Custom Administrator</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {errors.role && <p className="text-red-500 text-xs">{errors.role.message}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="status" className="text-sm font-medium">
                                                Status
                                            </Label>
                                            <Controller
                                                name="status"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Active">Active</SelectItem>
                                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                                            <SelectItem value="Blocked">Blocked</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between pt-4 flex-shrink-0">
                                    <Button type="button" variant="outline" onClick={() => navigateToTab("personal")}>
                                        Back
                                    </Button>
                                    <Button type="submit">Create User</Button>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}