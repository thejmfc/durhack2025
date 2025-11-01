import supabase from "@/Supabase";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Logout() {
    useEffect(() => {
        async function signOut() {
            await supabase.auth.signOut();
            redirect("/"); 
        };

        signOut();
    }, [])
}