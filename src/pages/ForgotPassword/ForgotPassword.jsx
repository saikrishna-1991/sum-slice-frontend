"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Link, useNavigate } from "react-router-dom"

export default function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        // Here you would typically handle the password reset logic
        setSubmitted(true)
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <Card className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-xl">
                <div className="flex justify-center">
                    <div className="grid grid-cols-3 gap-0.5 text-green-700">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="w-3 h-3 bg-current" />
                        ))}
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-center text-green-700">Reset Password</h2>
                {!submitted ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
                            Reset Password
                        </Button>
                    </form>
                ) : (
                    <div className="text-center text-green-700">Password reset instructions have been sent to your email.</div>
                )}
                <div className="text-center text-sm">
                    Remember your password?{" "}
                    <Link to="/login" className="text-green-700 hover:underline">
                        Log in
                    </Link>
                </div>
            </Card>
        </div>
    )
}

