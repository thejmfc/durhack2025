"use client";
import supabase from "@/Supabase";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const {  loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        });

        setLoading(false);

        if (loginError) {
            setError(loginError.message);
            return;
        } else {
            redirect("/dashboard");
        }
    }

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-10 bg-white rounded-2xl shadow-lg p-10">
                <div className="text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900">HackSmith</h2>
                    <p className="mt-2 text-sm text-gray-600">Log in to your account</p>
                </div>

                <form className="space-y-6" onSubmit={handleLogin} noValidate>
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                            placeholder="you@example.com"
                            className="block w-full rounded-md border border-gray-300 px-4 py-2 placeholder-gray-400 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none focus:ring-2 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete="current-password"
                            placeholder="••••••••"
                            className="block w-full rounded-md border border-gray-300 px-4 py-2 placeholder-gray-400 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none focus:ring-2 sm:text-sm"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <a href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    {error && (
                        <p className="mt-2 text-sm text-red-600 text-center" role="alert">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center py-3 rounded-md text-white font-semibold transition ${
                            loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 focus:ring focus:ring-indigo-400"
                        }`}
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>
            </div>
        </div>
    );
}
