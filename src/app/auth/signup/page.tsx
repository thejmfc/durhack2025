"use client";
import supabase from "@/Supabase";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function Signup() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error: signUpError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
        });

        setLoading(false);

        if (signUpError) {
            setError(signUpError.message);
            return;
        } else {
            redirect("/dashboard");
        }
    }

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <>
            {/* Import Google Font Exo 2 */}
            <style>
                {`
          @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@700&display=swap');
        `}
            </style>
            <div className="min-h-screen relative bg-gradient-to-tr from-indigo-100 via-indigo-200 to-blue-200 animate-bgGradientSlow">
                {/* Background pattern */}
                <div className="pointer-events-none absolute inset-0 opacity-10 bg-[repeating-radial-gradient(circle_at_10%_10%,rgba(0,0,0,0.02),rgba(0,0,0,0.02)_2px,transparent_3px,transparent_15px)]"></div>
                <div className="container mx-auto px-8 py-20 flex items-center justify-center h-full relative z-10">
                    <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10">
                        <div className="mb-6 text-center">
                            <h2
                                className="text-4xl font-extrabold text-gray-900 mb-1 tracking-tight"
                                style={{ fontFamily: "'Exo 2', sans-serif" }}
                            >
                                Sign Up
                            </h2>
                            <p className="text-gray-700 font-light">Join HackSmith today!</p>
                        </div>
                        <form className="space-y-7" onSubmit={handleSignup} autoComplete="off">
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    onChange={handleChange}
                                    value={formData.email}
                                    autoComplete="email"
                                    className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 placeholder-gray-400 text-gray-900 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 focus:outline-none transition sm:text-sm"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    onChange={handleChange}
                                    value={formData.password}
                                    autoComplete="new-password"
                                    className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 placeholder-gray-400 text-gray-900 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 focus:outline-none transition sm:text-sm"
                                    placeholder="Choose a strong password"
                                    required
                                />
                            </div>
                            {error && (
                                <div className="text-red-500 text-sm text-center">{error}</div>
                            )}
                            <button
                                type="submit"
                                className={`w-full flex justify-center py-3 rounded-xl text-white font-semibold transition ${
                                    loading
                                        ? "bg-indigo-300 cursor-not-allowed"
                                        : "bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400"
                                }`}
                                disabled={loading}
                            >
                                {loading ? "Signing up..." : "Sign Up"}
                            </button>
                        </form>
                        <div className="text-center mt-6">
                            <a href="/auth/login" className="text-indigo-600 hover:underline text-sm">
                                Already have an account? Sign In
                            </a>
                        </div>
                    </div>
                </div>
                {/* Animate gradient background COLORS */}
                <style>{`
          @keyframes bgGradientSlow {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-bgGradientSlow {
            background-size: 200% 200%;
            animation: bgGradientSlow 40s ease infinite;
          }
        `}</style>
            </div>
        </>
    );
}
