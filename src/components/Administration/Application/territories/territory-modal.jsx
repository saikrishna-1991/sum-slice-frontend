"use client"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { TerritoryDetailsForm } from "./territory-details-form"
import { TerritoryRoleAccessForm } from "./territory-role-access-form"
import { TerritoryGeographyForm } from "./territory-geography-form"
import { TerritoryFormSummary } from "./territory-form-summary"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronRight, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function TerritoryModal({ isOpen, onClose, initialData, mode }) {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState(initialData || {})
    const [formErrors, setFormErrors] = useState({})
    const [showSummary, setShowSummary] = useState(false)

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || {})
            setStep(1)
            setShowSummary(false)
            setFormErrors({})
        }
    }, [isOpen, initialData])

    const updateFormData = useCallback((newData) => {
        setFormData((prev) => ({ ...prev, ...newData }))
    }, [])

    const validateStep = (stepNumber) => {
        // No validation required - all fields are optional
        setFormErrors({})
        return true
    }

    const handleNext = () => {
        console.log("handleNext called, current step:", step)
        if (validateStep(step)) {
            console.log("Validation passed, advancing to next step")
            if (step === 3) {
                setShowSummary(true)
            } else {
                setStep((prevStep) => prevStep + 1)
            }
        } else {
            console.log("Validation failed, errors:", formErrors)
        }
    }

    const handleBack = () => {
        if (showSummary) {
            setShowSummary(false)
        } else {
            setStep(Math.max(1, step - 1))
        }
    }

    const handleFinish = () => {
        // Here you would typically save the data
        console.log("Form submitted:", formData)
        onClose()
        setStep(1)
        setShowSummary(false)
    }

    const handleCancel = () => {
        onClose()
        setStep(1)
        setShowSummary(false)
    }

    const title = mode === "create" ? "Create Territory" : "Update Territory"
    const steps = ["Enter Details", "Assign Resources", "Define Geography"]

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <p className="text-sm opacity-80">
                        {mode === "create" ? "Create a new territory" : "Update existing territory details"}
                    </p>
                </div>

                {!showSummary && (
                    <div className="p-4 border-b bg-gray-50">
                        <div className="flex items-center justify-between">
                            {steps.map((stepName, index) => (
                                <div key={index} className="flex items-center">
                                    <div
                                        className={`flex items-center justify-center w-8 h-8 rounded-full ${step > index + 1
                                            ? "bg-green-500 text-white"
                                            : step === index + 1
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-200 text-gray-500"
                                            } transition-colors duration-200`}
                                    >
                                        {step > index + 1 ? <Check className="h-4 w-4" /> : index + 1}
                                    </div>
                                    <span
                                        className={`ml-2 font-medium ${step === index + 1 ? "text-blue-600" : step > index + 1 ? "text-green-600" : "text-gray-500"
                                            }`}
                                    >
                                        {stepName}
                                    </span>
                                    {index < steps.length - 1 && <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />}
                                </div>
                            ))}
                        </div>
                        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
                                style={{ width: `${(step / steps.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {showSummary ? (
                            <motion.div
                                key="summary"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <TerritoryFormSummary formData={formData} />
                            </motion.div>
                        ) : step === 1 ? (
                            <motion.div
                                key="details"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <TerritoryDetailsForm
                                    onNext={handleNext}
                                    onCancel={handleCancel}
                                    initialData={formData}
                                    updateFormData={updateFormData}
                                    errors={formErrors}
                                />
                            </motion.div>
                        ) : step === 2 ? (
                            <motion.div
                                key="resources"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <TerritoryRoleAccessForm
                                    onNext={handleNext}
                                    onBack={handleBack}
                                    onCancel={handleCancel}
                                    onFinish={handleFinish}
                                    initialData={formData}
                                    updateFormData={updateFormData}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="geography"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <TerritoryGeographyForm
                                    onNext={handleNext}
                                    onBack={handleBack}
                                    onCancel={handleCancel}
                                    onFinish={handleFinish}
                                    initialData={formData}
                                    updateFormData={updateFormData}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="sm" className="flex items-center">
                                    <HelpCircle className="h-4 w-4 mr-1" />
                                    Help
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-sm">
                                <p>
                                    {showSummary
                                        ? "Review your territory information before finalizing"
                                        : step === 1
                                            ? "Enter basic territory information for this territory"
                                            : step === 2
                                                ? "Assign resources and roles to this territory"
                                                : "Define the geographical boundaries of this territory"}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <div className="flex items-center space-x-2">
                        <Button variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        {(step > 1 || showSummary) && (
                            <Button variant="outline" onClick={handleBack}>
                                Back
                            </Button>
                        )}
                        {showSummary ? (
                            <Button onClick={handleFinish} className="bg-green-600 hover:bg-green-700">
                                Confirm & Save
                            </Button>
                        ) : (
                            <Button onClick={handleNext}>{step === 3 ? "Review" : "Next"}</Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
