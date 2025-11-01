
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function NavBar(){
    const { user, session } = useAuth();
    
    return (
        <div className="flex max-w-screen justify-center">

            <nav className="flex w-3/4 bg-gray-200 p-7 rounded-3xl z-50 mt-5 absolute">
                {/* Default Links */}
                <div className="flex gap-2">

                    <Link 
                        href={"/"}
                        className="py-2 px-7"
                    >{process.env.NEXT_PUBLIC_APP_NAME}</Link>
                    <Link 
                        href={"/pricing"}
                        className="px-7 py-2 rounded-2xl border border-gray-400 hover:rounded-md transition-all duration-200"
                    >Pricing</Link>
                    <Link 
                        href={"/about"}
                        className="px-7 py-2 rounded-2xl border border-gray-400 hover:rounded-md transition-all duration-200"
                    >About</Link>
                </div>

                {/* Links based on Auth state */}
                {user && 
                    <div className="flex gap-2 ml-auto">
                        <Link
                            href={"/dashboard"}
                            className="px-7 py-2 rounded-2xl border border-gray-400 hover:rounded-md transition-all duration-200"
                        >Dashboard</Link>
                        <Link 
                            href={"/"} 
                            onClick={() => {supabase.auth.signOut()}}
                            className="px-7 py-2 rounded-2xl border border-gray-400 hover:rounded-md transition-all duration-200"
                        >Logout</Link>
                    </div>
                }
                {!user && 
                    <div className="flex gap-2 ml-auto">
                        
                        <Link 
                            href={"/auth?v=login"}
                            className="px-7 py-2 rounded-2xl border border-gray-400 hover:rounded-md transition-all duration-200"
                        >Login</Link>

                        <Link 
                            href={"/auth?v=signup"}
                            className="px-7 py-2 rounded-2xl border border-gray-400 hover:rounded-md transition-all duration-200"
                        >Signup</Link>

                    </div>
                }
            </nav>
        </div>
    )
}