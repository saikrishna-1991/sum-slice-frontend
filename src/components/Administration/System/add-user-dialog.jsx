"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useForm, Controller, FormProvider } from "react-hook-form"


export function AddUserDialog({ open, onOpenChange }) {
    const [activeTab, setActiveTab] = useState("personal")
    const toast = useToast()
    const methods = useForm({
        defaultValues: {
            // Personal Information
            firstName: "",
            lastName: "",
            nickName: "",
            gender: "not-specified",
            email: "",
            username: "",

            // Address
            street: "",
            city: "",
            state: "",
            postalCode: "",
            country: "United States",
            mobileNumber: "",
            phoneNumber: "",

            // Account Information
            role: "User",
            status: "Active",

            // Services
            mailService: true,
            calendarService: true,
            contactsService: true,
            autoExpiry: true,

            // Work Fields
            employeeId: "",
            designation: "",
            department: "",
            workMobileNumber: "",
            extension: "",
            workPhoneNumber: "",

            // Custom Information
            azActiveCompany: "",
        },
    })

    const {
        handleSubmit,
        control,
        register,
        formState: { errors },
    } = methods

    const onSubmit = (data) => {
        console.log("Form submitted:", data)
        toast({
            title: "User Added",
            description: `User ${data.firstName} ${data.lastName} has been added successfully.`,
        })
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
                                            <Label htmlFor="nickName" className="text-sm font-medium">
                                                Nick Name
                                            </Label>
                                            <Input id="nickName" {...register("nickName")} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="gender" className="text-sm font-medium">
                                                Gender
                                            </Label>
                                            <Controller
                                                name="gender"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select gender" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="not-specified">Not specified</SelectItem>
                                                            <SelectItem value="male">Male</SelectItem>
                                                            <SelectItem value="female">Female</SelectItem>
                                                            <SelectItem value="other">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* Account Credentials */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Account Credentials</h3>

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

                                {/* Address Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Address Information</h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="street" className="text-sm font-medium">
                                                Street
                                            </Label>
                                            <Input id="street" {...register("street")} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="city" className="text-sm font-medium">
                                                City
                                            </Label>
                                            <Input id="city" {...register("city")} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="state" className="text-sm font-medium">
                                                State
                                            </Label>
                                            <Input id="state" {...register("state")} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="postalCode" className="text-sm font-medium">
                                                Postal Code
                                            </Label>
                                            <Input id="postalCode" {...register("postalCode")} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="country" className="text-sm font-medium">
                                                Country
                                            </Label>
                                            <Controller
                                                name="country"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select country" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="United States">United States</SelectItem>
                                                            <SelectItem value="Canada">Canada</SelectItem>
                                                            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                                            <SelectItem value="Australia">Australia</SelectItem>
                                                            <SelectItem value="Germany">Germany</SelectItem>
                                                            <SelectItem value="France">France</SelectItem>
                                                            <SelectItem value="Japan">Japan</SelectItem>
                                                            <SelectItem value="China">China</SelectItem>
                                                            <SelectItem value="India">India</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="mobileNumber" className="text-sm font-medium">
                                                Mobile Number
                                            </Label>
                                            <Input id="mobileNumber" {...register("mobileNumber")} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phoneNumber" className="text-sm font-medium">
                                                Phone Number
                                            </Label>
                                            <Input id="phoneNumber" {...register("phoneNumber")} />
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
                                {/* Services */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Services</h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center space-x-2">
                                            <Controller
                                                name="mailService"
                                                control={control}
                                                render={({ field }) => (
                                                    <Checkbox id="mailService" checked={field.value} onCheckedChange={field.onChange} />
                                                )}
                                            />
                                            <Label htmlFor="mailService" className="text-sm font-medium">
                                                Mail Service
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Controller
                                                name="calendarService"
                                                control={control}
                                                render={({ field }) => (
                                                    <Checkbox id="calendarService" checked={field.value} onCheckedChange={field.onChange} />
                                                )}
                                            />
                                            <Label htmlFor="calendarService" className="text-sm font-medium">
                                                Calendar Service
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Controller
                                                name="contactsService"
                                                control={control}
                                                render={({ field }) => (
                                                    <Checkbox id="contactsService" checked={field.value} onCheckedChange={field.onChange} />
                                                )}
                                            />
                                            <Label htmlFor="contactsService" className="text-sm font-medium">
                                                Contacts Service
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Controller
                                                name="autoExpiry"
                                                control={control}
                                                render={({ field }) => (
                                                    <Checkbox id="autoExpiry" checked={field.value} onCheckedChange={field.onChange} />
                                                )}
                                            />
                                            <Label htmlFor="autoExpiry" className="text-sm font-medium">
                                                Auto-expiry
                                            </Label>
                                        </div>
                                    </div>
                                </div>

                                {/* Work Fields */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Work Fields</h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="employeeId" className="text-sm font-medium">
                                                Employee ID
                                            </Label>
                                            <Input id="employeeId" {...register("employeeId")} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="designation" className="text-sm font-medium">
                                                Designation
                                            </Label>
                                            <Input id="designation" {...register("designation")} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="department" className="text-sm font-medium">
                                                Department
                                            </Label>
                                            <Input id="department" {...register("department")} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="workMobileNumber" className="text-sm font-medium">
                                                Mobile Number
                                            </Label>
                                            <Input id="workMobileNumber" {...register("workMobileNumber")} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="extension" className="text-sm font-medium">
                                                Extension
                                            </Label>
                                            <Input id="extension" {...register("extension")} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="workPhoneNumber" className="text-sm font-medium">
                                                Phone Number
                                            </Label>
                                            <Input id="workPhoneNumber" {...register("workPhoneNumber")} />
                                        </div>
                                    </div>
                                </div>

                                {/* Custom Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Custom Information</h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="azActiveCompany" className="text-sm font-medium">
                                                az.active.company
                                            </Label>
                                            <Input id="azActiveCompany" {...register("azActiveCompany")} />
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
