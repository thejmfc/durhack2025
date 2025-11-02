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
        const { error: signUpError } = await supabase.auth.signUp({ email: formData.email, password: formData.password });
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
                {`@import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@700&display=swap');`}
            </style>
            <div className="min-h-screen w-full bg-[#020617] relative">
                {/* Dark Sphere Grid Background */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        background: "#020617",
                        backgroundImage: `
                            linear-gradient(to right, rgba(71,85,105,0.3) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(71,85,105,0.3) 1px, transparent 1px),
                            radial-gradient(circle at 50% 35%, rgba(139,92,246,0.16) 0%, transparent 75%)
                        `,
                        backgroundSize: "32px 32px, 32px 32px, 100% 100%",
                    }}
                />
                {/* Faint geometric overlay */}
                <div className="pointer-events-none absolute inset-0 opacity-10 bg-[repeating-radial-gradient(circle_at_10%_10%,rgba(255,255,255,0.04),transparent_3px,transparent_15px)]"></div>
                <div className="container mx-auto px-4 py-20 flex items-center justify-center min-h-screen relative z-10">
                    <div className="w-full max-w-md bg-white/10 border border-white/10 backdrop-blur-2xl shadow-2xl rounded-3xl p-8">
                        <div className="mb-8 text-center relative">
                            {/* Gradient/glow heading */}
                            <div className="relative inline-block">
                                <h2
                                    style={{ fontFamily: "'Exo 2', 'Poppins', 'Manrope', sans-serif" }}
                                    className="
                                        text-4xl font-extrabold tracking-tight
                                        text-transparent bg-clip-text
                                        bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400
                                        drop-shadow-[0_2px_25px_rgba(139,92,246,0.5)]
                                        mb-2
                                    "
                                >
                                    Sign Up
                                </h2>
                                {/* Glowing background blur effect */}
                                <div className="
                                    absolute left-0 right-0 top-0 bottom-0
                                    rounded-lg
                                    pointer-events-none
                                    blur-lg opacity-50
                                    bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                                    -z-10
                                "/>
                            </div>
                            <p className="text-slate-300 font-light text-md">Join HackSmith today!</p>
                        </div>
                        <form className="space-y-7" onSubmit={handleSignup} autoComplete="off">
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-slate-200 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    onChange={handleChange}
                                    value={formData.email}
                                    autoComplete="email"
                                    className="block w-full rounded-lg border border-white/10 bg-white/10 backdrop-blur placeholder:text-slate-400 text-slate-100 py-3 px-4 shadow-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/50 focus:outline-none transition"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-slate-200 mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    onChange={handleChange}
                                    value={formData.password}
                                    autoComplete="new-password"
                                    className="block w-full rounded-lg border border-white/10 bg-white/10 backdrop-blur placeholder:text-slate-400 text-slate-100 py-3 px-4 shadow-md focus:border-pink-400 focus:ring-2 focus:ring-pink-300/40 focus:outline-none transition"
                                    placeholder="Choose a strong password"
                                    required
                                />
                            </div>
                            {error && (
                                <div className="text-red-400 text-sm text-center">{error}</div>
                            )}
                            <button
                                type="submit"
                                className={`w-full flex justify-center py-3 rounded-xl
                                    font-semibold transition shadow-lg
                                    ${loading
                                    ? "bg-indigo-300 cursor-not-allowed"
                                    : "bg-orange-500 focus:ring-offset-2"
                                }
                                    text-slate-50`}
                                disabled={loading}
                            >
                                {loading ? "Signing up..." : "Sign Up"}
                            </button>
                        </form>
                        <div className="text-center mt-6">
                            <a href="/auth/login" className="text-indigo-300 hover:text-pink-300 hover:underline text-sm transition">
                                Already have an account? Sign In
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
