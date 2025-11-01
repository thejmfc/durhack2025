"use client"
import supabase from "@/Supabase";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function Login(){
    const [formData, setFormData] = useState({email: "", password: ""})
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        console.log(formData)
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
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
        [name]: value
        }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-xl">
            <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                HackSmith
                </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                <div className="rounded-md shadow-sm -space-y-px">
                <div>
                    <input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    placeholder="Email address"
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    />
                </div>
                <div>
                    <input
                    type="password"
                    name="password"
                    onChange={handleChange}
                    placeholder="Password"
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    />
                </div>
                </div>
                <div>
                <button
                    className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 transition-colors duration-150 ease-in-out hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Sign in'}
                </button>
                </div>
                {error && (
                <div className="text-red-500 text-sm text-center">
                    {error}
                </div>
                )}
            </form>
            </div>
        </div>
    );
}