import Link from "next/link";
import { CiLogout } from "react-icons/ci";

export default function LogoutButton() {
    return (
        <Link href="/auth/logout" className="absolute top-5 left-5">
            <CiLogout className="w-6 h-6 hover:scale-110 duration-100 transform" />
        </Link>
    )
}