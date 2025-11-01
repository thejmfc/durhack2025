"use client"
import supabase from "@/src/Supabase";
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
        <form onSubmit={handleLogin}>
            <input type="email" name="email" onChange={handleChange} placeholder="Email" />
            <input type="password" name="password" onChange={handleChange} placeholder="Password" />
            <button className={`${loading ? 'disabled' : ''}`}>{loading ? 'Loading...' : 'Login'}</button>
            {error}
        </form>

    );
}