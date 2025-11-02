import Link from "next/link";
import { IoIosLogOut } from "react-icons/io";

export default function LogoutButton() {
    return (
        <Link href="/auth/logout" className="absolute top-5 right-5 bg-white rounded-full p-2">
            <IoIosLogOut className="w-6 h-6 hover:scale-110 duration-100 transform" />
        </Link>
    )
}