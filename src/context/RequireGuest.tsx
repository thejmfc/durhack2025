"use client"
import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { usePathname, useRouter } from "next/navigation";

export default function RequireGuest({ children } : { children: ReactNode }){
    const { user, session } = useAuth();
    const router = useRouter()
    const pathname = usePathname()

    const [checked, setChecked] = useState(false)

    useEffect(() => {
        if (user) {
            router.replace("/dashboard")
        } else {
            setChecked(true)
        }
    }, [user, pathname, router])

    if (!checked) return null

    return <>{children}</>
}