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

        const { error: loginError } = await supabase.auth.signInWithPassword({
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
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <>
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@700&display=swap');`}
            </style>
            <div className="min-h-screen w-full bg-[#020617] relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
                {/* Geometric overlay */}
                <div className="pointer-events-none absolute inset-0 opacity-10 bg-[repeating-radial-gradient(circle_at_10%_10%,rgba(255,255,255,0.04),transparent_3px,transparent_15px)]"></div>
                <div className="max-w-md w-full bg-white/10 border border-white/10 backdrop-blur-2xl shadow-2xl rounded-3xl p-8 space-y-8 z-10 relative">
                    {/* Neon gradient heading */}
                    <div className="mb-3 text-center relative">
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
                                Hacksmith
                            </h2>
                            {/* Glowing background behind heading */}
                            <div className="
                                absolute left-0 right-0 top-0 bottom-0
                                rounded-lg
                                pointer-events-none
                                blur-lg opacity-50
                                bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                                -z-10
                            " />
                        </div>
                        <p className="text-slate-300 font-light text-md">Log in to your account</p>
                    </div>
                    <form className="space-y-7" onSubmit={handleLogin} autoComplete="off">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-slate-200 mb-1">
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
                                className="block w-full rounded-lg border border-white/10 bg-white/10 backdrop-blur placeholder:text-slate-400 text-slate-100 py-3 px-4 shadow-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/50 focus:outline-none transition"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-200 mb-1">
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
                                className="block w-full rounded-lg border border-white/10 bg-white/10 backdrop-blur placeholder:text-slate-400 text-slate-100 py-3 px-4 shadow-md focus:border-pink-400 focus:ring-2 focus:ring-pink-300/40 focus:outline-none transition"
                            />
                        </div>
                        {error && (
                            <p className="text-red-400 text-sm text-center">{error}</p>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-3 rounded-xl
                                font-semibold transition shadow-lg
                                ${loading ?
                                "bg-orange-300 cursor-not-allowed"
                                : "bg-orange-500 hover:scale-103 hover:shadow-xl focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-2"
                            }
                                text-slate-50`}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>
                    <div className="text-center mt-6">
                        <a href="/auth/signup" className="text-indigo-300 hover:text-pink-300 hover:underline text-sm transition">
                            Don&apos;t have an account? Sign Up
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
