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

        const {error: loginError } = await supabase.auth.signInWithPassword({
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-100 via-indigo-200 to-blue-200 animate-bgGradientSlow py-12 px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 space-y-8 relative z-10">
                <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight mb-2" style={{ fontFamily: "'Exo 2', sans-serif" }}>
                    Hacksmith
                </h2>
                <p className="text-center text-gray-700 mb-8 font-light">
                    Log in to your account
                </p>
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
            <style>{`
        @keyframes bgGradientSlow {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-bgGradientSlow {
          background-size: 200% 200%;
          animation: bgGradientSlow 40s ease infinite;
        }
      `}</style>
        </div>
    );
}
