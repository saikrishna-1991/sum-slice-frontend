"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Link, useNavigate } from "react-router-dom"

export default function LoginPage() {
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        // Here you would typically handle the login logic
        // For now, we'll just set a flag in localStorage and redirect to the dashboard
        localStorage.setItem("isLoggedIn", "true")
        navigate("/dashboard")
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <Card className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-xl">
                <div className="flex justify-center">
                    <div className="flex justify-center">
                        <img src="./sum-slice-logo.png" alt="Logo" />
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-center text-green-700">Welcome Back</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="userName">User Name</Label>
                        <Input
                            id="userName"
                            type="text"
                            placeholder="Enter your username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
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
                        Log In
                    </Button>
                </form>
                <div className="text-center space-y-2">
                    <Link to="/forgot-password" className="text-sm text-green-700 hover:underline">
                        Forgot your password?
                    </Link>
                </div>
            </Card>
        </div>
    )
}
