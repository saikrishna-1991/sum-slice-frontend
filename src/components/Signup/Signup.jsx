"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

export default function Signup() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        // Here you would typically handle the signup logic
        // For now, we'll just redirect to the dashboard
        navigate("/dashboard")
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
                <h2 className="text-3xl font-bold text-center text-green-700">Create Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
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
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-500" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-500" />
                                )}
                            </button>
                        </div>
                    </div>
                    <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
                        Sign Up
                    </Button>
                </form>
                <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link to="/" className="text-green-700 hover:underline">
                        Log in
                    </Link>
                </div>
            </Card>
        </div>
    )
}

