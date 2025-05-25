"use client"

import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, CheckCircle, Clock, Globe, Users, XCircle } from "lucide-react"


export function TerritoryFormSummary({ formData }) {
    return (
        <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-100 mb-6">
                <h3 className="text-lg font-medium text-green-800 mb-2">Review Territory Information</h3>
                <p className="text-sm text-green-600">
                    Please review all territory information before finalizing. Click "Confirm & Save" to create the territory.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                            <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: formData.color || "#3B82F6" }}></div>
                            Basic Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-[120px_1fr] gap-y-2">
                            <span className="text-sm font-medium text-gray-500">Territory Name:</span>
                            <span className="text-sm font-semibold">{formData.territoryName || "CONFECTIONERY"}</span>

                            <span className="text-sm font-medium text-gray-500">Description:</span>
                            <span className="text-sm">{formData.description || "CONFECTIONERY"}</span>

                            <span className="text-sm font-medium text-gray-500">Parent Territory:</span>
                            <span className="text-sm">{formData.parentTerritoryName || "OU USA"}</span>

                            <span className="text-sm font-medium text-gray-500">Operating Unit:</span>
                            <span className="text-sm">{formData.operatingUnit || "OU USA"}</span>

                            <span className="text-sm font-medium text-gray-500">Priority:</span>
                            <Badge
                                variant="outline"
                                className={
                                    formData.priority === "High"
                                        ? "bg-red-100 text-red-800 hover:bg-red-100"
                                        : formData.priority === "Medium"
                                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                            : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                }
                            >
                                {formData.priority || "Medium"}
                            </Badge>

                            <span className="text-sm font-medium text-gray-500">Rank:</span>
                            <span className="text-sm">{formData.rank || "100"}</span>

                            <span className="text-sm font-medium text-gray-500">Winners:</span>
                            <span className="text-sm">{formData.winners || "1"}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            Dates & Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-[120px_1fr] gap-y-2">
                            <span className="text-sm font-medium text-gray-500">Start Date:</span>
                            <span className="text-sm flex items-center">
                                <CalendarIcon className="w-3 h-3 mr-1" />
                                {formData.startDate ? format(new Date(formData.startDate), "dd-MMM-yyyy") : "12-Feb-2012"}
                            </span>

                            <span className="text-sm font-medium text-gray-500">End Date:</span>
                            <span className="text-sm flex items-center">
                                <CalendarIcon className="w-3 h-3 mr-1" />
                                {formData.endDate ? format(new Date(formData.endDate), "dd-MMM-yyyy") : "31-Dec-2099"}
                            </span>

                            <span className="text-sm font-medium text-gray-500">Commission:</span>
                            <span className="text-sm">{formData.brokerCommission || "0"}%</span>

                            <span className="text-sm font-medium text-gray-500">Region:</span>
                            <span className="text-sm">{formData.region || "—"}</span>

                            <span className="text-sm font-medium text-gray-500">Country Unit:</span>
                            <span className="text-sm">{formData.countryUnit || "—"}</span>

                            <span className="text-sm font-medium text-gray-500">Approval #:</span>
                            <span className="text-sm">{formData.alternateApproval || "—"}</span>

                            <span className="text-sm font-medium text-gray-500">Price List:</span>
                            <span className="text-sm">{formData.priceList || "—"}</span>

                            <span className="text-sm font-medium text-gray-500">Allocation:</span>
                            <span className="text-sm flex items-center">
                                {formData.allocationEnabled ? (
                                    <>
                                        <CheckCircle className="w-3 h-3 text-green-500 mr-1" /> Enabled
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-3 h-3 text-red-500 mr-1" /> Disabled
                                    </>
                                )}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            Assigned Resources
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {formData.resources && formData.resources.length > 0 ? (
                            <div className="space-y-2">
                                {formData.resources.map((resource, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                                                {resource.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="ml-2">
                                                <div className="text-sm font-medium">{resource.name}</div>
                                                <div className="text-xs text-gray-500">{resource.role}</div>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                            {resource.access}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500 italic">No resources assigned</div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                            <Globe className="w-4 h-4 mr-2" />
                            Geography
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium mb-2">Selected Regions</h4>
                                {formData.selectedRegions && formData.selectedRegions.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.selectedRegions.map((region, index) => (
                                            <Badge key={index} variant="secondary">
                                                {region}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-500 italic">No regions selected</div>
                                )}
                            </div>

                            <div>
                                <h4 className="text-sm font-medium mb-2">Selected Postal Codes</h4>
                                {formData.selectedPostalCodes && formData.selectedPostalCodes.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.selectedPostalCodes.map((code, index) => (
                                            <Badge key={index} variant="outline">
                                                {code}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-500 italic">No postal codes selected</div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
