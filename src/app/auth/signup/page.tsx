"use client"
import supabase from "@/Supabase";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function Signup(){
    const [formData, setFormData] = useState({email: "", password: ""})
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        console.log(formData)
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
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
        <form onSubmit={handleSignup}>
            <input type="email" name="email" onChange={handleChange} placeholder="Email" />
            <input type="password" name="password" onChange={handleChange} placeholder="Password" />
            <button className={`${loading ? 'disabled' : ''}`}>{loading ? 'Loading...' : 'Signup'}</button>
            {error}
        </form>

    );
}