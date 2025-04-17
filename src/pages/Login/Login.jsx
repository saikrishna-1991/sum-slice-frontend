"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Link, useNavigate } from "react-router-dom"

export default function LoginPage() {
    const [email, setEmail] = useState("")
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
                    <div className="grid grid-cols-3 gap-0.5 text-green-700">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="w-3 h-3 bg-current" />
                        ))}
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-center text-green-700">Welcome Back</h2>
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
                    <div className="text-sm">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-green-700 hover:underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </Card>
        </div>
    )
}

